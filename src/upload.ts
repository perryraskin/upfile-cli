import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import { loadConfig, DEFAULT_ENDPOINT } from "./config.js";
import type { UploadOptions, UploadResponse } from "./types.js";

function getAuth() {
  const config = loadConfig();
  const apiKey = config.apiKey || process.env.UPFILE_API_KEY;
  const endpoint = config.endpoint || DEFAULT_ENDPOINT;
  if (!apiKey) throw new Error("No API key. Run: upfile config set api-key YOUR_KEY");
  return { apiKey, endpoint };
}

export async function uploadFile(filePath: string, opts: UploadOptions): Promise<UploadResponse> {
  const { apiKey, endpoint } = getAuth();
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), path.basename(filePath));
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

export async function uploadStdin(opts: UploadOptions): Promise<UploadResponse> {
  const { apiKey, endpoint } = getAuth();
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

export async function listFiles(limit = 20): Promise<UploadResponse[]> {
  const { apiKey, endpoint } = getAuth();
  const res = await fetch(`${endpoint}/files?limit=${limit}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`List failed (${res.status}): ${await res.text()}`);
  const data = await res.json() as { files: UploadResponse[] };
  return data.files;
}

export async function deleteFile(id: string): Promise<void> {
  const { apiKey, endpoint } = getAuth();
  const res = await fetch(`${endpoint}/f/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Delete failed (${res.status}): ${await res.text()}`);
}
