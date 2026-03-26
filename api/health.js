const { withRequestTiming } = require("./_lib/observability");
const { getConfig } = require("./_lib/config");

module.exports = withRequestTiming(async function health(_req, res) {
  const cfg = getConfig();
  res.status(200).json({
    ok: true,
    env: cfg.env,
    timestamp: new Date().toISOString()
  });
});
