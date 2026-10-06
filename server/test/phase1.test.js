import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBerufReport,
  buildCandidateSearch,
  buildCompanySearch,
  buildCrmQuery,
  buildDescribeTable,
  buildListTables,
  buildOrderSearch,
  buildProfile,
} from "../src/sql.js";
import { runCandidateSearch, runCrmQuery } from "../src/handlers.js";

test("candidate search returns the birth date and pages 50 rows", () => {
  const plan = buildCandidateSearch({});
  assert.match(plan.rowSql, /k\.kandidat_datumrodjenja/);
  assert.doesNotMatch(plan.rowSql, /kandidat_drzavljanstvo_vrsta/);
  assert.doesNotMatch(plan.rowSql, /SELECT \*/i);
  assert.match(plan.rowSql, /LIMIT 51/);
  assert.doesNotMatch(plan.countSql, /LIMIT/i);
  assert.match(plan.countSql, /COUNT\(DISTINCT k\.kandidat_id\)/);
  assert.match(plan.rowSql, /kandidat_status <> 3/);
});

test("a requested page above 50 is rejected", () => {
  assert.throws(() => buildCandidateSearch({ page_size: 2000 }), /50/);
});

test("non-EU search includes an empty citizenship field", () => {
  const plan = buildCandidateSearch({ eu_buerger: false });
  assert.match(plan.rowSql, /IS NULL/);
  assert.match(plan.rowSql, /TRIM\(k\.kandidat_drzavljanstvo_vrsta\) = ''/);
  assert.equal(plan.rowParams.filter((value) => value === "EU%").length, 1);
});

test("EU search matches only the EU prefix", () => {
  const plan = buildCandidateSearch({ eu_buerger: true });
  assert.match(plan.rowSql, /LIKE \?/);
  assert.equal(plan.rowParams.includes("EU%"), true);
  assert.doesNotMatch(plan.rowSql, /IS NULL/);
});

test("one-sided age bounds stay 0 and 150 and ignore an empty birth date", () => {
  const plan = buildCandidateSearch({ alter_von: 18 });
  assert.match(plan.rowSql, /kandidat_datumrodjenja IS NOT NULL/);
  assert.match(plan.rowSql, /TIMESTAMPDIFF\(YEAR, k\.kandidat_datumrodjenja, CURRENT_DATE\) BETWEEN \? AND \?/);
  assert.deepEqual(plan.rowParams.slice(-2), [18, 150]);
});

test("count_only returns the full count and does not read a page", async () => {
  const calls = [];
  const result = await runCandidateSearch({
    async query(sql, params) {
      calls.push({ sql, params });
      return [{ total_count: 100000 }];
    },
  }, { count_only: true, eu_buerger: false });
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /COUNT\(DISTINCT/);
  assert.equal(result.total_count, 100000);
  assert.equal(result.returned_count, 0);
  assert.equal(result.rows.length, 0);
});

test("a candidate page reports more rows without ending the result at 50", async () => {
  const rows = Array.from({ length: 51 }, (_, index) => ({
    kandidat_id: 1000 - index,
    kandidat_ime: "A",
    kandidat_prezime: "B",
    kandidat_status: 1,
    kandidat_datumrodjenja: "1980-01-01",
    alter_jahre: 46,
  }));
  const result = await runCandidateSearch({
    async query(sql) {
      if (sql.includes("COUNT(DISTINCT")) return [{ total_count: 100000 }];
      return rows;
    },
  }, {});
  assert.equal(result.total_count, 100000);
  assert.equal(result.returned_count, 50);
  assert.equal(result.has_more, true);
  assert.equal(result.next_cursor, "951");
  assert.equal(result.rows[0].kandidat_datumrodjenja, "1980-01-01");
});

test("free SQL count is not capped and a list is only a page of 50", () => {
  const count = buildCrmQuery("SELECT COUNT(*) AS n FROM idk_kandidati");
  assert.equal(count.mode, "count");
  assert.doesNotMatch(count.sql, /LIMIT/i);
  const list = buildCrmQuery("SELECT kandidat_id FROM idk_kandidati");
  assert.equal(list.mode, "page");
  assert.match(list.sql, /LIMIT 51$/);
  assert.doesNotMatch(list.sql, /LIMIT 200/);
});

test("free SQL rejects writes, star selects, other tables, and a limit above 50", () => {
  assert.throws(() => buildCrmQuery("INSERT INTO idk_kandidati VALUES (1)"), /SELECT/);
  assert.throws(() => buildCrmQuery("SELECT * FROM idk_kandidati"), /SELECT \*/);
  assert.throws(() => buildCrmQuery("SELECT id FROM secret_table"), /nicht erlaubt/);
  assert.throws(() => buildCrmQuery("SELECT kandidat_id FROM idk_kandidati LIMIT 2000"), /50/);
  assert.throws(() => buildCrmQuery("SELECT kandidat_id FROM idk_kandidati; SELECT kandidat_id FROM idk_kandidati"), /ein/);
});

test("crm query pages the rows and leaves a count complete", async () => {
  const listed = await runCrmQuery({
    async query() {
      return Array.from({ length: 51 }, (_, index) => ({ kandidat_id: index + 1 }));
    },
  }, { sql: "SELECT kandidat_id FROM idk_kandidati" });
  assert.equal(listed.returned_count, 50);
  assert.equal(listed.has_more, true);
  assert.equal(listed.complete, false);
  const counted = await runCrmQuery({
    async query(sql) {
      assert.doesNotMatch(sql, /LIMIT/i);
      return [{ n: 100000 }];
    },
  }, { sql: "SELECT COUNT(*) AS n FROM idk_kandidati" });
  assert.equal(counted.complete, true);
  assert.equal(counted.rows[0].n, 100000);
});

test("company and order reads are explicit and paged at 50", () => {
  const companies = buildCompanySearch({});
  const orders = buildOrderSearch({});
  assert.match(companies.rowSql, /company_id, company_name, company_country, company_status/);
  assert.match(orders.rowSql, /nalog_id, nalog_naslov, nalog_opis, nalog_status/);
  assert.doesNotMatch(orders.rowSql, /SELECT \*/i);
  assert.match(companies.rowSql, /LIMIT 51/);
  assert.doesNotMatch(companies.countSql, /LIMIT/i);
});

test("profile and schema tools do not use a star select", () => {
  const profile = buildProfile(15);
  assert.match(profile.baseSql, /k\.kandidat_id, k\.kandidat_ime, k\.kandidat_prezime/);
  assert.doesNotMatch(profile.baseSql, /SELECT k\.\*/);
  assert.doesNotMatch(profile.baseSql, /kandidat_drzavljanstvo_vrsta/);
  const listed = buildListTables("kandidat");
  assert.match(listed.sql, /TABLE_NAME LIKE 'idk_%'/);
  assert.deepEqual(listed.params, ["%kandidat%"]);
  const described = buildDescribeTable("idk_kandidati");
  assert.deepEqual(described.params, ["idk_kandidati"]);
  assert.throws(() => buildDescribeTable("secret_table"), /nicht erlaubt/);
});

test("profession report has no silent German default", () => {
  const unnamed = buildBerufReport({ begriffe: ["elektricar"] });
  assert.equal(unnamed.languageSql, null);
  assert.match(unnamed.positionSql, /LIMIT 15/);
  const named = buildBerufReport({ begriffe: ["elektricar"], sprache: "Bosanski", top_positionen: 80 });
  assert.match(named.languageSql, /kj_naziv/);
  assert.equal(named.languageParams[0], "Bosanski");
  assert.match(named.positionSql, /LIMIT 50/);
});
