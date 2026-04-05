const { getConfig } = require("./config");

function log(level, message, metadata = {}) {
  const cfg = getConfig();
  const payload = {
    ts: new Date().toISOString(),
    level,
    env: cfg.env,
    message,
    ...metadata
  };
  console.log(JSON.stringify(payload));
}

function captureError(error, context = {}) {
  log("error", error?.message || "Unhandled error", {
    stack: error?.stack,
    ...context
  });
}

function withRequestTiming(handler) {
  return async function wrapped(req, res) {
    const start = Date.now();
    const requestId = req.headers["x-request-id"] || cryptoRandomId();
    res.setHeader("x-request-id", requestId);
    try {
      await handler(req, res, requestId);
      log("info", "request.complete", {
        requestId,
        path: req.url,
        method: req.method,
        statusCode: res.statusCode,
        durationMs: Date.now() - start
      });
    } catch (error) {
      captureError(error, { requestId, path: req.url, method: req.method });
      res.status(500).json({ error: "Internal server error", requestId });
    }
  };
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

module.exports = { log, captureError, withRequestTiming };
