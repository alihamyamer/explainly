const fs = require("node:fs");
const path = require("node:path");

function loadDotEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnvLocal();

const required = [
  "ENV",
  "AI_MODEL",
  "ALLOWED_EXTENSION_IDS",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX",
  "USAGE_DAILY_LIMIT"
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("Environment validation passed.");
