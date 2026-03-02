# upfile-cli

Instant file uploads from your terminal. Get a permanent URL in under a second.

## Install

```bash
npm install -g upfile-cli
```

## Setup

```bash
upfile config set api-key YOUR_API_KEY
```

Get your API key at [upfile.sh](https://upfile.sh).

## Usage

```bash
# Upload a file → permanent public URL
upfile screenshot.png
# https://cdn.upfile.sh/xK9mZ.png

# Expiring URL (TTL in seconds)
upfile screenshot.png --expiry 3600

# Private (auth-gated)
upfile secret.pdf --private

# JSON output (for AI agents / scripts)
upfile screenshot.png --json
# { "url": "...", "id": "...", "visibility": "public", "expires_at": null, ... }

# Pipe from stdin
cat screenshot.png | upfile
screencapture -x - | upfile   # macOS: capture + upload in one line
```

## Options

| Flag | Description |
|------|-------------|
| `--private` | Private file, auth required to access |
| `--expiry <seconds>` | Expiring URL with TTL |
| `--json` | Output full JSON response |

## Config

```bash
upfile config set api-key <key>
upfile config set endpoint <url>   # for self-hosted
```

Config stored at `~/.upfile/config.json`.
