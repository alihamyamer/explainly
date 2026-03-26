const { withRequestTiming } = require("./_lib/observability");
const { applyCors, validateExtensionRequest, enforceRateLimits } = require("./_lib/security");

module.exports = withRequestTiming(async function usage(req, res) {
  const cors = applyCors(req, res);
  if (cors.done) return;
  const extensionId = validateExtensionRequest(req, res);
  if (!extensionId) return;
  const ip = req.headers["x-forwarded-for"] || "unknown";
  const key = `${extensionId}:${ip}`;
  if (!enforceRateLimits(req, res, key)) return;
  res.status(200).json({ ok: true, message: "Usage accepted" });
});
