import path from "path";
import { uploadFile, uploadStdin } from "./upload.js";
import { saveConfig, loadConfig } from "./config.js";
import type { Visibility } from "./types.js";

const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.findIndex(a => a === `--${name}`);
  if (i === -1) return undefined;
  return args[i + 1];
}

function hasFlag(name: string): boolean {
  return args.includes(`--${name}`);
}

async function main() {
  // upfile config set <key> <value>
  if (args[0] === "config" && args[1] === "set") {
    const [, , , key, value] = args;
    if (key === "api-key") saveConfig({ apiKey: value });
    else if (key === "endpoint") saveConfig({ endpoint: value });
    else { console.error(`Unknown config key: ${key}`); process.exit(1); }
    console.log(`✓ ${key} saved`);
    return;
  }

  // upfile config get
  if (args[0] === "config" && args[1] === "get") {
    console.log(JSON.stringify(loadConfig(), null, 2));
    return;
  }

  const isJson = hasFlag("json");
  const isPrivate = hasFlag("private");
  const ttl = flag("expiry") ? parseInt(flag("expiry")!) : undefined;
  const visibility: Visibility = isPrivate ? "private" : ttl ? "expiring" : "public";
  const opts = { visibility, ttl, json: isJson };

  let result;

  // stdin pipe: cat file | upfile
  if (!process.stdin.isTTY && args.length === 0) {
    result = await uploadStdin(opts);
  } else {
    const filePath = args.find(a => !a.startsWith("--"));
    if (!filePath) {
      console.error("Usage: upfile <file> [--private] [--expiry <seconds>] [--json]");
      console.error("       cat file | upfile [--json]");
      console.error("       upfile config set api-key <key>");
      process.exit(1);
    }
    result = await uploadFile(path.resolve(filePath), opts);
  }

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.url);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
