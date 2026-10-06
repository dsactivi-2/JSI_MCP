import http from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { authorize } from "./auth.js";
import { createCrmServer } from "./register.js";

export function startLocal({ token, query, port = 0 }) {
  const mcp = createMcpHandler(() => createCrmServer({ query }));
  const server = http.createServer(createLocalHandler({ token, mcp }));
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

export function createLocalHandler({ token, mcp }) {
  return async function handle(req, res) {
    const url = new URL(req.url, "http://127.0.0.1");
    const decision = authorize({
      authorization: req.headers.authorization ?? "",
      urlToken: url.searchParams.get("token"),
      expected: token,
    });
    if (!decision.ok) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }
    if (url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, service: "crm-mcp-local" }));
      return;
    }
    if (!mcp) throw new Error("MCP handler fehlt.");
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const request = new Request("http://127.0.0.1" + req.url, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
    });
    const response = await mcp.fetch(request);
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    res.writeHead(response.status, headers);
    res.end(Buffer.from(await response.arrayBuffer()));
  };
}
