const ENV_CONFIG = {
  dev: { apiBaseUrl: "https://explainly-ten.vercel.app" },
  staging: { apiBaseUrl: "https://explainly-staging.vercel.app" },
  prod: { apiBaseUrl: "https://explainly.vercel.app" }
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "EXPLAIN_TEXT") return false;
  handleExplain(message.payload)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});

async function handleExplain(payload) {
  const cfg = await chrome.storage.sync.get(["persona", "environment", "featureFlags"]);
  const env = cfg.environment || "dev";
  const persona = cfg.persona || "General";
  const flags = cfg.featureFlags || { enableExplainer: true };
  if (!flags.enableExplainer) throw new Error("Explainer is disabled");
  const apiBaseUrl = ENV_CONFIG[env]?.apiBaseUrl || ENV_CONFIG.dev.apiBaseUrl;
  const response = await fetch(`${apiBaseUrl}/api/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-extension-id": chrome.runtime.id
    },
    body: JSON.stringify({ ...payload, persona })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }
  return response.json();
}
