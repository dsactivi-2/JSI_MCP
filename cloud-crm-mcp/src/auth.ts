import { timingSafeEqual } from "node:crypto";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { createJwtVerifier, oauthCustomProvider, type OAuthMetadata, type OAuthProvider } from "mcp-use/oauth";

export const BASELINE_SCOPE = "crm:read";
export const SQL_SCOPE = "sql:read";
export const ADVERTISED_SCOPES = [BASELINE_SCOPE, "candidates:read", "reports:read", SQL_SCOPE] as const;

export type CloudCrmUser = { id: string };

export function createOAuthProvider(env: NodeJS.ProcessEnv): OAuthProvider<CloudCrmUser> | undefined {
  const issuer = clean(env.OAUTH_ISSUER);
  if (!issuer) return undefined;

  const authorizationEndpoint = required(env, "OAUTH_AUTHORIZATION_ENDPOINT");
  const tokenEndpoint = required(env, "OAUTH_TOKEN_ENDPOINT");
  const jwksUrl = required(env, "OAUTH_JWKS_URL");
  const resource = resourceUrl(env);
  const audience = clean(env.OAUTH_AUDIENCE);
  const registrationEndpoint = clean(env.OAUTH_REGISTRATION_ENDPOINT);
  assertHttps("OAUTH_ISSUER", issuer);
  assertHttps("OAUTH_AUTHORIZATION_ENDPOINT", authorizationEndpoint);
  assertHttps("OAUTH_TOKEN_ENDPOINT", tokenEndpoint);
  assertHttps("OAUTH_JWKS_URL", jwksUrl);

  const metadata: OAuthMetadata = {
    issuer,
    authorization_endpoint: authorizationEndpoint,
    token_endpoint: tokenEndpoint,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: [...ADVERTISED_SCOPES],
    ...(registrationEndpoint ? { registration_endpoint: registrationEndpoint } : {}),
  };

  return oauthCustomProvider<CloudCrmUser>({
    resource,
    resourceName: "Cloud CRM MCP",
    requiredScopes: [BASELINE_SCOPE],
    scopesSupported: ADVERTISED_SCOPES,
    oauthMetadata: metadata,
    createTokenVerifier: (boundResource) => {
      const jwt = createJwtVerifier({
        issuer,
        jwksUrl: new URL(jwksUrl),
        resource: boundResource,
        ...(audience ? { audience } : {}),
      });
      return {
        async verifyAccessToken(token: string): Promise<AuthInfo> {
          if (sameSecret(token, env.CRM_MCP_SERVER_TOKEN ?? "")) {
            return {
              token,
              clientId: "shared-token",
              scopes: [...ADVERTISED_SCOPES],
              expiresAt: Math.floor(Date.now() / 1000) + 300,
              resource: boundResource,
            };
          }
          const verified = await jwt.verifyAccessToken(token);
          return { ...verified, scopes: collectScopes(verified) };
        },
      };
    },
    mapAuthInfo: (authInfo) => {
      const payload = record(authInfo.extra?.payload);
      const id = authInfo.clientId || stringClaim(payload, "sub") || "unknown";
      return { user: { id }, payload, permissions: [...authInfo.scopes] };
    },
  });
}

function resourceUrl(env: NodeJS.ProcessEnv): URL {
  const raw = clean(env.OAUTH_RESOURCE) || clean(env.MCP_URL);
  if (!raw) throw new Error("OAUTH_RESOURCE oder MCP_URL fehlt.");
  const url = new URL(raw);
  if (url.pathname === "/" || url.pathname === "") url.pathname = "/mcp";
  if (url.pathname !== "/mcp") throw new Error("Der OAuth-Ressourcenpfad muss /mcp sein.");
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("Die OAuth-Ressource muss HTTPS sein.");
  }
  url.search = "";
  url.hash = "";
  return url;
}

function collectScopes(info: AuthInfo): string[] {
  const payload = record(info.extra?.payload);
  return [...new Set([...info.scopes, ...stringList(payload.permissions), ...stringList(payload.scp)])];
}

function sameSecret(presented: string, expected: string): boolean {
  if (!expected) return false;
  const left = Buffer.from(presented);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = clean(env[name]);
  if (!value) throw new Error(`${name} fehlt. OAuth ist nur halb gesetzt.`);
  return value;
}

function assertHttps(name: string, value: string): void {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${name} muss HTTPS sein.`);
}

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringClaim(payload: Record<string, unknown>, name: string): string {
  const value = payload[name];
  return typeof value === "string" ? value : "";
}

function stringList(value: unknown): string[] {
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}
