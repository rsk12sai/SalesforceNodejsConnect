// utils/logger.js
const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg, meta) => console.error(`[ERROR] ${msg}`, meta || ''),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};

module.exports = logger;