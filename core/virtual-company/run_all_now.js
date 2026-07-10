const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LEDGER_PATH = path.join(__dirname, 'logs', 'time_ledger.json');

// On CI (GitHub Actions), use system python3; locally, use the venv
const venvPython = process.env.CI
    ? 'python3'
    : path.join(__dirname, 'agents', 'python_brains', 'venv', 'bin', 'python3');

const pythonScriptsMap = {
    '1': 'agent_1_social_content.py',
    '2': 'agent_2_market_seo.py',
    '3': 'agent_3_compliance_ux.py',
    '4': 'agent_4_strategy_metrics.py',
    '5': 'agent_5_motivator.py',
    '6': 'agent_6_ceo.py'
};

const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));

const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash"];

async function runAgent(id, scriptName) {
    const scriptPath = path.join(__dirname, 'agents', 'python_brains', scriptName);
    let lastError = null;
    let lastStderr = "";
    
    for (const model of FALLBACK_MODELS) {
        console.log(`Running Agent ${id} with model ${model}...`);
        const result = await new Promise((resolve) => {
            const env = { ...process.env, GEMINI_MODEL: model };
            exec(`${venvPython} ${scriptPath}`, { env }, (error, stdout, stderr) => {
                const timestamp = new Date().toLocaleTimeString();
                lastStderr = stderr || "";
                try {
                    if (!stdout || stdout.trim() === "null" || stdout.trim() === "") {
                        console.error(`Agent ${id} returned empty or null stdout with model ${model}. Stderr:`, stderr);
                        
                        const isPythonCodeCrash = stderr && (
                            stderr.includes("ModuleNotFoundError") ||
                            stderr.includes("SyntaxError") ||
                            stderr.includes("IndentationError") ||
                            stderr.includes("NameError") ||
                            stderr.includes("ImportError") ||
                            stderr.includes("AttributeError") ||
                            stderr.includes("TypeError") ||
                            stderr.includes("FileNotFoundError")
                        );
                        
                        if (isPythonCodeCrash) {
                            resolve({
                                id,
                                problems: [`Python Runtime/Dependency Error: ${stderr.split('\n').filter(Boolean).pop() || 'Crash'}`],
                                solutions: ["Check python code syntax and dependencies in requirements.txt"],
                                stderr: stderr || "",
                                status: 'Failure',
                                modelUsed: model,
                                logs: [`[${timestamp}] [!] Python Code Crash: ${stderr.substring(0, 100)}...`]
                            });
                        } else {
                            resolve({
                                retry: true,
                                error: `Empty model output. Stderr: ${stderr}`
                            });
                        }
                        return;
                    }
                    
                    const parsed = JSON.parse(stdout);
                    if (parsed.error) {
                        console.error(`Agent ${id} error with model ${model}:`, parsed.error);
                        const errLower = parsed.error.toLowerCase();
                        // If it's a rate limit, quota limit, model availability, 404, or deprecation error, trigger fallback retry
                        if (
                            errLower.includes('429') || 
                            errLower.includes('quota') || 
                            errLower.includes('exhausted') || 
                            errLower.includes('limit') || 
                            errLower.includes('unreachable') || 
                            errLower.includes('rate') ||
                            errLower.includes('404') ||
                            errLower.includes('not found') ||
                            errLower.includes('available') ||
                            errLower.includes('deprecated')
                        ) {
                            resolve({ retry: true, error: parsed.error });
                        } else {
                            // Non-quota/non-model error, resolve as failure immediately
                            resolve({
                                id,
                                problems: parsed.problemsFound || [parsed.error],
                                solutions: parsed.solutionsProposed || ["Verify config"],
                                stderr: stderr || "",
                                status: 'Failure',
                                modelUsed: model,
                                logs: [`[${timestamp}] [!] Error: ${parsed.error.substring(0, 100)}...`]
                            });
                        }
                    } else {
                        console.log(`Agent ${id} success with model ${model}!`);
                        resolve({
                            id,
                            problems: parsed.problemsFound || [],
                            solutions: parsed.solutionsProposed || [],
                            stderr: stderr || "",
                            status: 'Success',
                            modelUsed: model,
                            logs: [`[${timestamp}] [SUCCESS] Completed with ${model}.`]
                        });
                    }
                } catch (e) {
                    console.error(`Agent ${id} parse error with model ${model}:`, e, "stdout:", stdout, "stderr:", stderr);
                    resolve({
                        id,
                        problems: ["Parse error"],
                        solutions: ["Check logs"],
                        stderr: stderr || "",
                        status: 'Failure',
                        modelUsed: model,
                        logs: [`[${timestamp}] [!] Parse error on ${model}: ${e.message}`]
                    });
                }
            });
        });
        
        if (!result.retry) {
            return result;
        }
        lastError = result.error;
        console.warn(`Agent ${id} hit quota limit on model ${model}. Attempting fallback model...`);
        // Wait 5 seconds to respect rate limits before fallback retry
        await new Promise(r => setTimeout(r, 5000));
    }
    
    // If all models failed
    const timestamp = new Date().toLocaleTimeString();
    return {
        id,
        problems: [`Execution Error: All fallback models exhausted. Last error: ${lastError || "Quota Limit"}`],
        solutions: ["Check Gemini billing or usage limits"],
        stderr: lastStderr,
        status: 'Failure',
        modelUsed: "None",
        logs: [`[${timestamp}] [!] Quota exceeded on all models.`]
    };
}

async function main() {
    const ids = ['1', '2', '3', '4', '5', '6'];
    const results = [];
    
    // Run them sequentially with a 65-second delay to avoid 429 rate limit
    for (const id of ids) {
        const res = await runAgent(id, pythonScriptsMap[id]);
        results.push(res);
        if (id !== '6') {
            console.log("Waiting 65 seconds to respect rate limits...");
            await new Promise(r => setTimeout(r, 65000));
        }
    }
    
    // Update ledger
    results.forEach(res => {
        const agent = ledger.agents[res.id];
        agent.problemsFound = res.problems;
        agent.solutionsProposed = res.solutions;
        agent.state = 'STAGING';
        agent.accumulatedMinutes = 55;
        agent.status = res.status;
        agent.modelUsed = res.modelUsed;
        agent.stderr = res.stderr;
        if (res.logs) {
            if (!agent.logs) agent.logs = [];
            agent.logs = res.logs.concat(agent.logs).slice(0, 5); // Keep last 5 log entries
        }
    });
    
    ledger.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
    console.log("Ledger updated!");
    
    // Send email
    await sendEmail(ledger);

    console.log("✅ All agents execution completed!");
    process.exit(0);
}

function sendEmail(ledgerData) {
    return new Promise((resolve, reject) => {
        if (!process.env.GMAIL_APP_PASSWORD) {
            console.log("Skipping email: GMAIL_APP_PASSWORD is not set in .env");
            return resolve();
        }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'simonemannellimaria@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // 1. Text plain fallback
        let emailText = "☕️ THE SIMS: PIAZZA MARCONI CAFE - REPORT AGGIORNATO ☕️\n\n";
        emailText += "Ecco il resoconto esecutivo di oggi elaborato dai tuoi 6 agenti virtuali:\n\n";
        
        Object.keys(ledgerData.agents).forEach(id => {
            const agent = ledgerData.agents[id];
            emailText += `--- Agente ${id}: ${agent.name} [Stato: ${agent.status || 'Unknown'}] ---\n`;
            emailText += `Modello: ${agent.modelUsed || 'N/A'}\n`;
            emailText += `Problemi:\n${agent.problemsFound ? agent.problemsFound.map(p => ` - ${p}`).join('\n') : ' - Nessuno'}\n`;
            emailText += `Soluzioni:\n${agent.solutionsProposed ? agent.solutionsProposed.map(s => ` - ${s}`).join('\n') : ' - Nessuna'}\n`;
            if (agent.stderr) {
                emailText += `Traceback:\n${agent.stderr}\n`;
            }
            emailText += `\n`;
        });
        emailText += "Buon lavoro!\nIl tuo Orchestratore.";

        // 2. Responsive HTML layout
        let emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Morning Report: Piazza Marconi Cafe</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e1e4e8;
        }
        .header {
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #b0b0b0;
        }
        .content {
            padding: 24px;
        }
        .agent-card {
            border: 1px solid #eaeaea;
            border-radius: 6px;
            margin-bottom: 20px;
            background-color: #fafafa;
            overflow: hidden;
        }
        .agent-header {
            background-color: #f0f0f0;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eaeaea;
        }
        .agent-name {
            font-weight: 600;
            font-size: 14px;
            color: #222222;
        }
        .badge {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 4px;
        }
        .badge-success {
            background-color: #e6f4ea;
            color: #137333;
        }
        .badge-failure {
            background-color: #fce8e6;
            color: #c5221f;
        }
        .agent-body {
            padding: 16px;
        }
        .model-info {
            font-size: 12px;
            color: #666666;
            margin-bottom: 12px;
            font-style: italic;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
            margin: 12px 0 4px 0;
        }
        ul {
            margin: 0;
            padding-left: 20px;
            font-size: 13px;
            color: #444444;
        }
        li {
            margin-bottom: 4px;
        }
        .traceback {
            background-color: #1e1e1e;
            color: #f1f1f1;
            padding: 12px;
            border-radius: 4px;
            font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 12px;
            white-space: pre-wrap;
            overflow-x: auto;
            margin-top: 12px;
            border: 1px solid #333333;
        }
        .footer {
            background-color: #fafafa;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eaeaea;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>☕️ Piazza Marconi Cafe</h1>
            <p>Virtual Company - Daily Agent Performance Report</p>
        </div>
        <div class="content">
        `;

        Object.keys(ledgerData.agents).forEach(id => {
            const agent = ledgerData.agents[id];
            const isSuccess = agent.status === 'Success';
            const badgeClass = isSuccess ? 'badge-success' : 'badge-failure';
            const badgeText = isSuccess ? 'Success' : 'Failure';
            
            emailHtml += `
            <div class="agent-card">
                <div class="agent-header">
                    <span class="agent-name">Agent ${id}: ${agent.name}</span>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="agent-body">
                    <div class="model-info">Model: ${agent.modelUsed || 'N/A'}</div>
                    
                    <div class="section-title">Problems Found</div>
                    <ul>
                        ${agent.problemsFound && agent.problemsFound.length > 0 
                            ? agent.problemsFound.map(p => `<li>${p}</li>`).join('') 
                            : '<li>None</li>'}
                    </ul>
                    
                    <div class="section-title">Solutions Proposed</div>
                    <ul>
                        ${agent.solutionsProposed && agent.solutionsProposed.length > 0 
                            ? agent.solutionsProposed.map(s => `<li>${s}</li>`).join('') 
                            : '<li>None</li>'}
                    </ul>
            `;
            
            if (agent.stderr && agent.stderr.trim() !== '') {
                emailHtml += `
                    <div class="section-title" style="color: #c5221f;">Python Traceback (Stderr)</div>
                    <pre class="traceback">${agent.stderr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                `;
            }
            
            emailHtml += `
                </div>
            </div>
            `;
        });

        emailHtml += `
        </div>
        <div class="footer">
            Buon lavoro!<br>Il tuo Orchestratore Multi-Agente.
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'simonemannellimaria@gmail.com',
            to: 'simonemannellimaria@gmail.com',
            subject: '☕️ Morning Report: Piazza Marconi Cafe',
            text: emailText,
            html: emailHtml
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("⚠️ Email send failed (non-fatal):", error.message);
                resolve(); // Don't crash the workflow if email fails
            } else {
                console.log("Email sent successfully: " + info.response);
                resolve(info);
            }
        });
    }); // close Promise
}

main().catch(err => {
    console.error("❌ Fatal error:", err);
    process.exit(1);
});
