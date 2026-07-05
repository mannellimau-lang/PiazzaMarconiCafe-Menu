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

async function runAgent(id, scriptName) {
    return new Promise((resolve) => {
        const scriptPath = path.join(__dirname, 'agents', 'python_brains', scriptName);
        console.log(`Running Agent ${id}...`);
        exec(`${venvPython} ${scriptPath}`, (error, stdout, stderr) => {
            try {
                if (!stdout || stdout.trim() === "null" || stdout.trim() === "") {
                    console.error(`Agent ${id} returned empty or null stdout. Stderr:`, stderr);
                    resolve({ id, problems: [`Execution Error: Empty model output (quota limit or syntax error).`], solutions: ["Check API Key / quota limit"] });
                    return;
                }
                const result = JSON.parse(stdout);
                if (result.error) {
                    console.error(`Agent ${id} error:`, result.error);
                    resolve({ id, problems: [result.error], solutions: ["Verify config"] });
                } else {
                    console.log(`Agent ${id} success!`);
                    resolve({ id, problems: result.problemsFound, solutions: result.solutionsProposed });
                }
            } catch (e) {
                console.error(`Agent ${id} parse error:`, e, "stdout:", stdout, "stderr:", stderr);
                resolve({ id, problems: ["Parse error"], solutions: ["Check logs"] });
            }
        });
    });
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
    });
    
    ledger.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
    console.log("Ledger updated!");
    
    // Send email
    await sendEmail(ledger);

    console.log("✅ All agents completed successfully!");
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

    let emailText = "☕️ THE SIMS: PIAZZA MARCONI CAFE - REPORT AGGIORNATO ☕️\n\n";
    emailText += "Ecco il resoconto esecutivo di oggi elaborato dai tuoi 6 agenti virtuali con i dati corretti:\n\n";
    
    Object.keys(ledgerData.agents).forEach(id => {
        const agent = ledgerData.agents[id];
        emailText += `--- Agente ${id}: ${agent.name} ---\n`;
        emailText += `Problemi:\n${agent.problemsFound ? agent.problemsFound.map(p => ` - ${p}`).join('\n') : ' - Nessuno'}\n`;
        emailText += `Soluzioni:\n${agent.solutionsProposed ? agent.solutionsProposed.map(s => ` - ${s}`).join('\n') : ' - Nessuna'}\n\n`;
    });
    
    emailText += "Buon lavoro!\nIl tuo Orchestratore.";

    const mailOptions = {
        from: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'simonemannellimaria@gmail.com',
        to: 'simonemannellimaria@gmail.com',
        subject: '☕️ Morning Report: Piazza Marconi Cafe',
        text: emailText
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
