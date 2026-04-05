const DEFAULTS = {
  ENV: "dev",
  AI_MODEL: "gpt-4.1-mini",
  RATE_LIMIT_WINDOW_MS: 60_000,
  RATE_LIMIT_MAX: 30,
  USAGE_DAILY_LIMIT: 200
};

function parseList(value) {
  return (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function getConfig() {
  return {
    env: process.env.ENV || DEFAULTS.ENV,
    aiApiKey: process.env.AI_API_KEY || "",
    aiModel: process.env.AI_MODEL || DEFAULTS.AI_MODEL,
    allowedExtensionIds: parseList(process.env.ALLOWED_EXTENSION_IDS),
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || DEFAULTS.RATE_LIMIT_WINDOW_MS),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX || DEFAULTS.RATE_LIMIT_MAX),
    usageDailyLimit: Number(process.env.USAGE_DAILY_LIMIT || DEFAULTS.USAGE_DAILY_LIMIT),
    sentryDsn: process.env.SENTRY_DSN || "",
    logLevel: process.env.LOG_LEVEL || "info"
  };
}

module.exports = { getConfig };
