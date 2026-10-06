import assert from "node:assert/strict";
import test from "node:test";
import { createLocalHandler } from "../src/local-http.js";

function response() {
  return {
    status: 0,
    body: "",
    writeHead(status) {
      this.status = status;
    },
    end(body) {
      this.body = String(body);
    },
  };
}

test("local handler rejects a query token and answers health with the bearer", async () => {
  const handle = createLocalHandler({ token: "secret" });
  const denied = response();
  await handle({ url: "/health?token=secret", headers: {} }, denied);
  assert.equal(denied.status, 401);
  const health = response();
  await handle({ url: "/health", headers: { authorization: "Bearer secret" } }, health);
  assert.equal(health.status, 200);
  assert.equal(JSON.parse(health.body).service, "crm-mcp-local");
});
