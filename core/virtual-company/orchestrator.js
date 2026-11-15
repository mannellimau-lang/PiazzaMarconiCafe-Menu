const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = 3000;
const LEDGER_PATH = path.join(__dirname, 'logs', 'time_ledger.json');
const STAGING_DIR = path.join(__dirname, 'staging');

// Orchestrator Global State
let uptimeMinutes = 0;
const DAILY_LIMIT_MINUTES = 300; // 5 hours
const WEEKLY_LIMIT_PERCENT = 50; // Just a stub threshold flag
let emailSentToday = false;

function loadLedger() {
    try {
        const data = fs.readFileSync(LEDGER_PATH, 'utf8');
        const ledger = JSON.parse(data);
        
        // Reset logic for a new day
        const todayStr = new Date().toDateString();
        const lastDateStr = ledger.lastUpdated ? new Date(ledger.lastUpdated).toDateString() : '';
        
        if (todayStr !== lastDateStr) {
            console.log("New day detected. Resetting daily quotas and states for all agents.");
            Object.keys(ledger.agents).forEach(id => {
                ledger.agents[id].accumulatedMinutes = 0;
                ledger.agents[id].state = 'IDLE';
                ledger.agents[id].problemsFound = [];
                ledger.agents[id].solutionsProposed = [];
                // keep logs
            });
            ledger.lastUpdated = new Date().toISOString();
        }
        
        return ledger;
    } catch (err) {
        console.error("Error reading time ledger", err);
        return { agents: {} };
    }
}

// Save Ledger
function saveLedger(ledger) {
    ledger.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
}

let ledger = loadLedger();

// Express Setup
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

// API: Get State
app.get('/api/state', (req, res) => {
    const currentLedger = loadLedger();
    let totalMinutes = 0;
    if (currentLedger.agents) {
        Object.keys(currentLedger.agents).forEach(id => {
            totalMinutes += currentLedger.agents[id].accumulatedMinutes || 0;
        });
    }
    res.json({
        uptimeMinutes: totalMinutes,
        dailyLimit: DAILY_LIMIT_MINUTES,
        weeklyLimitReached: false,
        ledger: currentLedger
    });
});

// API: Save Social Metrics Manual Input
app.post('/api/social-metrics', (req, res) => {
    const { metricsText } = req.body;
    if (metricsText) {
        fs.writeFileSync(path.join(__dirname, 'logs', 'social_metrics.json'), JSON.stringify({ text: metricsText, date: new Date().toISOString() }, null, 2));
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, error: 'No text provided' });
    }
});

// API: Sync from GitHub Actions
app.post('/api/sync', (req, res) => {
    console.log("Starting git pull to sync morning reports...");
    exec('git pull origin main', (error, stdout, stderr) => {
        if (error) {
            console.error("Git pull error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
        console.log("Git pull success:", stdout);
        res.json({ success: true, log: stdout });
    });
});


app.listen(PORT, () => {
    console.log(`The Sims Orchestrator running on http://localhost:${PORT}`);
    console.log(`Monitoring 12 agents. Quota: 60m/day per agent. Global Cap: 5h/day.`);
});
