const { getConfig } = require("./config");
const { takeToken, takeDailyUsage } = require("./rateLimitStore");

function applyCors(req, res) {
  const cfg = getConfig();
  const origin = req.headers.origin || "";
  const allowed = cfg.allowedExtensionIds.includes(origin);
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-extension-id");
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return { done: true };
  }
  if (!allowed) {
    res.status(403).json({ error: "Origin not allowed" });
    return { done: true };
  }
  return { done: false };
}

function validateExtensionRequest(req, res) {
  const extensionId = req.headers["x-extension-id"];
  if (!extensionId || typeof extensionId !== "string") {
    res.status(400).json({ error: "Missing extension id" });
    return null;
  }
  return extensionId;
}

function enforceRateLimits(req, res, key) {
  const cfg = getConfig();
  const burst = takeToken(key, cfg.rateLimitWindowMs, cfg.rateLimitMax);
  if (!burst.allowed) {
    res.setHeader("Retry-After", Math.ceil((burst.resetAt - Date.now()) / 1000));
    res.status(429).json({ error: "Rate limit exceeded" });
    return false;
  }
  const daily = takeDailyUsage(key, cfg.usageDailyLimit);
  if (!daily.allowed) {
    res.status(429).json({ error: "Daily usage limit exceeded" });
    return false;
  }
  return true;
}

function parseJsonBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (!req.body) return {};
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

function sanitizeInput(text) {
  const raw = String(text || "").trim();
  return raw
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CARD]")
    .slice(0, 2000);
}

module.exports = {
  applyCors,
  validateExtensionRequest,
  enforceRateLimits,
  parseJsonBody,
  sanitizeInput
};
