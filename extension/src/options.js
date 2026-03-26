const env = document.getElementById("environment");
const enabled = document.getElementById("explainerEnabled");
const saveBtn = document.getElementById("saveBtn");

initialize();
saveBtn.addEventListener("click", save);

async function initialize() {
  const saved = await chrome.storage.sync.get(["environment", "featureFlags"]);
  env.value = saved.environment || "dev";
  enabled.checked = saved.featureFlags?.enableExplainer !== false;
}

async function save() {
  await chrome.storage.sync.set({
    environment: env.value,
    featureFlags: {
      enableExplainer: enabled.checked
    }
  });
}
