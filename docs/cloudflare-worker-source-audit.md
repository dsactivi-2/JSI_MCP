# Cloudflare-Worker-Source-Audit: `crm-pipedrive-worker`
> **Nachfolge, 6. Oktober 2026:** Die aktive Planung behält für den neuen Server das Geburtsdatum in der Kandidatensuchliste und den Filter `eu_buerger`. Diese beiden Entfernungsempfehlungen sind ersetzt. `SELECT *`, das Token in der URL und die übrigen Datenschutzverbote bleiben. Die Entscheidung steht in [changes.md](changes.md).

> **Name note, 5 October 2026:** The user rejected the working title Lena. These pages keep the dated findings. Current names and the transition decision are in [project.md](project.md) and [memory.md](memory.md). The Linear title has not been renamed because no replacement name was given.

> **Statushinweis vom 5. Oktober 2026:** Dieser Befund bleibt historische
> Evidenz. Source-Provenienz ist `ACT-143`, Security-Härtung `ACT-142` und
> ACT-144, und Release-Evidenz ACT-154 im Linear-Tracker dieses Projekts. Der Titel Lena ist nicht der Produktname.
> Der vorhandene Live-Worker wird in der aktuellen Phase nicht verändert.

Stand: 4. Oktober 2026  
Cloudflare-Konto: `ds@activi.io` (`2f8c7ae79d6d316eac3961585f5c2f5b`)  
Aktive Version: `bf50f9bb-bc11-4900-9b7c-cb8269dc343f` (Deployment `d4be2d2b-e7ce-4fb2-ba7b-4211a30c33cd`)  
Worker-Tag: `0.1.0-beta.6`, Version 33  
Lokales Produktionsbundle: `worker-source/crm-pipedrive-worker/src/index.js`  
SHA-256: `3afa3e173ad0cf604795407e8e923889ccf79da89235f74c4ae82c229e53378d`

## Gesamturteil

Der Worker ist funktional nachvollziehbar, aber in seiner gegenwärtigen Form für reale Kandidatendaten **nicht sicher freigabefähig**. Die Implementierung ist kein bloßer Prototypfehler: Der eingebettete Guide erklärt mehrere Hochrisiko-Eigenschaften ausdrücklich zum gewünschten Verhalten, darunter gemeinsame Anmeldung, Vollprofile, Staatsbürgerschaft/EU-Klassifizierung, Geburtsdatum/Alter, freies SQL und hohe Limits.

Die vier wichtigsten Release-Blocker sind:

1. ein gemeinsamer statischer Bearer ohne Nutzer-, Mandanten-, Rollen- oder Scope-Bindung, zusätzlich als URL-Query-Token akzeptiert;
2. ein frei formulierbares SQL-Tool mit umgehbaren Regex-Prüfungen, offenem Metadatenzugriff und nicht erzwungenem Zeilenlimit;
3. systematische Datenüberexposition (`SELECT k.*`, `SELECT *`, Geburtsdatum/Alter und Staatsbürgerschaft);
4. fehlende Tool-Annotationen, Output-Schemas, strukturierte Resultate, Origin-Allowlist, Query-Timeouts und belastbare Laufzeitgrenzen.

Der Download ist ein 3,8-MB-Produktionsbundle ohne Source Map und ohne ursprüngliche TypeScript-Projektdateien, Tests oder Lockfile. Der Audit kann daher die ausgelieferte Logik bewerten, aber keine reproduzierbare Build-Provenienz oder Dependency-Prüfung liefern.

## Positive Befunde

- Der Worker läuft über HTTPS, nutzt Streamable HTTP auf `/mcp` und eine Durable-Object-Bindung.
- Datenbankzugriffe der fokussierten Suchtools verwenden überwiegend Platzhalterparameter.
- Die Kandidatensuche nutzt `COUNT(DISTINCT)`, stabile absteigende ID-Sortierung und Same-row-Semantik für Sprache plus Niveau.
- `count_only`, Cursor und `has_more` sind implementiert.
- Archivstatus 3 wird in Kandidatensuche und Berufsreport standardmäßig ausgeschlossen.
- Secrets liegen als Cloudflare-Secret-Binding vor und wurden beim Source-Download nicht offengelegt.
- Der heruntergeladene JavaScript-Bundle besteht `node --check`.

Diese Punkte reduzieren einzelne Fehlerklassen, kompensieren aber nicht die fehlende Autorisierung und Datenminimierung.

## Befunde nach Schweregrad

### P0.1 – Gemeinsamer statischer Bearer, URL-Token und keine Autorisierung

**Evidenz:** `index.js:97090-97099`

Der Worker akzeptiert entweder `Authorization: Bearer ...` oder `?token=...` und vergleicht den Wert direkt mit `WORKER_API_KEY`. Es gibt keine Prüfung von Subject, Tenant, Rolle, Scope, Issuer, Audience, Ablauf oder Widerruf.

**Auswirkungen:**

- Jeder Besitzer des gemeinsamen Tokens erhält dieselbe globale Datenoberfläche.
- Ein kompromittiertes Token ist nicht auf Benutzer, Tool oder Mandant begrenzt.
- Query-Token können in Browserhistorie, Proxy-/Edge-/Invocation-Logs, Referer, Screenshots und Support-Artefakten gelangen.
- `wrangler.jsonc:16` setzt gleichzeitig `redact_query_string: false`; persistierte Invocation-Logs und Traces sind aktiviert. Damit ist die URL-Token-Option besonders riskant.

**Fix:** Query-Token sofort entfernen. Für reale Daten OAuth 2.1/MCP Authorization mit Protected Resource Metadata, PKCE, Audience-/`resource`-Bindung und serverseitiger Scope-/Tenant-Prüfung pro Tool verwenden. Bis dahin den Worker auf einen eng kontrollierten Entwicklungszugang begrenzen und den gemeinsamen Schlüssel rotieren.

### P0.2 – Freies SQL ist keine sichere Read-only-Grenze

**Evidenz:** `index.js:96668-96670`, `97008-97027`

`crm_query` prüft nur, ob der String mit `SELECT` beginnt, verbietet eine kurze Keywordliste und extrahiert Tabellen ausschließlich aus einfachen `FROM`-/`JOIN`-Mustern. Das ist kein SQL-Parser.

Konkrete Lücken:

- Kommentare und mehrere Statements werden nicht verboten.
- CTEs, Unterabfragen, `UNION`, Funktionen, Systemvariablen und zeit-/ressourcenintensive Ausdrücke werden nicht begrenzt.
- `information_schema` ist ausdrücklich erlaubt.
- Die Tabellen-Allowlist ist nur ein Präfixregex: `beruf_mapping_evil` und `information_schema_extra` passen ebenfalls.
- Ein beliebiges Vorkommen des Wortes `limit`, auch in Kommentar oder String, verhindert das serverseitige Anhängen von `LIMIT 200`.
- Ein explizites `LIMIT 1000000` bleibt unverändert.
- Es gibt keine Spalten- oder Funktions-Allowlist, keinen serverseitigen Tenant-Predicate und keinen erkennbaren Statement-Timeout.
- Ob der DB-Benutzer technisch read-only ist, ist aus dem Worker nicht beweisbar.

**Fix:** `crm_query` aus der normalen Tool-Oberfläche entfernen. Fehlende Use Cases über eng typisierte, parametrisierte Tools abbilden. Falls freies SQL administrativ zwingend ist: eigener Admin-Server, eigener Scope, AST-Parser des exakten Dialekts, genau ein Statement, feste Relation-/Spalten-/Funktions-Allowlist, verpflichtender Tenant-Predicate, Read-only-DB-Principal, Transaktion, Timeout, Row-/Byte-Limit und redigierte Fehler.

### P0.3 – Vollprofile und interne Felder werden ungefiltert ausgeliefert

**Evidenz:** `index.js:96900-96930`, `96984-97005`

`crm_kandidat_profile` führt `SELECT k.*` aus und ergänzt Sprach-, Berufs- und Ausbildungsdaten. Es gibt keine Feld-Allowlist, keine Zweckbindung, keine Kontakt-/Notiz-/Dokument-Redaktion, keinen Archivschutz und keine separate Berechtigung. `crm_search_nalozi` verwendet ebenfalls `SELECT *`.

**Auswirkungen:** Neue Datenbankspalten werden automatisch Teil der externen API. Damit kann eine harmlose Schemaänderung ohne Worker-Änderung zusätzliche PII oder interne Felder exponieren.

**Fix:** Ausschließlich explizite Projektionen; getrennte Summary-/Detail-/Kontakt-Tools mit eigenen Scopes; Output-Allowlist nach der Query; Vertragstest, der bei neu auftauchenden Feldern fehlschlägt. Archivierte Datensätze und sensible Detailklassen getrennt autorisieren.

### P0.4 – Staatsbürgerschaft, Geburtsdatum und Alter sind bewusst exponiert

**Evidenz:** `index.js:96802-96816`, `96834-96840`, `96883-96896`

Die Suche bietet `eu_buerger`, filtert direkt auf `kandidat_drzavljanstvo_vrsta` und liefert bei jeder Suchzeile Geburtsdatum sowie berechnetes Alter – selbst wenn kein Altersfilter angefordert wurde. `eu_buerger=false` zählt `NULL` als Nicht-EU, was fachlich nicht dasselbe ist.

**Fix:** Staatsbürgerschaft/EU-Feld vollständig aus Tool, SQL, Output und Logs entfernen, sofern keine separat dokumentierte Rechtsgrundlage und Freigabe existiert. Geburtsdatum niemals im Suchresultat ausgeben. Falls Alter fachlich zulässig ist, nur eine angeforderte Altersband-Aussage serverseitig berechnen; unbekannt bleibt unbekannt.

### P0.5 – Keine Nutzer- oder Mandantentrennung in Queries

**Evidenz:** sämtliche Queries `96693-97070`; der Guide nennt bei `96671` ausdrücklich „Keine individuellen Mandantenfilter als aktuelle Pflicht“.

Keine Query enthält einen serverseitig erzwungenen Tenant-Scope. `crm_stats`, Tabellenmetadaten und alle Such-/Profiltools arbeiten global.

**Fix:** Tenant aus verifiziertem Tokenkontext ableiten, nie aus Toolargumenten. Jede relevante Relation durch serverseitig injizierte Policy oder DB-Level-RLS/View begrenzen. Negative Tests für fremde IDs, Cursor und SQL sind Pflicht.

### P1.1 – CORS erlaubt standardmäßig jede Origin; keine Origin-Abweisung

**Evidenz:** gebündelte Frameworklogik `index.js:95854-95871`; Aufruf ohne `corsOptions` bei `97097-97099`.

Ohne Option liefert das Framework `Access-Control-Allow-Origin: *`. Es gibt keine Anwendungskontrolle, die eine unerwartete `Origin` mit 403 ablehnt. Der Bearer schützt zwar vor anonymem Datenzugriff, doch ein kompromittierter/leakender Token kann von beliebigen Web-Origin-Kontexten verwendet werden.

**Fix:** Eng definierte Origin-Allowlist, explizite 403-Ablehnung fremder Origins, korrekte `Vary: Origin`-Behandlung und Negativtests. Nicht-Browser-Clients ohne Origin separat behandeln.

### P1.2 – Tool-Sicherheitsmetadaten fehlen vollständig

**Evidenz:** alle elf `registerTool`-Konfigurationen `96678-97052` enthalten nur Beschreibung und Inputschema.

Keine Toolregistrierung setzt `readOnlyHint`, `destructiveHint`, `idempotentHint` oder `openWorldHint`. Damit stimmen der lokale Vertrag und die ausgelieferte Oberfläche nicht überein; Clients erhalten keine verlässliche Klassifikation.

**Fix:** Alle Descriptoren zentral definieren und snapshot-testen. Für begrenzte CRM-Leseoperationen `readOnlyHint: true`, `destructiveHint: false`, passende Idempotenz und bewusst gewählten Open-world-Hinweis setzen. Annotationen bleiben Metadaten und ersetzen keine Autorisierung.

### P1.3 – Keine Output-Schemas oder `structuredContent`

**Evidenz:** `text()` bei `96650-96652` serialisiert jedes Resultat nur als JSON-Text.

Es existieren weder `outputSchema` noch strukturierte Resultate. Dadurch können Host und Tests keine Felder zuverlässig validieren; PII-Drift bleibt leichter unbemerkt.

**Fix:** Pro Tool ein striktes Output-Schema und eine serverseitige Resultatvalidierung einführen; `structuredContent` liefern und nur bei Bedarf eine kurze Textdarstellung ergänzen.

### P1.4 – Eingabeschemas sind inkonsistent und teilweise nur beschreibend

**Evidenz:** `96707-96713`, `96936-96939`, `96961-96965`, `96988-96992`.

- `top_positionen`, Resolver-/Firmen-/Nalozi-Limits sowie mehrere IDs/Statuswerte besitzen keine `.int()`, `.min()` oder `.max()`-Grenzen.
- `capLimit()` rundet nicht; Bruchteile können in `LIMIT` landen.
- Negative Werte fallen bei manchen Tools auf Default zurück statt als ungültig zu scheitern.
- Strings und Arrays haben keine sinnvollen Längen-/Anzahlgrenzen.
- Zod-Objekte verwerfen unbekannte Keys standardmäßig, statt sie strikt abzulehnen; deshalb können falsche Parameter still akzeptiert werden.
- `%` und `_` in Suchstrings werden nicht escaped; dies ist keine klassische SQL-Injection, erweitert aber unbemerkt die LIKE-Semantik.
- `alter_von > alter_bis`, unrealistische Alter und inkonsistente Kombinationen werden nicht sauber validiert.

**Fix:** `.strict()`-Objekte; ganzzahlige und realistische Grenzen; relationale Validierung; String-/Array-Caps; definierte Literal-vs-Wildcard-Semantik; generierte JSON-Schemas aus derselben Runtimequelle.

### P1.5 – Cursor ist manipulierbar und nicht an Kontext gebunden

**Evidenz:** `96829-96830`, `96881-96896`.

Der Cursor ist die rohe Kandidaten-ID. Er ist weder signiert noch an Nutzer, Tenant, Filter oder Ablauf gebunden. Zudem ist die Konsistenz ausdrücklich `live_per_call_not_snapshot`; parallele Änderungen können Vollständigkeit und Duplikatfreiheit beeinflussen.

**Fix:** Opaker, signierter Cursor mit Query-/Filterhash, Subject/Tenant, Sortierschlüssel, Version und Ablauf. Semantik von `total_count` und Snapshot-Konsistenz dokumentieren.

### P1.6 – Datenbankzugriffe ohne sichtbaren Timeout und sichere Fehlergrenze

**Evidenz:** `96632-96647`.

Pro Query wird eine neue MySQL-Verbindung eröffnet und geschlossen. Es gibt keinen sichtbaren Connect-/Statement-Timeout, keine Cancellation, keine Retry-Policy, kein Query-Budget und keine Fehlerredaktion im Anwendungscode. Rohfehler propagieren bis zum MCP-Framework.

**Fix:** feste Connect-/Statement-Timeouts, Abort-Signal, kontrollierte Retry-Regeln nur für sichere transiente Fehler, Byte-/Row-Budgets und stabile redigierte Fehlercodes. DB-Interna nie an Modelle oder Nutzer geben.

### P1.7 – Pfadmatching und Legacy-SSE sind unnötig breit

**Evidenz:** `97090-97099`.

`startsWith("/mcp")` und `startsWith("/sse")` matchen auch Pfade wie `/mcp-foo`. Zusätzlich bleibt Legacy-SSE parallel offen, obwohl Streamable HTTP der aktuelle Zieltransport ist.

**Fix:** exakte Pfade bzw. wohldefinierte Unterpfade matchen; Legacy-SSE nach Migrationsprüfung entfernen oder separat absichern und testen.

### P1.8 – Versionen und Dokumentation driften

**Evidenz:** Guide `1.3.0` bei `96671`, MCP-Serverversion `1.1.0` bei `96676`, Worker-Tag `0.1.0-beta.6`; lokale Plugin-Dokumente nennen wiederum andere Zustände.

**Fix:** eine Releasequelle für Plugin, Guide, Toolschemas, Serverversion, Commit und Deployment-ID. CI muss Drift blockieren.

### P2.1 – Observability-Konfiguration ist widersprüchlich und datenschutzriskant

**Evidenz:** `wrangler.jsonc:13-27`.

Top-level `observability.enabled` ist `false`, während Logs und Traces jeweils aktiviert, persistiert und mit Sampling 1 konfiguriert sind. Query-String-Redaktion ist aus. Unabhängig von der genauen Cloudflare-Prioritätssemantik ist die Absicht unklar und nicht als datensparsames Logging-Design erkennbar.

**Fix:** Effektivzustand in Cloudflare verifizieren; Query-Strings immer redigieren; Sampling und Retention begrenzen; Toolname, sichere Korrelation, Latenz, Fehlerklasse und Row-/Byte-Zahl protokollieren – niemals Token, SQL-Literal, Prompt oder Kandidateninhalt.

### P2.2 – Healthcheck ist nur ein Prozesssignal

**Evidenz:** `97087-97089`.

`/health` ist öffentlich und antwortet immer mit Zeitstempel. Es prüft weder Durable Object noch Hyperdrive/DB, Version oder Readiness. Das ist als Liveness okay, aber kein Readiness-/Dependency-Check.

**Fix:** Liveness minimal lassen; getrennte intern geschützte Readiness mit sicheren Dependency-Signalen und Deployment-Version ergänzen.

### P2.3 – Kein reproduzierbarer Quellstand

Das Dashboard lieferte ein minifiziertes/gebündeltes JavaScript mit Source-Map-Verweis, aber ohne Map, TypeScript-Quellen, `package.json`, Lockfile, Unit-/Integrationstests oder CI-Konfiguration.

**Fix:** ursprüngliches Workerprojekt in Versionskontrolle; deterministischer Build; SBOM und Dependency-Scan; Deployment aus CI; Source Map sicher archivieren; Artefakthash und Tests mit Version/Deployment verknüpfen.

## Tool-für-Tool-Bewertung

| Tool | Urteil | Hauptproblem |
|---|---|---|
| `crm_search_guide` | mittel | unbekannte Keys werden voraussichtlich verworfen; Guide bestätigt riskante Betriebsregeln; Versionsdrift |
| `crm_stats` | hoch | globale Datenbankzahlen ohne Tenant-/Scope-Prüfung |
| `crm_beruf_report` | hoch | globale Aggregation, schwache Grenzen, Defaultsprache trotz gegenteiliger Guide-Regel |
| `crm_search_kandidaten` | kritisch | Staatsbürgerschaft, DOB/Alter, rohe Cursor-ID, 1000er Seiten, kein Tenant |
| `crm_kandidat_profile` | kritisch | `SELECT k.*`, komplette Profile, keine Projektion/Detailautorisierung |
| `crm_resolve_beruf` | mittel | schwaches Limit, unescaped LIKE-Wildcards, globale Daten |
| `crm_search_companies` | hoch | kein Tenant; Status/Limit schwach validiert |
| `crm_search_nalozi` | kritisch | `SELECT *`, kein Tenant, mögliche interne Felder |
| `crm_query` | kritisch | frei formulierbares SQL mit Regex-Sicherheitsgrenze |
| `crm_list_tables` | hoch | Schemaerkundung für jeden Tokenbesitzer |
| `crm_describe_table` | hoch | Spalten-/Typmetadaten; fehlerhafte Präfix-Allowlist |

## Empfohlene Zielarchitektur

1. **Edge/Auth:** exakte `/mcp`-Route, OAuth-Ressourcenserver, Origin-Allowlist, per-Subject-/Tenant-Rate-Limits.
2. **Policy Layer:** Tool → Scope/Rolle/Zweck; Tenant aus Authkontext; unveränderliche Feld-Allowlists.
3. **Domain Tools:** kleine Such-, Count-, Summary-, Company- und Assignment-Operationen; kein Endnutzer-SQL.
4. **Query Layer:** ausschließlich parametrisierte statische Queries oder geprüfte Query-Builder; DB-Level-Views/RLS; harter Timeout und Cap.
5. **Output Guard:** Schema-Validierung, PII-Allowlist, strukturierte Resultate, keine neue DB-Spalte ohne Contractänderung.
6. **Audit/Telemetry:** datensparsame strukturierte Ereignisse, sichere Korrelations-ID, kein Token/SQL/PII.
7. **Delivery:** TypeScript-Source, Tests, Lockfile, SBOM, Staging, Canary und Rollback; Deployment-Metadaten aus einer Quelle.

## Reihenfolge der Behebung

### Sofort

1. `crm_query`, `crm_kandidat_profile`, `crm_search_nalozi`, `crm_list_tables` und `crm_describe_table` deaktivieren.
2. URL-Token entfernen, Query-String-Redaktion aktivieren und gemeinsamen Schlüssel rotieren.
3. Staatsbürgerschaft/EU, Geburtsdatum und nicht explizit erlaubte Profilfelder aus Outputs entfernen.
4. Zugriff bis zur Tenant-/Scope-Kontrolle auf einen klar begrenzten Testkontext beschränken.

### Danach

1. OAuth/Tenant-/Scope-Layer und exakte Toolberechtigungen implementieren.
2. Strikte Input-/Output-Schemas, Annotationen und strukturierte Resultate ergänzen.
3. Timeout, Row-/Byte-Caps, sichere Fehler und signierte Cursor einführen.
4. Synthetische End-to-End-Tests für Tenant-Isolation, verbotene Felder, unbekannte Keys, SQL-Payloads, Origin und Authfälle automatisieren.

### Vor Produktion

1. Reproduzierbares Sourceprojekt und CI/CD etablieren.
2. Datenschutzprüfung/DPIA, Retention, Löschung, Incident- und Key-Rotation-Runbooks abschließen.
3. Last-/Soak-/Failure-Tests und Cloudflare-Alerts aufbauen.
4. Externen Security Review mit konkretem Deployment-Artefakt durchführen.

## Verifikation dieses Audits

- Worker-Inventar, Deployment und Version wurden über Wrangler aus dem authentifizierten Cloudflare-Konto gelesen.
- Der aktive Worker wurde mit Wrangler aus dem Dashboard heruntergeladen; Secrets wurden nicht exportiert.
- Syntaxprüfung: `node --check worker-source/crm-pipedrive-worker/src/index.js` – erfolgreich.
- Es wurden keine CRM-Datensätze abgefragt, keine Worker-Einstellungen verändert und kein Deployment ausgelöst.
- Die Bewertung bezieht sich auf das oben gehashte Bundle; spätere Deployments müssen neu auditiert werden.
