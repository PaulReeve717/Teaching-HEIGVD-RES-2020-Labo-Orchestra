class Logger {
    constructor() {
        this.isEnable = true;
    }

    enable() {
        this.isEnable = true;
    }

    disable() {
        this.isEnable = false;
    }

    INFO(...args) {
        if (!this.isEnable) return;
        console.log("\x1b[32m", `[${new Date().toLocaleString()}]`, "\x1b[0m", ...args);
    }

    WARN(...args) {
        if (!this.isEnable) return;
        console.log("\x1b[33m", `[${new Date().toLocaleString()}]`, "\x1b[0m", ...args);
    }

    ERROR(...args) {
        if (!this.isEnable) return;
        console.log("\x1b[31m", `[${new Date().toLocaleString()}]`, "\x1b[0m", ...args);
    }
}

exports.LOG = new Logger();