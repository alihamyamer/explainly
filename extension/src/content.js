let hoverTimer = null;

document.addEventListener("mouseover", (event) => {
  const text = extractText(event.target);
  if (!text) return;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "EXPLAIN_TEXT",
        payload: { text, style: "simple" }
      });
      if (!response?.ok) return;
      showTooltip(event.clientX, event.clientY, response.result.explanation);
    } catch {
      // Keep content script silent on network errors.
    }
  }, 600);
});

function extractText(target) {
  const raw = target?.textContent || "";
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed.length < 8) return "";
  return trimmed.slice(0, 600);
}

function showTooltip(x, y, text) {
  const existing = document.getElementById("__explainly_tooltip");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.id = "__explainly_tooltip";
  node.textContent = text;
  node.style.position = "fixed";
  node.style.top = `${y + 14}px`;
  node.style.left = `${x + 14}px`;
  node.style.maxWidth = "340px";
  node.style.padding = "10px 12px";
  node.style.borderRadius = "8px";
  node.style.zIndex = "2147483647";
  node.style.background = "#111827";
  node.style.color = "#f9fafb";
  node.style.fontSize = "12px";
  node.style.lineHeight = "1.4";
  node.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 5000);
}
