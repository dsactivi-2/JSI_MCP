import assert from "node:assert/strict";
import test from "node:test";
import { createCrmServer } from "../src/register.js";

test("the phase 1 server can be constructed", () => {
  const server = createCrmServer({ query: async () => [] });
  assert.equal(typeof server.registerTool, "function");
});
