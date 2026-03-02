import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import { loadConfig, DEFAULT_ENDPOINT } from "./config.js";
import type { UploadOptions, UploadResponse } from "./types.js";

export async function uploadFile(filePath: string, opts: UploadOptions): Promise<UploadResponse> {
  const config = loadConfig();
  const apiKey = config.apiKey || process.env.UPFILE_API_KEY;
  const endpoint = config.endpoint || DEFAULT_ENDPOINT;

  if (!apiKey) {
    throw new Error("No API key. Run: upfile config set api-key YOUR_KEY");
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), path.basename(filePath));
  form.append("visibility", opts.visibility);
  if (opts.ttl) form.append("ttl", String(opts.ttl));

  const res = await fetch(`${endpoint}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, ...form.getHeaders() },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed (${res.status}): ${err}`);
  }

  return res.json() as Promise<UploadResponse>;
}

export async function uploadStdin(opts: UploadOptions): Promise<UploadResponse> {
  const config = loadConfig();
  const apiKey = config.apiKey || process.env.UPFILE_API_KEY;
  const endpoint = config.endpoint || DEFAULT_ENDPOINT;

  if (!apiKey) throw new Error("No API key. Run: upfile config set api-key YOUR_KEY");

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  const buffer = Buffer.concat(chunks);

  const form = new FormData();
  form.append("file", buffer, { filename: "upload.bin", contentType: "application/octet-stream" });
  form.append("visibility", opts.visibility);
  if (opts.ttl) form.append("ttl", String(opts.ttl));

  const res = await fetch(`${endpoint}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, ...form.getHeaders() },
    body: form,
  });

  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  return res.json() as Promise<UploadResponse>;
}
