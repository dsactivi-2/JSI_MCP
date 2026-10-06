import assert from "node:assert/strict";
import test from "node:test";
import { authorize } from "../src/auth.js";

test("a query-string token is never accepted", () => {
  const result = authorize({ authorization: "", urlToken: "secret", expected: "secret" });
  assert.equal(result.ok, false);
});

test("only the bearer header matches", () => {
  assert.equal(authorize({ authorization: "Bearer secret", urlToken: null, expected: "secret" }).ok, true);
  assert.equal(authorize({ authorization: "Bearer wrong", urlToken: null, expected: "secret" }).ok, false);
  assert.equal(authorize({ authorization: "Bearer secret", urlToken: null, expected: "" }).ok, false);
});
