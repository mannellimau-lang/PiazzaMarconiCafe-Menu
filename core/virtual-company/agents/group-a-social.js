const { VirtualAgent } = require('./index');

const socialAgents = [
    new VirtualAgent(1, "Social Media Scheduler", "Group A", "Organic growth, profile optimization, TikTok/Reels priming."),
    new VirtualAgent(2, "Localized Trend Scout", "Group A", "F&B trends analysis, creative briefs, geolocalized hashtags."),
    new VirtualAgent(3, "Creative Production Engine", "Group A", "Media asset standardization, template formatting."),
    new VirtualAgent(4, "Local SEO & Discovery", "Group A", "Google Business Profile config, local keyword mapping.")
];

module.exports = { socialAgents };
