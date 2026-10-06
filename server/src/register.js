import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { callTool } from "./handlers.js";

const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

function ok(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

export function createCrmServer(db) {
  const server = new McpServer({ name: "crm-mcp", version: "0.1.0" });
  const tools = [
    ["crm_search_kandidaten", "Kandidaten lesen. Geburtsdatum ist in jeder Zeile. Eine Seite hat 50 Zeilen.", z.object({
      name: z.string().optional(),
      eu_buerger: z.boolean().optional(),
      alter_von: z.number().int().optional(),
      alter_bis: z.number().int().optional(),
      position_text: z.string().optional(),
      archived: z.boolean().optional(),
      page_size: z.number().int().min(1).max(50).optional(),
      cursor: z.string().regex(/^[0-9]+$/).optional(),
      count_only: z.boolean().optional(),
    }).strict()],
    ["crm_search_companies", "Firmen lesen, 50 Zeilen pro Seite.", z.object({
      q: z.string().optional(),
      country: z.string().optional(),
      status: z.number().int().optional(),
      page_size: z.number().int().min(1).max(50).optional(),
    }).strict()],
    ["crm_search_nalozi", "Auftraege lesen, ohne SELECT *.", z.object({
      q: z.string().optional(),
      status: z.number().int().optional(),
      page_size: z.number().int().min(1).max(50).optional(),
    }).strict()],
    ["crm_beruf_report", "Berufsreport. Sprache nur wenn sie genannt wird.", z.object({
      begriffe: z.array(z.string()).min(1),
      archived: z.boolean().optional(),
      sprache: z.string().optional(),
      top_positionen: z.number().int().min(1).max(50).optional(),
    }).strict()],
    ["crm_kandidat_profile", "Minimiertes Profil eines Kandidaten.", z.object({
      kandidat_id: z.number().int().positive(),
    }).strict()],
    ["crm_stats", "Gesamtzahlen, ohne Seitengrenze.", z.object({}).strict()],
    ["crm_list_tables", "Erlaubte Tabellen auflisten.", z.object({
      search: z.string().optional(),
    }).strict()],
    ["crm_describe_table", "Spalten einer erlaubten Tabelle.", z.object({
      table: z.string(),
    }).strict()],
    ["crm_query", "Ein lesendes SELECT. Eine Liste hat 50 Zeilen, eine Zaehlung bleibt vollstaendig.", z.object({
      sql: z.string().min(1),
    }).strict()],
  ];
  for (const [name, description, inputSchema] of tools) {
    server.registerTool(name, { description, inputSchema, annotations: readOnly }, async (args) => ok(await callTool(db, name, args)));
  }
  return server;
}
