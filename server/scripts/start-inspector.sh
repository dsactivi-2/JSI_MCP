#!/bin/sh
set -eu

if [ -z "${CRM_CANDIDATE_MCP_TOKEN:-}" ]; then
  echo "CRM_CANDIDATE_MCP_TOKEN is not set." >&2
  exit 1
fi

config_file="$(mktemp "${TMPDIR:-/tmp}/crm-mcp-inspector-config.XXXXXX")"

cleanup() {
  rm -f "$config_file"
}

trap cleanup EXIT INT TERM
chmod 600 "$config_file"

node -e '
  const config = {
    mcpServers: {
      "crm-pipedrive-worker": {
        type: "http",
        url: "https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp",
        protocolEra: "legacy",
        headers: {
          Authorization: `Bearer ${process.env.CRM_CANDIDATE_MCP_TOKEN}`,
        },
      },
    },
  };
  process.stdout.write(JSON.stringify(config));
' > "$config_file"

# Inspector loads the read-only session at startup. Remove the credential-bearing
# file immediately afterwards; the active session retains it only in memory.
(sleep 5; rm -f "$config_file") &

MCP_INSPECTOR_SECRET_STORE=memory mcp-inspector --web --config "$config_file"
