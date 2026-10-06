import { timingSafeEqual } from "node:crypto";

export function authorize({ authorization = "", urlToken = null, expected = "" }) {
  if (!expected || urlToken) return { ok: false, reason: "unauthorized" };
  if (!authorization.startsWith("Bearer ")) return { ok: false, reason: "unauthorized" };
  const given = Buffer.from(authorization.slice("Bearer ".length));
  const want = Buffer.from(expected);
  if (given.length === 0 || given.length !== want.length) return { ok: false, reason: "unauthorized" };
  return { ok: timingSafeEqual(given, want), reason: "unauthorized" };
}
