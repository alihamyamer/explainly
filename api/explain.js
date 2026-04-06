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

  const persona = typeof body.persona === "string" ? body.persona.trim() : "General";
  const cfg = getConfig();
  const explanation = await explainWithAi(cfg, sanitized, body.style || "simple", persona);

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

async function explainWithAi(cfg, text, style, persona) {
  if (!cfg.aiApiKey) {
    return `Local fallback (${style}): ${text.slice(0, 320)}`;
  }

  const systemPrompt =
    persona === "General"
      ? "You are a knowledgeable assistant. Explain the fundamental concepts of the following text in clear, plain language."
      : `You are a ${persona}. Explain the fundamental concepts of the following text in a clear and concise way.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.aiApiKey}`
    },
    body: JSON.stringify({
      model: cfg.aiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      max_tokens: 300,
      temperature: 0.5
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "No explanation available.";
}
