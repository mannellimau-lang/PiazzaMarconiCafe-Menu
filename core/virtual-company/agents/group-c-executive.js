const { VirtualAgent } = require('./index');

const executiveAgents = [
    new VirtualAgent(9, "Chief Executive Supervisor", "Group C", "Monitors agents, verifies quota, parses logs, structures morning report."),
    new VirtualAgent(10, "Continuous Improvement Motivator", "Group C", "Intercepts agent output, injects high-standard motivational refinement prompts.")
];

module.exports = { executiveAgents };
