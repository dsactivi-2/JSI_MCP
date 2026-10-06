# Cloudflare-Gesamtbewertung: CRM-MCP-Worker
> **Nachfolge, 6. Oktober 2026:** Die aktive Planung behält für den neuen Server das Geburtsdatum in der Kandidatensuchliste und den Filter `eu_buerger`. Diese beiden Entfernungsempfehlungen sind ersetzt. `SELECT *`, das Token in der URL und die übrigen Datenschutzverbote bleiben. Die Entscheidung steht in [changes.md](changes.md).

> **Name note, 5 October 2026:** The user rejected the working title Lena. These pages keep the dated findings. Current names and the transition decision are in [project.md](project.md) and [memory.md](memory.md). The Linear title has not been renamed because no replacement name was given.

> **Statushinweis vom 5. Oktober 2026:** Dieser Bericht bleibt ein datierter
> Read-only-Audit. Die Umsetzung seiner Befunde wird ausschließlich im
> Linear-Tracker unter ACT-140 bis ACT-154 geplant. Der Titel Lena gilt nicht mehr als Projektname. Der
> Bericht selbst erteilt keine Änderungs- oder Deploymentfreigabe.

Stand: 4. Oktober 2026  
Bewertungsmodus: ausschließlich read-only; kein Build, keine Migration, kein Deployment  
Bewerteter Worker: `crm-pipedrive-worker`  
Aktive Version: 33 / `0.1.0-beta.6`  
Aktive Version-ID: `bf50f9bb-bc11-4900-9b7c-cb8269dc343f`

## Ergebnis in einem Satz

Der Worker besitzt eine brauchbare funktionale Basis und passende Cloudflare-Bausteine, ist aber aktuell eher ein intern erreichbarer Datenbankadapter als ein produktionsreifer, mandantenfähiger MCP-Dienst: Authentifizierung, Autorisierung, Datenminimierung, SQL-Grenzen, Output-Verträge, Observability und Release-Provenienz sind für reale Kandidatendaten nicht ausreichend abgesichert.

## Bewertungsumfang und Evidenz

Direkt geprüft wurden:

- aktiver Cloudflare-Account und Worker-Inventar;
- aktive Version, Bindings, Deployment-Historie und Build-Konfiguration;
- ausgeliefertes Produktionsbundle und Wrangler-Konfiguration;
- Durable-Object-, Hyperdrive- und Secret-Bindings;
- öffentliche Health-, Unauthorized-, Origin- und Pfadfälle;
- alle elf MCP-Toolimplementierungen;
- Authentifizierungs-, Query-, Output- und Fehlerpfade;
- aktuelle Cloudflare-Dokumentation für Workers, Agents SDK/MCP, Durable Objects, Hyperdrive und Observability;
- lokale Plugin-/Skill-Verträge und Evaluationen.

Nicht geprüft wurden reale CRM-Datensätze, Secretwerte, Aiven-Konfiguration außerhalb der sichtbaren Hyperdrive-Metadaten, Datenbank-Grants, tatsächliche Log-Inhalte und nicht zugängliche Originalquellen im verbundenen Repository. Es wurde bewusst kein Tool mit Kandidatendaten aufgerufen.

## Aktuelle Architektur

```text
Codex / ChatGPT / MCP-Client
          |
          | HTTPS + gemeinsamer Bearer
          v
workers.dev / crm-pipedrive-worker
          |
          +-- /health
          +-- /mcp  (Streamable HTTP)
          +-- /sse  (Legacy SSE)
          |
          v
McpAgent / Durable Object: CrmMCP
          |
          | pro Query neue MySQL-Verbindung
          v
Cloudflare Hyperdrive (Caching aktiv, Origin-Limit 60)
          |
          v
Aiven MySQL / defaultdb / administrativ benannter DB-User
```

Cloudflare Smart Placement ist aktiviert. Der Live-Header zeigte bei der Prüfung `cf-placement: local-ZAG`, also eine Platzierung am Standort Sarajevo; ob dies für den tatsächlichen Aiven-Origin optimal ist, wurde nicht gemessen.

## Was vorhanden ist

### Plattform und Betrieb

- Cloudflare Worker auf `workers.dev`;
- Standard-Usage-Model;
- Compatibility Date `2026-09-01`;
- `nodejs_compat`;
- Smart Placement;
- Durable-Object-Klasse `CrmMCP`, aktive Migration `v1`;
- Hyperdrive-Binding mit TLS-Pflicht (`sslmode=REQUIRED`);
- Secret-Binding `WORKER_API_KEY`; der Wert ist nicht im Bundle oder in der Konfiguration enthalten;
- Versionen und Deployments mit Rollback-Grundlage;
- Git-/Workers-Builds-Verknüpfung zu einem Repository `mcp-pool` auf `main`;
- Preview-Konfiguration;
- Workers Logs/Traces sind in Teilfeldern aktiviert und persistiert;
- öffentliche Liveness-Route `/health`;
- öffentliche OpenAI-Domain-Verifikationsroute.

### MCP und fachliche Funktionen

- Streamable HTTP unter `/mcp`;
- Legacy SSE unter `/sse`;
- MCP-Servername `crm-mysql`, deklarierte Version `1.1.0`;
- Guide-Version `1.3.0`;
- elf Tools:
  1. `crm_search_guide`
  2. `crm_stats`
  3. `crm_beruf_report`
  4. `crm_search_kandidaten`
  5. `crm_kandidat_profile`
  6. `crm_resolve_beruf`
  7. `crm_search_companies`
  8. `crm_search_nalozi`
  9. `crm_query`
  10. `crm_list_tables`
  11. `crm_describe_table`

### Gute Implementierungsdetails

- fokussierte Tools verwenden überwiegend SQL-Platzhalter;
- `COUNT(DISTINCT)` für Kandidatenzählungen;
- Archivstatus 3 wird in Kernsuchpfaden standardmäßig ausgeschlossen;
- Sprache und Hörniveau werden in derselben Sprachzeile geprüft;
- Kandidatensuche hat exakten Count, `count_only`, Cursor, `has_more` und stabile ID-Sortierung;
- Datenbankclient wird innerhalb der Toolausführung erstellt und wieder geschlossen, passend zum Hyperdrive-Verbindungsmodell;
- keine hartcodierten Secrets gefunden;
- kein global geteilter MySQL-Client gefunden;
- Bundle ist syntaktisch gültig;
- Compatibility Flag und Bindings stimmen mit der ausgelieferten Nutzung überein.

## Was fehlt oder nur scheinbar vorhanden ist

### Authentifizierung und Autorisierung

Nicht vorhanden sind:

- OAuth 2.1/MCP Authorization;
- individuelle Benutzeridentität;
- Tenant-/Mandantenbindung;
- Rollen und Tool-Scopes;
- Audience-/Resource-Prüfung;
- Ablauf, Widerruf und Sessionentzug;
- per-Tool Autorisierungsentscheidung;
- serverseitige Zweckbindung für sensible Daten;
- Rate Limits pro Benutzer, Tenant oder Tool.

Vorhanden ist nur ein gemeinsamer statischer Bearer. Zusätzlich wird derselbe Wert über `?token=` akzeptiert. Der Vergleich erfolgt direkt mit `!==` statt mit einer konstantzeitnahen Web-Crypto-Prüfung.

### Datenschutz und Datenminimierung

Nicht vorhanden sind:

- stabile Feld-Allowlists für Profile und Nalozi;
- getrennte Berechtigungen für Summary, Detail und Kontaktdaten;
- serverseitige Entfernung verbotener Kategorien;
- nachweisbare Retention-/Deletion-Regeln;
- DPIA-/Zweck-/Rechtsgrundlagen-Artefakte;
- PII-Redaktionsschicht vor MCP-Ausgabe und Logs;
- verifizierte Tenant-Isolation.

Stattdessen liefern einzelne Pfade `SELECT k.*` beziehungsweise `SELECT *`. Kandidatensuche exponiert Geburtsdatum und Alter grundsätzlich und bietet einen Staatsbürgerschafts-/EU-Filter.

### MCP-Verträge

Nicht vorhanden sind:

- Tool-Annotationen wie `readOnlyHint` und `destructiveHint`;
- Output-Schemas;
- `structuredContent`;
- eine strikt versionierte Descriptorquelle;
- striktes Ablehnen unbekannter Inputfelder;
- stabile maschinenlesbare Fehlercodes;
- sichere fachliche `isError`-Resultate;
- Descriptor-/Schema-Snapshots in CI.

Die Resultate werden ausschließlich als formatierter JSON-String in einem Textblock zurückgegeben.

### SQL-Sicherheitsgrenzen

Nicht vorhanden sind:

- echter SQL-AST-Parser;
- genau-ein-Statement-Garantie;
- Kommentar-, CTE-, Union-, Unterabfrage- und Funktionspolicy;
- exakte Tabellen-, Spalten- und Funktions-Allowlist;
- serverseitig injizierter Tenant-Predicate;
- durchgesetzter maximaler `LIMIT` bei explizitem Limit;
- Statement-Timeout;
- Query-Kosten-/Byte-Budget;
- bewiesener read-only DB-Principal;
- sichere DB-Fehlerübersetzung.

Die vorhandenen Regex-Prüfungen sind keine belastbare SQL-Sicherheitsgrenze. `information_schema` ist sogar ausdrücklich freigegeben.

### Delivery und Provenienz

Cloudflare Workers Builds ist konfiguriert, aber:

- die Build-Historie enthält null Builds;
- die aktive Version hat keinen zugeordneten Build;
- sie wurde direkt über die API hochgeladen;
- das heruntergeladene Artefakt enthält nur ein 3,8-MB-Bundle;
- Source Map, TypeScript-Quellen, `package.json`, Lockfile und Tests fehlen im lokalen Export;
- der exportierte `wrangler.jsonc` enthält die historische DO-Migration nicht, obwohl der aktive Runtime-Stand `migration_tag: v1` meldet;
- Build-/Dependency-Provenienz ist dadurch nicht lokal reproduzierbar;
- Deployment-Kommentare behaupten Regressionstests, aber zugehörige Reports sind nicht verfügbar.

### Observability und Betriebssicherheit

Nicht vorhanden oder nicht belegt sind:

- strukturierte anwendungsspezifische Tool-Logs;
- sichere Korrelation ohne PII;
- Metriken pro Tool, Fehlerklasse, Rows/Bytes und Latenz;
- SLOs und Fehlerbudgets;
- Alerts;
- Tail Worker oder OpenTelemetry-Export;
- Incident-, Rollback- und Key-Rotation-Runbooks;
- kontrollierte Log-Retention und Feldredaktion;
- Last-/Soak-/Failure-Tests;
- Readiness für Hyperdrive/DB.

Die aktuelle Observability-Konfiguration ist widersprüchlich: top-level `enabled` ist `false`, während Logs und Traces aktiviert und persistiert sind. Sampling steht auf 100 Prozent, Query-String-Redaktion ist deaktiviert. Da Invocation Logs bei Fetch-Aufrufen die URL erfassen, ist die gleichzeitige Unterstützung von `?token=` ein besonders kritischer Leak-Pfad.

## Plattformbefunde

### Hyperdrive

Positiv:

- richtige Bindung statt direkter Cloudflare-REST-Nutzung;
- TLS zum Origin ist erforderlich;
- neue Clients werden innerhalb der Ausführung erzeugt und geschlossen;
- Smart Placement kann Datenbanklatenz reduzieren.

Risiken und offene Punkte:

- der sichtbare DB-Benutzer heißt `avnadmin`; das deutet auf einen hochprivilegierten Principal hin und muss über reale Grants verifiziert werden;
- Query-Caching ist aktiv, obwohl CRM-Daten Aktualität und Datenschutz erfordern;
- Cache-Freshness/TTL ist im sichtbaren Stand nicht dokumentiert;
- Writes invalidieren Hyperdrive-Read-Caches nicht automatisch;
- Origin-Verbindungslimit ist 60;
- `crm_beruf_report` startet vier Datenbankverbindungen parallel;
- Kandidatensuche verwendet getrennte Count- und Rows-Queries, wodurch zusätzliche Verbindungen und Live-Inkonsistenz entstehen;
- es gibt keinen sichtbaren Query-Timeout.

Empfehlung: separaten read-only DB-User mit minimalen Views/Grants verwenden. Caching pro Queryklasse bewusst entscheiden: für schnell veraltende Kandidaten-/Statusdaten eher deaktivieren oder sehr kurz begrenzen; für stabile Mapping-/Aggregatdaten gezielt nutzen. Keine pauschale Cache-Aktivierung.

### Durable Object und Agents SDK

Der Worker basiert auf `McpAgent`, also einem Durable Object. Die aktuelle Cloudflare-Anleitung erklärt `McpAgent` als deprecated und feature-frozen; neue Server sollen MCP SDK v2 plus `createMcpHandler` verwenden.

Die elf aktuellen Tools sind normale synchrone Datenbank-Leseoperationen. Im Anwendungscode ist kein fachlicher Bedarf für:

- serverseitiges Sampling;
- Elicitation;
- Roots;
- Event Replay;
- langfristige Sessionzustände;
- WebSocket-Anwendungszustand;
- Scheduling oder Agent State

erkennbar. Damit ist das Durable Object wahrscheinlich Architektur-Overhead statt fachlicher Notwendigkeit. Es verursacht zusätzliche Zustands-, Migrations-, Speicher- und Sessionkomplexität.

Empfehlung: als bevorzugte Zielrichtung einen stateless MCP-SDK-v2-Handler bewerten. Das Durable Object nur behalten, wenn ein konkret benannter sessionful Use Case existiert. Eine Migration darf erst nach Client-/Transporttests entschieden werden.

### Bundle und Abhängigkeiten

Das Bundle umfasst rund 97.000 Zeilen beziehungsweise 3,8 MB und enthält unter anderem:

- Agents SDK;
- MCP SDK v1;
- MCP Client/Core/Server v2;
- Zod v3 und v4;
- AJV;
- MySQL-Treiber;
- Cap'n Web;
- Scheduling-, Email-, Agent-, Workflow- und weitere Frameworkteile.

Der Anwendungscode selbst ist nur ein kleiner Abschnitt am Bundle-Ende. Mehrere MCP-Generationen und zahlreiche ungenutzte Agents-Fähigkeiten werden mit ausgeliefert. Ohne Originalprojekt und Bundle-Analyse ist nicht beweisbar, welcher Anteil tree-shakebar ist. Eine stateless v2-Implementierung dürfte jedoch wesentlich kleiner und wartbarer sein.

## Tool-für-Tool-Urteil

| Tool | Nutzen | Hauptrisiko | Empfehlung |
|---|---|---|---|
| `crm_search_guide` | Agentenregeln | Guide bestätigt riskante Policies; Versionsdrift | aus versionierter Contractquelle generieren |
| `crm_stats` | schnelle Übersicht | globale Zahlen ohne Tenant/Scope | nur autorisierte Aggregation, ggf. Tenant-Scope |
| `crm_beruf_report` | fachlich nützliche Aggregation | vier Parallelqueries, schwache Grenzen, Defaultsprache | als fokussiertes Tool behalten und härten |
| `crm_search_kandidaten` | Kernsuche mit Count/Pagination | PII, EU-Feld, DOB, rohe Cursor-ID, 1000er Seiten | als Kern behalten, Output und Auth komplett neu begrenzen |
| `crm_kandidat_profile` | Detailansicht | `SELECT k.*`, keine Detailberechtigung | in explizite Summary-/Detailtools teilen |
| `crm_resolve_beruf` | Filterhilfe | schwache Limits/LIKE-Semantik | behalten, strikt validieren |
| `crm_search_companies` | Firmensuche | kein Tenant, schwache Status-/Limitgrenzen | behalten, autorisieren und schemahärten |
| `crm_search_nalozi` | Auftragssuche | `SELECT *`, mögliche interne Felder | explizite Projektion oder vorerst deaktivieren |
| `crm_query` | maximale Flexibilität | zentrale Exfiltrations-/DoS-/Policy-Umgehungsfläche | aus Endnutzer-MCP entfernen |
| `crm_list_tables` | Schemaerkundung | erleichtert Enumeration | nur separates Admin-/Entwicklungstool |
| `crm_describe_table` | Schemaerkundung | Metadatenzugriff, fehlerhafte Präfix-Allowlist | nur separates Admin-/Entwicklungstool |

## Bewertungsmatrix

Die Skala bewertet den aktuellen Produktionsstand, nicht das Verbesserungspotenzial.

| Bereich | Wertung | Begründung |
|---|---:|---|
| Fachliche Grundfunktion | 6/10 | relevante Such-/Reportfunktionen vorhanden |
| Cloudflare-Grundarchitektur | 6/10 | Worker, Hyperdrive, Smart Placement, Versionen sinnvoll gewählt |
| MCP-Konformität/Verträge | 4/10 | Transport funktioniert, aber alte SDK-Lane und schwache Descriptoren |
| Authentifizierung/Autorisierung | 1/10 | gemeinsamer Bearer, URL-Token, keine Scopes/Tenants |
| Datenschutz/Datenminimierung | 1/10 | Vollprofile, `SELECT *`, DOB und Staatsbürgerschaft |
| SQL-/Datenbank-Sicherheit | 2/10 | parametrisierte Fokustools, aber freies SQL und unbewiesene DB-Rechte |
| Zuverlässigkeit | 4/10 | Versionierung vorhanden; Timeouts, Budgets und Readiness fehlen |
| Observability | 3/10 | Plattformlogging vorhanden, aber widersprüchlich und nicht datensparsam |
| Testing/Evidenz | 2/10 | Eval-Ideen und Testbehauptungen, aber keine reproduzierbaren Reports |
| Delivery/Provenienz | 2/10 | Builds konfiguriert, aktive Version umgeht Build-Pipeline |
| Wartbarkeit | 3/10 | kleiner Appkern, aber großes Bundle, Versionsdrift und fehlende Quellen |

**Gesamturteil: circa 3/10 für Produktion mit realen Kandidatendaten.** Als intern begrenzter Beta-Prototyp ist das System nutzbar; als dauerhaftes CRM-Sicherheitsboundary nicht.

## Optimierungsrichtungen – noch keine Umsetzung

### Richtung A: aktuelle Architektur kurzfristig härten

Geeignet als Übergang, nicht als Endzustand:

1. URL-Token entfernen und Secret rotieren.
2. `crm_query`, Tabellenmetadaten und `SELECT *`-Tools deaktivieren.
3. EU/Staatsbürgerschaft und DOB aus der Oberfläche entfernen.
4. CORS/Origin strikt begrenzen.
5. Query-String-Redaktion aktivieren, Sampling reduzieren, sichere strukturierte Logs definieren.
6. Read-only DB-Principal und Statement-Timeout erzwingen.
7. Output-Allowlists und kleinere Seitenlimits einführen.

Vorteil: schnellstes Risikosenken. Nachteil: gemeinsamer Bearer, alte SDK-Lane und fehlende Mandantenfähigkeit bleiben konzeptionell bestehen.

### Richtung B: stateless MCP SDK v2 als empfohlene Zielarchitektur

1. `McpAgent`/DO durch `createMcpHandler` und MCP SDK v2 ersetzen.
2. OAuth 2.1, Subject/Tenant/Role/Scope als zentrale Policy-Schicht.
3. ausschließlich fachliche, eng typisierte Tools.
4. strikte Input-/Output-Schemas und `structuredContent`.
5. statische, parametrisierte Queries auf read-only Views.
6. reproduzierbarer Git-Build mit Tests, SBOM, Canary und Rollback.

Vorteil: kleinere Angriffsfläche, weniger State und bessere Wartbarkeit. Nachteil: erfordert eine geplante Migration und End-to-End-Clienttests.

### Richtung C: Durable Object bewusst behalten

Nur sinnvoll, wenn mindestens ein klarer sessionful Bedarf bestätigt wird, etwa Event Replay, serverseitige Elicitation/Sampling, dauerhafte MCP-Sessions oder Agentenstatus. Dann müssen DO-Sharding, Speicherretention, Migrationen, Sessionautorisierung und Wiederherstellung ausdrücklich Teil des Designs werden.

## Entscheidungen für unsere Besprechung

Vor jeder Umsetzung sollten wir diese Fragen beantworten:

1. Ist der Dienst nur für eine interne Person oder für mehrere Benutzer/Teams/Mandanten gedacht?
2. Welche Kandidatenfelder dürfen Suche, Liste und Detailansicht jeweils tatsächlich liefern?
3. Gibt es eine belastbare Rechtsgrundlage für Alter, Geburtsdatum oder Staatsbürgerschaft – oder sollen diese vollständig verschwinden?
4. Darf freies SQL aus einem Agenten heraus überhaupt existieren? Meine Empfehlung ist nein.
5. Müssen Resultate sekundengenau aktuell sein, oder sind definierte Cache-TTLs zulässig?
6. Gibt es einen echten sessionful MCP-Use-Case, der Durable Objects rechtfertigt?
7. Welcher Identity Provider soll OAuth liefern und wie werden Tenant/Rollen abgebildet?
8. Welche Tools gehören zu Endnutzern und welche ausschließlich in eine separate Admin-/Entwicklungsoberfläche?
9. Soll jeder Produktionsstand zwingend aus dem verbundenen Git-Build mit grünen Tests stammen?
10. Welche SLOs gelten für Latenz, Fehlerquote und Datenaktualität?

## Priorisierte Empfehlung

Meine Empfehlung für die spätere Umsetzung ist Richtung B, mit einem vorgeschalteten kurzen P0-Hardening aus Richtung A. Der fachliche Kern – Kandidatensuche, Aggregatreport, Berufsauflösung, Firmen- und Auftragssuche – kann erhalten bleiben. Freies SQL, Vollprofil-`SELECT *`, Schemaerkundung und sensible Filter sollten nicht Teil der normalen MCP-Oberfläche sein.

Bis wir die zehn Entscheidungen oben gemeinsam getroffen haben, sollte nichts migriert oder neu deployed werden.

## Verwandte Artefakte

- `docs/cloudflare-worker-source-audit.md` – detaillierte Codefundstellen und Security-Befunde;
- `docs/mcp-server-primary-source-audit.md` – Abgleich von Plugin, Policies und offiziellen MCP/OpenAI-Quellen;
- `worker-source/crm-pipedrive-worker/src/index.js` – gehashtes aktives Produktionsbundle;
- `worker-source/crm-pipedrive-worker/wrangler.jsonc` – aus Cloudflare exportierte Konfiguration.
