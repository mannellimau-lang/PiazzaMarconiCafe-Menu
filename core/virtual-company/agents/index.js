// Base Agent Class for the 10-Agent Matrix
class VirtualAgent {
    constructor(id, name, group, role) {
        this.id = id;
        this.name = name;
        this.group = group;
        this.role = role;
    }

    // Connect to orchestrator IPC
    connectIPC() {
        console.log(`[Agent ${this.id}] ${this.name} connected to IPC.`);
    }

    // Placeholder for actual AI processing
    async executeTask(taskDetails) {
        throw new Error("executeTask must be implemented by subclass or strategy.");
    }
}

module.exports = { VirtualAgent };
