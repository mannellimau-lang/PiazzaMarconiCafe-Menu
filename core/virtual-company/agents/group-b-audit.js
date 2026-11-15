const { VirtualAgent } = require('./index');

const auditAgents = [
    new VirtualAgent(5, "Hostile UI/UX Auditor", "Group B", "Uncovers micro-defects, layout shifts, form validation bugs."),
    new VirtualAgent(6, "Corporate Attorney", "Group B", "Audits statutory requirements (IVA, GDPR compliance)."),
    new VirtualAgent(7, "Local Market Pricing Scout", "Group B", "Crawls local market to compile comparative pricing matrices."),
    new VirtualAgent(8, "Professional Marketing Expert", "Group B", "Retail marketing strategist focused on CRO and premium positioning.")
];

module.exports = { auditAgents };
