# MCP Server built with mcp-use

This is an MCP server project bootstrapped with [`create-mcp-use-app`](https://mcp-use.com/docs/typescript/getting-started/quickstart).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/mcp/inspector](http://localhost:3000/mcp/inspector) with your browser to test your server.

You can start building by editing the entry file. Add tools, resources, and prompts — the server auto-reloads as you edit.

Run `npm run typecheck` to refresh MCP view types and check the project with its local TypeScript compiler.

## Learn More

To learn more about mcp-use and MCP:

- [mcp-use Documentation](https://mcp-use.com/docs/typescript/getting-started/quickstart) — guides, API reference, and tutorials

## Login

Without OAuth settings, the server still expects `Authorization: Bearer` and `CRM_MCP_SERVER_TOKEN`. A token in the URL is rejected.

When `OAUTH_ISSUER` is set, the server also requires `OAUTH_AUTHORIZATION_ENDPOINT`, `OAUTH_TOKEN_ENDPOINT`, `OAUTH_JWKS_URL`, and `OAUTH_RESOURCE` or `MCP_URL`. It then publishes the OAuth discovery documents and checks signed tokens. `crm:read` is required for every tool. `crm_query` also requires `sql:read`. The shared token stays valid as a fallback. `OAUTH_CLIENT_SECRET` is not a server setting.

## Deploy on Manufact Cloud

Manufact is only the temporary host. Deployment #3 contains this code. OAuth discovery stays off until the issuer values above are set. Cloudflare remains a later option.

```bash
npm run deploy
```
