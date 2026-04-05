const channel = process.argv[2];
const valid = new Set(["alpha", "beta", "prod"]);
if (!valid.has(channel)) {
  console.error("Usage: node scripts/release.js <alpha|beta|prod>");
  process.exit(1);
}

const gates = {
  alpha: ["internal test pass", "security baseline pass"],
  beta: ["alpha stability met", "privacy docs complete", "cost alerts enabled"],
  prod: ["beta exit criteria met", "rollback rehearsal complete", "launch review approved"]
};

console.log(`Preparing ${channel} release.`);
for (const item of gates[channel]) {
  console.log(`- [ ] ${item}`);
}
console.log("Release checklist emitted.");
