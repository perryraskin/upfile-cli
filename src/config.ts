import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".upfile");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string;
  endpoint?: string;
}

export function loadConfig(): Config {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
}

export function saveConfig(patch: Partial<Config>): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  const existing = loadConfig();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ ...existing, ...patch }, null, 2));
}

export const DEFAULT_ENDPOINT = "https://api.upfile.sh";
