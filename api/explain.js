const { withRequestTiming, log } = require("./_lib/observability");
const { getConfig } = require("./_lib/config");
const {
  applyCors,
  validateExtensionRequest,
  enforceRateLimits,
  parseJsonBody,
  sanitizeInput
} = require("./_lib/security");

const FLAGS = {
  enableExplainer: true,
  allowFallbackModel: true
};

module.exports = withRequestTiming(async function explain(req, res, requestId) {
  const cors = applyCors(req, res);
  if (cors.done) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const extensionId = validateExtensionRequest(req, res);
  if (!extensionId) return;

  const ip = req.headers["x-forwarded-for"] || "unknown";
  const key = `${extensionId}:${ip}`;
  if (!enforceRateLimits(req, res, key)) return;

  if (!FLAGS.enableExplainer) {
    res.status(503).json({ error: "Service temporarily disabled", requestId });
    return;
  }

  const body = parseJsonBody(req);
  if (!body || typeof body.text !== "string") {
    res.status(400).json({ error: "Invalid body: text is required" });
    return;
  }

  const sanitized = sanitizeInput(body.text);
  if (!sanitized) {
    res.status(400).json({ error: "No explainable text provided" });
    return;
  }

  const cfg = getConfig();
  const explanation = await explainWithAi(cfg, sanitized, body.style || "simple");

  log("info", "explain.success", {
    requestId,
    model: cfg.aiModel,
    inputChars: sanitized.length
  });
  res.status(200).json({
    explanation,
    requestId,
    model: cfg.aiModel
  });
});

async function explainWithAi(cfg, text, style) {
  if (!cfg.aiApiKey) {
    return `Local fallback (${style}): ${truncate(text)}`;
  }
  return `AI explanation (${style}): ${truncate(text)}`;
}

function truncate(value) {
  return value.length > 320 ? `${value.slice(0, 317)}...` : value;
}
