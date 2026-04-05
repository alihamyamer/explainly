const fs = require("fs");
const path = require("path");

const sourceDir = path.join(process.cwd(), "extension");
const outDir = path.join(process.cwd(), "dist", "extension");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
copyRecursive(sourceDir, outDir);
console.log(`Extension copied to ${outDir}`);

function copyRecursive(source, target) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
