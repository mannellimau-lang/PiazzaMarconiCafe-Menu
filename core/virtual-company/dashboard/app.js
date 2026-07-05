function updateClock() {
    document.getElementById('clock-display').innerText = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

async function fetchState() {
    try {
        const res = await fetch('/api/state');
        const data = await res.json();
        renderDashboard(data);
    } catch (err) {
        console.error("Error fetching state:", err);
    }
}

function renderDashboard(data) {
    // Update Telemetry
    document.getElementById('uptime-display').innerText = `${data.uptimeMinutes} / ${data.dailyLimit}m`;
    if (data.ledger && data.ledger.lastUpdated) {
        const d = new Date(data.ledger.lastUpdated);
        document.getElementById('last-updated-display').innerText = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
        document.getElementById('last-updated-display').innerText = '--';
    }

    const grid = document.getElementById('agent-grid');
    grid.innerHTML = '';

    const agents = data.ledger.agents;
    
    Object.keys(agents).forEach(id => {
        const agent = agents[id];
        const progressPercent = Math.min(100, (agent.accumulatedMinutes / agent.dailyQuota) * 100);
        
        const card = document.createElement('div');
        card.className = 'agent-card';
        
        card.innerHTML = `
            <div class="agent-header">
                <div class="agent-info">
                    <h4>Agent ${id.padStart(2, '0')}</h4>
                    <h3>${agent.name}</h3>
                </div>
                <div class="agent-state state-${agent.state}">${agent.state}</div>
            </div>
            
            <div class="progress-container">
                <div class="progress-labels">
                    <span>Daily Quota</span>
                    <span>${agent.accumulatedMinutes} / ${agent.dailyQuota}m</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            
            <div class="agent-logs">
                ${agent.logs.map(log => `<div class="log-entry">${log}</div>`).join('')}
            </div>
        `;
        
        // Add click listener
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openModal(agent));

        grid.appendChild(card);
    });
}

// Modal Logic
const modal = document.getElementById('agent-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalAgentName = document.getElementById('modal-agent-name');
const modalProblemsList = document.getElementById('modal-problems-list');
const modalSolutionsList = document.getElementById('modal-solutions-list');

function openModal(agent) {
    modalAgentName.innerText = agent.name;
    
    modalProblemsList.innerHTML = '';
    if (agent.problemsFound && agent.problemsFound.length > 0) {
        agent.problemsFound.forEach(p => {
            const li = document.createElement('li');
            li.innerText = p;
            modalProblemsList.appendChild(li);
        });
    } else {
        modalProblemsList.innerHTML = '<li>Nessun problema evidenziato ancora.</li>';
    }

    modalSolutionsList.innerHTML = '';
    if (agent.solutionsProposed && agent.solutionsProposed.length > 0) {
        agent.solutionsProposed.forEach(s => {
            const li = document.createElement('li');
            li.innerText = s;
            modalSolutionsList.appendChild(li);
        });
    } else {
        modalSolutionsList.innerHTML = '<li>Nessuna soluzione proposta ancora.</li>';
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Fetch every 2 seconds
setInterval(fetchState, 2000);
fetchState();

// Sync Button
document.getElementById('sync-btn').addEventListener('click', async () => {
    const status = document.getElementById('status-display');
    const syncBtn = document.getElementById('sync-btn');
    status.innerText = "SYNCING...";
    status.className = "status-online";
    status.style.color = "#f59e0b"; // amber during sync
    syncBtn.innerText = "⏳ SINCRONIZZAZIONE...";
    syncBtn.disabled = true;
    
    try {
        const res = await fetch('/api/sync', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            status.innerText = "READY";
            status.style.color = "";
            alert('Sincronizzazione completata! I report locali sono aggiornati.');
            await fetchState();
        } else {
            status.innerText = "ERROR";
            status.style.color = "#ef4444";
            alert('Errore durante la sincronizzazione: ' + data.error);
        }
    } catch (e) {
        status.innerText = "ERROR";
        status.style.color = "#ef4444";
        alert('Errore di connessione durante la sincronizzazione.');
    } finally {
        syncBtn.innerText = "📊 SINCRONIZZA DA GITHUB";
        syncBtn.disabled = false;
    }
});

// Save Metrics Button
const saveMetricsBtn = document.getElementById('save-metrics-btn');
if (saveMetricsBtn) {
    saveMetricsBtn.addEventListener('click', async () => {
        const text = document.getElementById('social-metrics-input').value;
        if (!text.trim()) {
            alert('Inserisci dei dati prima di salvare.');
            return;
        }
        
        try {
            const res = await fetch('/api/social-metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ metricsText: text })
            });
            if (res.ok) {
                alert('Dati salvati! L\'Agente 12 li analizzerà a breve.');
                document.getElementById('social-metrics-input').value = '';
            } else {
                alert('Errore durante il salvataggio.');
            }
        } catch(e) {
            console.error('Error posting metrics:', e);
            alert('Errore di connessione.');
        }
    });
}
