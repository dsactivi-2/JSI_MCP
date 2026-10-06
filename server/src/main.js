import { startLocal } from "./local-http.js";

const token = process.env.CRM_MCP_SERVER_TOKEN ?? "";
if (!token) {
  console.error("CRM_MCP_SERVER_TOKEN is not set. The local server does not read a token from the URL.");
  process.exit(1);
}

const port = Number(process.env.PORT ?? 8787);
const server = await startLocal({
  token,
  port,
  query: async () => {
    throw new Error("MySQL ist noch nicht angeschlossen. Der lokale Server prueft nur die Phase-1-Regeln.");
  },
});
const address = server.address();
console.log("crm-mcp local listening on " + address.port);
