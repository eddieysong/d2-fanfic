import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1";
const command = isVercel ? "next" : "vinext";
const environment = { ...process.env };

if (!isVercel) {
  environment.WRANGLER_LOG_PATH ??= ".wrangler/wrangler.log";
}

console.log(`Building for ${isVercel ? "Vercel (Next.js)" : "Sites (Vinext)"}...`);

const result = spawnSync(command, ["build"], {
  env: environment,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
