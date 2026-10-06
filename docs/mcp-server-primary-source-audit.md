# Primärquellen-Audit: Candidate Search MCP / Cloud-CRM
> **Nachfolge, 6. Oktober 2026:** Die aktive Planung behält für den neuen Server das Geburtsdatum in der Kandidatensuchliste und den Filter `eu_buerger`. Diese beiden Entfernungsempfehlungen sind ersetzt. `SELECT *`, das Token in der URL und die übrigen Datenschutzverbote bleiben. Die Entscheidung steht in [changes.md](changes.md).

> **Name note, 5 October 2026:** The user rejected the working title Lena. These pages keep the dated findings. Current names and the transition decision are in [project.md](project.md) and [memory.md](memory.md). The Linear title has not been renamed because no replacement name was given.

> **Statushinweis vom 5. Oktober 2026:** Dieses frühe Repository-Audit ist ein
> historischer Stand. Der spätere Worker-Source-Audit hat bei
> Implementierungsbefunden Vorrang; aktuelle Maßnahmen liegen im getrennten
> Linear-Tracker dieses Projekts (ACT-140 bis ACT-154). Der Titel Lena ist nicht der Produktname.

> **Nachtrag:** Der aktive Cloudflare-Worker und sein ausgeliefertes Produktionsbundle wurden inzwischen direkt aus dem authentifizierten Cloudflare-Konto abgerufen. Die zuvor als „nicht prüfbar“ markierten Implementierungsbereiche sind im separaten [Cloudflare-Worker-Source-Audit](./cloudflare-worker-source-audit.md) mit konkreten Codefundstellen bewertet. Wo beide Berichte voneinander abweichen, hat der Source-Audit Vorrang.

Stand: 4. Oktober 2026  
Bewerteter Repository-Stand: `/Users/activi/Downloads/MCP Plugin 2`  
Externer Endpunkt laut Paket: `https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp`

## Kurzurteil

Der Repository-Stand ist **kein auditierbarer MCP-Server**, sondern ein Plugin-/Skill-Paket mit Verbindungsmetadaten, Soll-Regeln und noch nicht ausgeführten Evaluationen. Der eigentliche Cloudflare-Worker, seine Authentifizierungslogik, SQL-Parser/Query-Builder, Datenbankrollen, Tenant-Isolation, Rate Limits, Logs, Deployment-Konfiguration und Tests fehlen. Deshalb kann aus diesem Repository weder Protokollkonformität noch Datenschutz- oder Produktionsreife des Servers abgeleitet werden.

Die lokale Paketqualität ist als Entwurf ordentlich: Manifestdaten sind konsistent, der Endpunkt ist HTTPS ohne Token im URL, die Skill-Referenzen sind getrennt, Datenschutz- und Query-Regeln sind ungewöhnlich konkret, und 39 synthetische Eval-Spezifikationen decken viele relevante Fehlermodi ab. Die lokale Prüfung `python scripts/validate_package.py candidate-search` sowie der Skill-Validator liefen erfolgreich. Der offizielle Plugin-Validator ist auf diesem Rechner nicht vorhanden; MCP Inspector und Behavioral Evals wurden nicht ausgeführt.

Der entscheidende Befund ist jedoch eine **harte Drift zwischen lokaler Soll-Policy und Live-Server**:

- lokal: Guide `1.1.0`, `deployment_status: prepared_not_deployed`, Staatsbürgerschaft verboten, keine verifizierte Pagination, unbekannte Eingabefelder müssen abgewiesen werden;
- live laut paralleler Inspektion vom 4. Oktober 2026: Guide `1.3.0`, gemeinsame Anmeldung statt verpflichtender individueller Mandantenscopes, EU-/Staatsbürgerschaft und Vollprofile bleiben verfügbar, `crm_search_kandidaten` enthält `eu_buerger`, `count_only`, `cursor` und `page_size`, `crm_query` dokumentiert offene Kommentar-/Mehrfach-SELECT-Probleme, und `crm_search_guide` akzeptierte einen unbekannten Input-Key.

Damit ist der aktuelle Zustand für reale Kandidatendaten **nicht freigabefähig**. Die kritischsten Risiken sind fehlende nachweisbare per-user/per-tenant Autorisierung, exponierte verbotene Attribute, ein freies SQL-Werkzeug mit dokumentierten Parserlücken, nicht strikt validierte Eingaben und fehlende reproduzierbare Servertests.

## Bewertungsgrenzen und Evidenzklassen

### Direkt aus dem Repository belegt

- Paket- und Skill-Metadaten;
- Endpunkt- und lokale Bearer-Token-Konfiguration;
- lokale Soll-Regeln für Datenschutz, SQL, Tool-Anmerkungen und Limits;
- 39 Eval-Definitionen mit `status: not_executed`;
- lokaler Validator und dessen tatsächlicher Prüfbereich;
- Fehlen von Worker-Quellcode und Servertests.

### Live beobachtet, aber in diesem Teil-Audit nicht unabhängig reproduziert

Die oben zusammengefassten Live-Befunde stammen aus einer parallelen Inspektion derselben Prüfung. Es wurde in diesem Teil-Audit kein authentifizierter CRM-Aufruf wiederholt und kein Live-Output mit Kandidatendaten gespeichert. Vor einer Freigabe müssen die Tool-Deskriptoren, Guide-Ausgabe und Negativtests als sanitisiertes Inspector-Artefakt versioniert werden.

### Nicht prüfbar

- Token-Signatur-, Issuer-, Audience-, Ablauf- und Scope-Prüfung;
- tatsächliche Tenant-Isolation und Rollenprüfung;
- SQL-Parametrisierung, Parser und DB-Rechte;
- Output-Redaktion vor Tool-Ausgabe;
- Origin-Prüfung, Session-Handling und Transport-Lifecycle;
- Rate Limits, Timeouts, Retry-Verhalten, Monitoring, Alerting und Rollback;
- Datenresidenz, Aufbewahrung, Löschung, DPIA und Rechtsgrundlage.

## Relevante normative Primärquellen

Für das Protokoll wurde die aktuelle veröffentlichte MCP-Spezifikation `2026-07-28` herangezogen. OpenAI verweist für authentifizierte Plugin-MCP-Server auf OAuth 2.1 nach MCP-Vertrag, fordert serverseitige Autorisierung pro Anfrage, korrekte Tool-Schemas und Annotationen, Streamable HTTP, produktionsfähige Logs/Metriken sowie Inspector- und End-to-End-Tests.

- [MCP 2026-07-28: Lifecycle](https://modelcontextprotocol.io/specification/2026-07-28/basic/lifecycle)
- [MCP 2026-07-28: Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP 2026-07-28: Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP 2026-07-28: Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [MCP 2026-07-28: Security Best Practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices)
- [OpenAI Developers: Build an MCP server](https://developers.openai.com/plugins/build/mcp-server)
- [OpenAI Developers: Authentication](https://developers.openai.com/plugins/build/auth)
- [OpenAI Developers: Security & Privacy](https://developers.openai.com/plugins/guides/security-privacy)
- [OpenAI Developers: Plugin reference](https://developers.openai.com/plugins/reference)
- [OpenAI Developers: Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [OpenAI API: Remote MCP servers](https://platform.openai.com/docs/guides/tools-connectors-mcp)

## Detailbefunde

### 1. Artefakt- und Architekturgrenze

**Befund: kritisch.** Das Paket bindet einen externen Worker ein, enthält aber keinen Servercode. `candidate-search/.mcp.json` deklariert nur den HTTPS-Endpunkt und `bearer_token_env_var`. `candidate-search/skills/.../references/tool-contracts.md` formuliert Soll-Anforderungen; es ist keine Implementierung. README und Projektstatus sagen selbst, dass der Worker nicht im Repository liegt und der neue Guide nicht deployed ist.

**Folge:** Jede Aussage wie „read-only“, „tenant-sicher“, „parametrisiert“, „redigiert“ oder „maximal 200 Zeilen“ ist ohne Serverbeleg nur Dokumentation. Prompt- oder Skill-Regeln bilden keine Sicherheitsgrenze. OpenAI verlangt, Eingaben und Autorisierung serverseitig zu prüfen; Tool-Annotationen ersetzen diese Kontrollen nicht ([Build an MCP server](https://developers.openai.com/plugins/build/mcp-server#authenticate-and-authorize-requests), [Security & Privacy](https://developers.openai.com/plugins/guides/security-privacy#principles)).

**Empfehlung:** Worker-Code oder reproduzierbares Build-Artefakt in ein getrenntes `server/`-Projekt aufnehmen; Commit-SHA, Deployment-ID und Guide-/Tool-Schema-Version miteinander verknüpfen. Ohne diese Provenienz darf das Plugin nicht als „sicherer CRM-Server“ beworben werden.

### 2. Transport und MCP-Lifecycle

**Positiv:** Der konfigurierte Endpunkt ist HTTPS, stabil benannt und endet auf `/mcp`. Das entspricht OpenAIs Produktionsgrundform: öffentlicher stabiler HTTPS-Endpunkt mit Streamable HTTP ([Build an MCP server](https://developers.openai.com/plugins/build/mcp-server#deploy-the-endpoint)).

**Lücke:** Das Repository beweist nicht, dass der Worker den MCP-Handshake, Versionsverhandlung, `initialized`-Notification, Capability-Aushandlung, Request/Response-Korrelation oder sauberes Session-Handling implementiert. Es gibt kein gespeichertes `initialize`-/`tools/list`-Transkript.

**Lücke:** Bei Streamable HTTP fordert MCP eine `Origin`-Validierung gegen DNS-Rebinding und definiert genaue Anforderungen für HTTP-Methoden, Content Types, Sessions und Wiederaufnahme ([MCP Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)). Keine dieser Kontrollen ist belegt.

**Empfehlungen:**

1. In MCP Inspector `initialize`, `notifications/initialized`, `tools/list`, jede `tools/call`-Variante und Session-Wiederaufnahme protokollieren.
2. Positive/negative `Origin`-Tests hinzufügen; ungültigen Origin mit `403` abweisen.
3. Content-Type-, Method-, Session-ID-, Reconnect- und abgebrochene-Request-Fälle testen.
4. Unterstützte MCP-Protokollversion explizit im Release-Artefakt festhalten und bei inkompatibler Version sauber scheitern.

### 3. Authentifizierung, Autorisierung und Mandantentrennung

**Befund: kritisch.** Das Paket nutzt für den lokalen Beta-Betrieb einen statischen Host-Environment-Bearer. Das hält das Secret aus URL und Repository heraus, belegt aber weder eine individuelle Benutzeridentität noch Mandant, Rolle, Scopes, Revocation oder Audience-Bindung. Die parallele Live-Inspektion meldet sogar „gemeinsame Anmeldung“ und keine verpflichtenden individuellen Mandantenfilter.

OpenAI erwartet bei kundenspezifischen Daten Authentifizierung und bei einem authentifizierten MCP-Server OAuth 2.1: Protected Resource Metadata, Authorization-Server-Discovery, `resource`-Bindung, PKCE und Tokenprüfung bei jeder Anfrage. Tokens ohne erwartete Audience/Scopes müssen abgelehnt werden ([Authentication](https://developers.openai.com/plugins/build/auth#custom-auth-with-oauth-21)). Die aktuelle MCP-Spezifikation verlangt unter anderem Protected Resource Metadata, Resource Indicators, Audience-Prüfung und `401` für ungültige/abgelaufene Tokens ([MCP Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)).

**Zusätzliche Integrationsdrift:** Das Paket verdrahtet `pipedrive-crm` und `CRM_CANDIDATE_MCP_TOKEN`; die aktuelle Projektvorgabe nennt `crm-remote` und `CRM_REMOTE_MCP_TOKEN`. Dadurch können Dokumentation, installierte Verbindung und tatsächlich zugelassene Tool-Oberfläche auseinanderlaufen.

**Empfehlungen:**

1. Gemeinsamen Bearer als reine kurzlebige Entwicklerausnahme behandeln und für echte CRM-Daten deaktivieren.
2. OAuth 2.1 mit RFC-9728 Protected Resource Metadata, Authorization-Server-Metadaten, PKCE `S256`, `resource`/Audience-Bindung, exakten Redirects und minimalen Scopes implementieren.
3. Pro Tool `issuer`, `audience`, `exp`, `nbf`, `scope`, subject, tenant und Rolle prüfen. Tenant nie aus Tool-Argumenten oder SQL übernehmen.
4. Mindestens getrennte Scopes wie `candidates:search`, `candidates:profile`, `companies:read`, `assignments:read` vorsehen; freies SQL nicht in normale Endnutzer-Scopes aufnehmen.
5. Fehlende, abgelaufene, widerrufene, falsche Audience, falscher Scope und fremder Tenant als automatisierte Negativtests ausführen.
6. Servername und Secret-Konvention einmalig auf `crm-remote` oder einen anderen verbindlichen Namen migrieren und alle Manifest-/Skill-/Betriebsdateien synchronisieren.

### 4. Tool-Schemas und strikte Eingabevalidierung

**Befund: kritisch.** Lokal fordert der Tool-Vertrag, unbekannte Felder abzulehnen. Live akzeptierte `crm_search_guide` laut paralleler Prüfung einen unbekannten Input-Key. Das spricht für fehlendes `additionalProperties: false`, unzureichende Laufzeitvalidierung oder beides.

MCP-Tools müssen ein `inputSchema` haben; ein `outputSchema` kann strukturierte Ausgaben festlegen. Wenn ein Output-Schema deklariert ist, muss der Server passende strukturierte Ergebnisse liefern, und Clients sollen sie validieren ([MCP Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)). OpenAI verlangt klare Namen/Beschreibungen, ein korrektes Input-Schema, Output-Schema für strukturierte Daten sowie genaue Annotationen; diese Metadaten sind Teil der Sicherheitsoberfläche ([Build an MCP server](https://developers.openai.com/plugins/build/mcp-server#define-tools-from-user-goals)).

**Schema-Drift:** Lokal behauptet Guide `1.1.0`, Pagination sei nicht exponiert; live enthält `crm_search_kandidaten` offenbar `cursor` und `page_size` sowie `count_only`. Diese Funktionen sind sinnvoll, aber die lokale Skill-Logik verbietet ihre Nutzung. Dadurch kann der Agent unnötig auf freien SQL-Fallback ausweichen oder falsche Vollständigkeitshinweise geben.

**Empfehlungen:**

1. Für jedes Tool JSON Schema Draft 2020-12 mit `type`, `required`, Grenzen, Enums, Formaten und `additionalProperties: false` definieren.
2. Dieselbe Schema-Definition in Descriptor und Handler verwenden; keine doppelte manuelle Validierungslogik.
3. Jedes Resultat serverseitig gegen ein explizites `outputSchema` und eine Feld-Allowlist validieren.
4. Schema-Snapshots versionieren und bei CI-Drift fehlschlagen lassen.
5. Pagination klar definieren: opaker Cursor, stabile Sortierung, maximale `page_size`, Cursor-Bindung an Benutzer/Tenant/Filter, Ablauf und Manipulationsschutz.
6. `count_only` als eigenständiges Resultat ohne Kandidatenzeilen ausführen und testen.

### 5. Tool-Annotationen und Agent-Sicherheitsverhalten

**Befund: hoch.** Lokal steht, jedes Read-Tool solle `readOnlyHint: true`, `destructiveHint: false` und `openWorldHint: false` erhalten. Ohne Live-Descriptor-Snapshot ist das unbewiesen. OpenAI behandelt diese drei Felder für die Kennzeichnung als erforderlich und weist ausdrücklich darauf hin, dass sie nur das Host-/Bestätigungsverhalten beeinflussen, nicht die Serverautorisierung ([Plugin reference](https://developers.openai.com/plugins/reference#annotations)). MCP selbst warnt Clients, Annotationen nicht ungeprüft zu vertrauen ([MCP Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#tool-annotations)).

**Nuance:** Ein begrenzter privater CRM-Arbeitsbereich kann `openWorldHint: false` setzen, obwohl er extern gehostet ist. Ein SQL-Tool mit frei wählbaren Tabellen/Funktionen ist semantisch jedoch erheblich offener als ein enges Suchtool; die Annotation darf dessen Risiko nicht beschönigen.

**Empfehlung:** Descriptor-Snapshot für jedes Tool speichern und auf `title`, präzise `description`, Input-/Output-Schema und alle Annotationen prüfen. Das SQL-Tool entweder entfernen oder separat als hochprivilegiertes Admin-Werkzeug behandeln.

### 6. Freies SQL

**Befund: kritisch.** `crm_query` ist die größte einzelne Angriffsfläche. Lokal wird ein einzelnes `SELECT`, Relation-/Spalten-/Funktions-Allowlisting, Timeout, Row Cap, Tenant-Scope und read-only DB-Principal gefordert. Live beschreibt das Tool laut paralleler Prüfung eine bestehende RegExp-Prüfung, einen offenen SQL-Kommentarfehler und mehrere vom Handler akzeptierte `SELECT`-Statements.

Ein Präfix- oder Regex-Test auf `SELECT` ist keine belastbare SQL-Sicherheitsgrenze. Mehrfachstatements, Kommentare, CTEs, Unterabfragen, Funktionsaufrufe, Metadatenzugriff, zeitbasierte Funktionen, Union-basierte Datenexfiltration und Parser-Dialektabweichungen müssen berücksichtigt werden. OpenAI fordert Least Privilege, serverseitige Eingabevalidierung und Defense in Depth ([Security & Privacy](https://developers.openai.com/plugins/guides/security-privacy#principles)).

**Empfehlung:**

- bevorzugt `crm_query` vollständig aus der produktiven Agent-Oberfläche entfernen und benötigte Fragen durch enge parametrisierte Tools abdecken;
- falls unvermeidbar: SQL in einen separaten, stark privilegierten Admin-Server verschieben; AST-Parser passend zum exakten DB-Dialekt verwenden; genau eine Query; ausschließlich erlaubte `SELECT`-Konstrukte; keinerlei Kommentare; harte Relation-/Spalten-/Funktions-Allowlist; verpflichtender serverseitig injizierter Tenant-Predicate; read-only Transaktion und DB-Principal; Statement Timeout; kleine Row-/Byte-Caps; keine DB-Fehlertexte; vollständige Auditierung ohne Query-Literale mit PII.

Vor Abschluss dieser Maßnahmen ist das SQL-Tool ein **Release-Blocker**.

### 7. Datenschutz und Datenminimierung

**Positiv:** Die lokalen Dateien `privacy.md`, `query-rules.md` und `tool-contracts.md` definieren gute Zielprinzipien: minimale Projektion, Aggregate statt Identifikatoren, keine Kontakt-/Dokument-/Notizdaten standardmäßig, kein Shadow Store, serverseitige Filterung vor Ausgabe und klare verbotene Kategorien.

**Befund: kritisch.** Live bleiben laut paralleler Prüfung `eu_buerger`, Staatsbürgerschaft, Vollprofile und Geburtsdatum/Alter exponiert. Damit ist die lokale Policy nicht die tatsächliche Datenoberfläche. Ein Skill kann unerwünschte Felder in der finalen Antwort weglassen, aber die Daten wurden dann bereits vom Server an Modell/Host übertragen. OpenAI fordert, in `structuredContent` nur benötigte Daten zu liefern, Secrets auszuschließen, PII in Logs zu redigieren und eine Retention Policy zu veröffentlichen ([Security & Privacy](https://developers.openai.com/plugins/guides/security-privacy#data-handling)).

**Empfehlungen:**

1. Verbotene Felder aus **Tool-Schemas, SQL-Allowlist, Resultset und Logs** entfernen, nicht nur aus Prompttext.
2. Vollprofile durch zweckgebundene Projektionen ersetzen (`candidate_summary`, separat autorisierte Kontaktdaten etc.).
3. Geburtsdatum nie zurückgeben, wenn nur eine autorisierte Altersbandprüfung nötig ist; besser serverseitig boolesches/aggregiertes Resultat.
4. Personenbezogene Daten in `structuredContent` minimieren; `_meta` ist kein genereller Geheimnisspeicher und hebt Datenschutzpflichten nicht auf.
5. Aufbewahrung, Löschung, Rechtsgrundlage, Zugriffszweck, Audit-Log-Retention und Incident-Prozess dokumentieren.
6. Vor Produktionsstart DPIA/Datenschutzprüfung für Kandidatensuche und besonders jede künftige biometrische Funktion abschließen.

### 8. Tool-Ergebnisse und Fehlerbehandlung

**Lücke:** Lokale Verträge fordern `structuredContent`, stabile IDs und sichere Fehler, doch keine Live-Resultate oder Output-Schemas liegen vor. MCP unterscheidet Protokollfehler von Tool-Ausführungsfehlern; fachliche Toolfehler sollen als Tool-Ergebnis mit `isError: true` zurückkommen, damit das Modell sie verarbeiten kann ([MCP Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#error-handling)).

**Risiken:** Rohes SQL, Stacktraces, Tabellennamen, Token-/Scope-Details oder Kandidatendaten in Fehlermeldungen; unklare leere Ergebnisse; abgeschnittene Listen ohne Vollständigkeitsmarker; Wiederholungsstürme bei `429`/Timeouts.

**Empfehlungen:**

- stabile, maschinenlesbare Fehlercodes plus kurze sichere Meldung;
- korrekte HTTP-/OAuth-Challenges für Authfehler und `isError` für fachliche/Toolfehler;
- `complete`, `next_cursor`, `applied_filters`, `result_count`, `total_count` nur mit eindeutig definierter Semantik;
- keine internen SQL-/Stackdetails;
- Korrelation-ID ohne PII; Retry-Hinweis nur bei tatsächlich transienten Fehlern;
- Tests für leer, teilweise, gecappt, Timeout, `429`, Authfehler und Upstream-Ausfall.

### 9. Tests und Evaluationen

**Positiv:** Die 39 Eval-Fälle decken direkte/indirekte Aktivierung, Archiv-/NULL-Semantik, Distinct Count, same-row joins, SQL Injection, Writes, Mehrfachstatements, verbotene Felder, Auth, Tenant-Isolation, Timeout und Prompt Injection ab.

**Befund: hoch.** Es sind Spezifikationen, keine Tests. `execution.status` ist ausdrücklich `not_executed`. Viele Fälle haben nur natürlichsprachige Erwartungen, keine Fixtures, exakten Tool-Aufrufe, Assertions oder gespeicherte Resultate. Der lokale Validator prüft hauptsächlich Dateikonsistenz und das Vorhandensein von Feldern; er kann einen vollständig unsicheren Live-Server trotzdem mit `PASS` melden. OpenAI empfiehlt MCP Inspector mit repräsentativen, ungültigen, fehlenden und leeren Eingaben, Prüfung von Authfehlern, Annotationen und modelllesbaren Resultaten sowie erneute Evals bei Metadatenänderungen ([Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt#inspect-the-mcp-server)).

**Empfehlungen:**

1. Evals in ausführbare Contract-/Integrationstests überführen.
2. Einen isolierten synthetischen Test-Tenant und deterministische Fixtures bereitstellen.
3. Descriptor-/Schema-Snapshots und Golden Results versionieren.
4. Jede lokale Policy-Invariante durch mindestens einen positiven und einen negativen Live-Test abdecken.
5. Property-/Fuzz-Tests für unbekannte Keys, Typgrenzen, Unicode, SQL-Kommentare, Mehrfachstatements, tiefe Verschachtelung, Cursor-Manipulation und große Payloads.
6. Autorisierungsmatrix über Nutzer × Tenant × Rolle × Scope × Tool automatisieren.
7. Testresultate mit Commit-SHA, Worker-Deployment-ID, Protokollversion und Zeitstempel speichern.

### 10. Deployment und Operational Readiness

**Befund: hoch.** Im Repo fehlen Worker-Konfiguration, IaC, CI/CD, Staging, Secret-Rotation, Health-/Readiness-Checks, SLOs, Dashboards, Alerts, Runbooks und Rollback. OpenAI fordert für Produktion unter anderem passende Latenz/Verfügbarkeit, Logs und Metriken für fehlgeschlagene Initialisierung/Tool Calls, Secret Management, Timeouts, Rate Limits und Rollback/Versionierung ([Build an MCP server](https://developers.openai.com/plugins/build/mcp-server#deploy-the-endpoint)).

**Empfehlungen:**

- getrennte dev/staging/prod Worker und Datenzugänge;
- secrets ausschließlich im Cloudflare Secret Store, Rotation und Revocation getestet;
- per-subject/per-tenant/per-tool Rate Limits und Kosten-/Zeilenbudgets;
- strukturierte Telemetrie: Latenz, Fehlercode, Tool, Deployment-Version, Rows/Bytes, ohne Querytext/PII;
- Alarmierung für Auth-Fehlerwellen, verbotene-Feld-Detektion, ungewöhnliche SQL-/Exportmuster und hohe Fehlerraten;
- canary deployment, schneller Rollback und rückwärtskompatible Tool-Schemas;
- Datenschutz- und Incident-Runbooks.

### 11. Produkt- und Agent-UX

**Positiv:** Der Skill grenzt CRM-Aufgaben von allgemeiner HR-Beratung ab, bevorzugt kleine Resultate, benennt unimplementierte Fähigkeiten und behandelt CRM-Notizen als untrusted data.

**Probleme:**

- Die humoristischen Trigger und der feste Erfolgssatz können in einem professionellen Kandidatendaten-Kontext missverständlich wirken und Fehler-/Teilergebnisse überdecken.
- Lokale Toolannahmen sind bereits gegenüber dem Live-Schema veraltet.
- Die breite Anzahl an CRM-Tools plus freies SQL erhöht Fehlselektion und unnötigen Datenzugriff.
- „Read-only“ kann Nutzer in falscher Sicherheit wiegen: Lesen personenbezogener Daten, Profilabruf und externe Modellverarbeitung sind weiterhin risikoreich.

OpenAI empfiehlt pro klarer Nutzeraktion ein fokussiertes Tool und behandelt Namen, Beschreibungen, Schemas und Annotationen als Teil der Sicherheitsoberfläche ([Build an MCP server](https://developers.openai.com/plugins/build/mcp-server#define-tools-from-user-goals)). Remote MCP-Server sind ausdrücklich als vertrauensrelevant zu behandeln, weil ein bösartiger Server Kontextdaten exfiltrieren kann ([Remote MCP servers](https://platform.openai.com/docs/guides/tools-connectors-mcp#risks-and-safety)).

**Empfehlungen:**

- fokussierte Tools für Count, Search, Profile-Summary, Companies und Assignments; SQL entfernen;
- klare Resultat-/Vollständigkeitsanzeige und sichtbar angewendete Filter;
- Account/Tenant im UI kenntlich machen, idealerweise über ein authentifiziertes read-only Profile-Tool (`_meta["openai/profile"]`) gemäß [OpenAI MCP-Server-Anleitung](https://developers.openai.com/plugins/build/mcp-server#authenticate-and-authorize-requests);
- humoristische Trigger optional machen und nie als Sicherheits-/Bestätigungssignal verwenden;
- verständliche Ablehnung mit sicherer Alternative, z. B. Wohn-/Arbeitsort statt Staatsbürgerschaft, aber keine stille Substitution.

## Priorisierte Maßnahmen

### P0 — vor jedem weiteren Zugriff auf reale Kandidatendaten

1. `crm_query` deaktivieren oder aus der Endnutzeroberfläche entfernen.
2. `eu_buerger`, Staatsbürgerschaft/Nationalität und sonstige verbotene Felder serverseitig aus Schema, Query-Allowlist, Output und Logs entfernen.
3. Individuelle Identität, Tenant und Rolle pro Anfrage serverseitig erzwingen; gemeinsame Anmeldung für reale Daten beenden.
4. Unbekannte Input-Keys strikt abweisen; alle Tools mit einer einzigen Runtime-Schemaquelle validieren.
5. Vollprofile durch minimal projizierte Resultate ersetzen.
6. Einen sanitisierten Live-Descriptor- und Negativtestbericht erzeugen.

### P1 — vor Beta-Freigabe

1. OAuth 2.1/MCP Authorization einschließlich Discovery, PKCE, Audience/`resource`, Scopes und Revocation implementieren.
2. Tool-Schemas, Annotationen, Output-Schemas und Error Contract vervollständigen.
3. Die 39 Evals ausführbar machen und gegen einen synthetischen Test-Tenant laufen lassen.
4. Lokalen Guide, Skill und Live-Guide aus einer versionierten Quelle generieren; Drift in CI blockieren.
5. Pagination/Count-Semantik korrekt dokumentieren und testen.
6. Rate Limits, Timeouts, Telemetrie, Alerting und Rollback etablieren.

### P2 — vor Produktionsfreigabe

1. Externe Security- und Datenschutzprüfung einschließlich Threat Model/DPIA.
2. SLOs, Last-/Soak-Tests, Chaos-/Upstream-Ausfalltests und Incident-Runbooks.
3. Retention-/Deletion-Policy und Audit-Governance.
4. ChatGPT/Codex End-to-End-Evals für Toolauswahl, Bestätigung, Auth-Recovery und Prompt Injection.
5. Release-Provenienz: Plugin-Version → Tool-Schema-Version → Worker-Commit → Deployment-ID → Testreport.

## Minimale Freigabekriterien

Eine Beta sollte erst freigegeben werden, wenn alle folgenden Aussagen mit Artefakten belegt sind:

- MCP Inspector initialisiert den Produktionskandidaten erfolgreich und listet exakt die freigegebenen Tools.
- Alle Deskriptoren besitzen strikte Input-Schemas, passende Output-Schemas und korrekte Annotationen.
- Unbekannte Keys, Writes, Kommentare/Mehrfachstatements, verbotene Felder und Tenant-Wechsel werden serverseitig abgewiesen.
- Ein Token ist an Nutzer, Tenant, Audience, Scope und Ablauf gebunden; negative Authfälle sind automatisiert grün.
- Kein Tool liefert mehr Felder als verlangt; Vollprofile und verbotene Attribute sind nicht erreichbar.
- Alle 39 bestehenden Evals plus Transport-/OAuth-/Schema-/Cursor-Fälle sind ausgeführt und versioniert.
- Logs/Metriken enthalten keine Tokens, Prompts, SQL-Literale oder unnötige Kandidatendaten.
- Deployment, Secret Rotation, Monitoring, Alerting und Rollback sind getestet.

## Ausgeführte lokale Prüfungen

```text
python scripts/validate_package.py candidate-search
PASS: 5 JSON files, manifest/connection consistency, local references,
guide invariants, 39 evaluation definitions, and common credential/contact patterns.
Not checked: full plugin schema, live handler security, MCP Inspector,
or behavioral execution.

python ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  candidate-search/skills/crm-kandidatensuche
Skill is valid!
```

Der im README genannte Plugin-Validator war nicht verfügbar:

```text
~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py: No such file or directory
```

Außerdem wurden die JSON-Dateien syntaktisch mit `python -m json.tool` geprüft. Diese lokalen Erfolge sind keine Aussage über den Worker.

## Schlussfolgerung

Das Paket ist eine brauchbare Policy- und Eval-Grundlage, aber kein Nachweis eines sicheren oder protokollkonformen MCP-Servers. Das größte Problem ist nicht ein einzelner kleiner Bug, sondern die fehlende gemeinsame Wahrheit zwischen Repository, Live-Guide, Live-Schema, Auth-Modell und tatsächlicher Handler-Implementierung. Solange die P0-Punkte offen sind, sollte der Endpunkt nicht mit realen Kandidatendaten für allgemeine ChatGPT-/Codex-Nutzung freigegeben werden.
