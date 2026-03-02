# upfile-cli

Upload any file from your terminal. Get a permanent URL instantly.

→ [upfile.sh](https://upfile.sh)

## Install

```bash
yarn global add upfile-cli
```

## Setup

```bash
upfile config set api-key YOUR_API_KEY
```

Get your API key at [upfile.sh](https://upfile.sh).

## Usage

```bash
# Public — permanent URL, anyone can access
upfile screenshot.png
# https://cdn.upfile.sh/xK9mZ.png

# Expiring — self-destructs after TTL (seconds)
upfile report.pdf --expiry 3600

# Private — auth-gated, only you can access
upfile secret.pdf --private

# JSON output — for AI agents and scripts
upfile screenshot.png --json

# Pipe from stdin — capture and upload in one line
screencapture -x - | upfile
cat file.txt | upfile --json
```

## Options

| Flag | Description |
|------|-------------|
| `--private` | Private file, requires auth to access |
| `--expiry <sec>` | Expiring URL with TTL in seconds |
| `--json` | Full JSON response (url, id, visibility, expires_at) |

## JSON response

```json
{
  "id": "xK9mZaBcDe",
  "url": "https://cdn.upfile.sh/xK9mZaBcDe.png",
  "visibility": "public",
  "size": 84231,
  "type": "image/png",
  "expires_at": null,
  "created_at": "2026-03-02T03:00:00.000Z"
}
```

## Config

```bash
upfile config set api-key <key>      # save API key
upfile config set endpoint <url>     # self-hosted endpoint
upfile config get                    # view current config
```

Config stored at `~/.upfile/config.json`.

## Environment variables

| Var | Description |
|-----|-------------|
| `UPFILE_API_KEY` | API key (overrides config file) |
