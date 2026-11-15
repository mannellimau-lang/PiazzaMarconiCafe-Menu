#!/usr/bin/env node
/**
 * run_all_now.js — punto d'ingresso del report agentico "Virtual Company".
 *
 *   node run_all_now.js              esecuzione reale + invio email
 *   node run_all_now.js --no-email   esecuzione reale senza email
 *   node run_all_now.js --dry-run    nessuna chiamata AI, nessuna email: verifica che il flusso funzioni
 *
 * Flusso: questo script avvia UNA volta `agents/python_brains/run_report.py` (che gestisce modelli,
 * fallback e retry), aggiorna il registro logs/time_ledger.json e invia l'email di riepilogo.
 * Garanzie di robustezza:
 *   - timeout rigido sul processo Python (niente più esecuzioni appese);
 *   - il registro viene creato da zero se manca o è corrotto;
 *   - l'email parte SEMPRE, anche se l'AI non è disponibile (report "degradato" ed esplicito);
 *   - codice di uscita 1 solo se nessun agente ha prodotto un'analisi AI (così il cron lo segnala).
 *
 * Variabili d'ambiente: vedi .env.example nella radice del repository.
 */
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const NO_EMAIL = args.has('--no-email') || DRY_RUN;

// In dry-run si scrive su un file separato per non sporcare il registro reale.
const LEDGER_PATH = path.join(__dirname, 'logs', DRY_RUN ? 'time_ledger.dry-run.json' : 'time_ledger.json');
const BRAINS_DIR = path.join(__dirname, 'agents', 'python_brains');
const PROCESS_TIMEOUT_MS = Number(process.env.AGENT_PROCESS_TIMEOUT_MS || 12 * 60 * 1000);

const AGENT_NAMES = {
    '1': 'Social & Content Director',
    '2': 'Market Intelligence & SEO Analyst',
    '3': 'Risk, UI/UX & Compliance Officer',
    '4': 'Strategy & Data Analyst',
    '5': 'Continuous Improvement Motivator',
    '6': 'Chief Executive Supervisor'
};

function resolvePython() {
    if (process.env.AGENT_PYTHON) return process.env.AGENT_PYTHON;
    const venv = path.join(BRAINS_DIR, 'venv', 'bin', 'python3');
    return !process.env.CI && fs.existsSync(venv) ? venv : 'python3';
}

function loadLedger() {
    try {
        const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
        if (ledger && ledger.agents) return ledger;
    } catch (e) { /* mancante o corrotto: si ricrea */ }
    const agents = {};
    for (const [id, name] of Object.entries(AGENT_NAMES)) {
        agents[id] = { name, state: 'IDLE', accumulatedMinutes: 0, dailyQuota: 60, logs: [] };
    }
    return { lastUpdated: null, agents };
}

function saveLedger(ledger) {
    fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
    const tmp = LEDGER_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2));
    fs.renameSync(tmp, LEDGER_PATH); // scrittura atomica: mai un file a metà
}

function runPythonReport() {
    return new Promise((resolve) => {
        const pyArgs = [path.join(BRAINS_DIR, 'run_report.py')];
        if (DRY_RUN) pyArgs.push('--dry-run');
        const child = execFile(resolvePython(), pyArgs, {
            env: process.env,
            timeout: PROCESS_TIMEOUT_MS,
            killSignal: 'SIGKILL',
            maxBuffer: 20 * 1024 * 1024
        }, (error, stdout, stderr) => {
            let report = null;
            try { report = JSON.parse(String(stdout).trim().split('\n').pop()); } catch (e) { /* gestito sotto */ }
            if (report && report.agents) return resolve({ report });
            const reason = error && error.killed
                ? `Timeout: il processo Python non ha risposto entro ${Math.round(PROCESS_TIMEOUT_MS / 60000)} minuti`
                : error && error.code === 'ENOENT'
                    ? 'Python non trovato: installa Python 3 o imposta AGENT_PYTHON'
                    : `Il processo Python non ha prodotto un report valido${error ? ` (exit ${error.code})` : ''}`;
            resolve({ report: null, reason, stderr: String(stderr || '').slice(-1500) });
        });
        child.stderr.on('data', (d) => process.stderr.write(d)); // log in tempo reale
    });
}

async function main() {
    console.log(`▶ Report agentico${DRY_RUN ? ' (DRY-RUN)' : ''} avviato...`);
    const ledger = loadLedger();
    const { report, reason, stderr } = await runPythonReport();
    const timestamp = new Date().toLocaleTimeString('it-IT');

    for (const [id, name] of Object.entries(AGENT_NAMES)) {
        const agent = ledger.agents[id] || (ledger.agents[id] = { name, logs: [] });
        const res = report ? report.agents[id] : null;
        agent.name = name;
        agent.state = 'STAGING';
        agent.status = res ? res.status : 'Failure';
        agent.modelUsed = res ? res.modelUsed : 'nessuno';
        agent.problemsFound = res ? res.problemsFound : [`Errore di esecuzione: ${reason}`];
        agent.solutionsProposed = res ? res.solutionsProposed : ['Eseguire "node run_all_now.js --dry-run" e controllare i log.'];
        agent.stderr = res ? '' : (stderr || '');
        const line = `[${timestamp}] [${agent.status === 'Success' ? 'SUCCESS' : '!'}] ${agent.status} (${agent.modelUsed})`;
        agent.logs = [line].concat(agent.logs || []).slice(0, 5);
    }
    ledger.lastUpdated = new Date().toISOString();
    ledger.lastRun = report
        ? { mode: report.mode, llmCalls: report.llmCalls, durationSeconds: report.durationSeconds, siteHealth: report.siteHealth }
        : { mode: 'failed', reason };
    saveLedger(ledger);

    const statuses = Object.values(ledger.agents).map((a) => a.status);
    const ok = statuses.filter((st) => st === 'Success').length;
    console.log(`Registro aggiornato. Agenti con analisi AI: ${ok}/${statuses.length} — modalità: ${ledger.lastRun.mode}`);

    if (NO_EMAIL) console.log('Email non inviata (--no-email / --dry-run).');
    else await sendEmail(ledger);

    process.exit(ok > 0 ? 0 : 1);
}

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sendEmail(ledgerData) {
    return new Promise((resolve, reject) => {
        const nodemailer = require('nodemailer');
        const sender = process.env.REPORT_SENDER_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
        const recipient = process.env.REPORT_RECIPIENT_EMAIL || sender;
        if (!process.env.GMAIL_APP_PASSWORD || !sender) {
            console.log("Email non inviata: impostare GMAIL_APP_PASSWORD e NEXT_PUBLIC_CONTACT_EMAIL (o REPORT_SENDER_EMAIL).");
            return resolve();
        }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender,
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

        const run = ledgerData.lastRun || {};
        emailHtml += `
            <div class="model-info">Modalità: ${escapeHtml(run.mode || 'n/d')} · chiamate AI: ${escapeHtml(run.llmCalls ?? 'n/d')} · durata: ${escapeHtml(run.durationSeconds ?? 'n/d')}s</div>
            ${run.siteHealth ? `<div class="section-title">Stato dei siti (controllo automatico)</div><pre class="traceback">${escapeHtml(run.siteHealth)}</pre><br>` : ''}
        `;

        Object.keys(ledgerData.agents).forEach(id => {
            const agent = ledgerData.agents[id];
            const isSuccess = agent.status === 'Success';
            const badgeClass = isSuccess ? 'badge-success' : 'badge-failure';
            const badgeText = isSuccess ? 'Success' : (agent.status === 'Degraded' ? 'AI non disponibile' : 'Failure');
            
            emailHtml += `
            <div class="agent-card">
                <div class="agent-header">
                    <span class="agent-name">Agent ${id}: ${escapeHtml(agent.name)}</span>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="agent-body">
                    <div class="model-info">Model: ${escapeHtml(agent.modelUsed || 'N/A')}</div>
                    
                    <div class="section-title">Problems Found</div>
                    <ul>
                        ${agent.problemsFound && agent.problemsFound.length > 0 
                            ? agent.problemsFound.map(p => `<li>${escapeHtml(p)}</li>`).join('') 
                            : '<li>None</li>'}
                    </ul>
                    
                    <div class="section-title">Solutions Proposed</div>
                    <ul>
                        ${agent.solutionsProposed && agent.solutionsProposed.length > 0 
                            ? agent.solutionsProposed.map(s => `<li>${escapeHtml(s)}</li>`).join('') 
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
            from: sender,
            to: recipient,
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
    console.error("❌ Errore fatale:", err);
    process.exit(1);
});
