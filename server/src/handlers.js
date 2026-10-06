import {
  buildCandidateSearch,
  buildCrmQuery,
  buildBerufReport,
  buildCompanySearch,
  buildDescribeTable,
  buildListTables,
  buildOrderSearch,
  buildProfile,
} from "./sql.js";

function fullCount(rows) {
  const value = rows[0] && rows[0].total_count;
  const total = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error("Gesamtzahl konnte nicht bestimmt werden.");
  }
  return total;
}

export async function runCandidateSearch(db, args = {}) {
  const plan = buildCandidateSearch(args);
  const total = fullCount(await db.query(plan.countSql, plan.countParams));
  if (args.count_only) {
    return {
      count: total,
      total_count: total,
      returned_count: 0,
      has_more: false,
      next_cursor: null,
      rows: [],
    };
  }
  const fetched = await db.query(plan.rowSql, plan.rowParams);
  const hasMore = fetched.length > plan.pageSize;
  const rows = fetched.slice(0, plan.pageSize);
  return {
    count: total,
    total_count: total,
    returned_count: rows.length,
    has_more: hasMore,
    next_cursor: hasMore ? String(rows.at(-1).kandidat_id) : null,
    page_size: plan.pageSize,
    rows,
  };
}

export async function runCrmQuery(db, args = {}) {
  const plan = buildCrmQuery(args.sql);
  const rows = await db.query(plan.sql, plan.params);
  if (plan.mode === "count") {
    return { mode: "count", complete: true, has_more: false, returned_count: rows.length, rows };
  }
  const hasMore = rows.length > 50;
  const page = rows.slice(0, 50);
  return {
    mode: "page",
    complete: false,
    has_more: hasMore,
    page_size: 50,
    returned_count: page.length,
    rows: page,
  };
}

async function runPaged(db, plan) {
  const total = fullCount(await db.query(plan.countSql, plan.countParams));
  const fetched = await db.query(plan.rowSql, plan.rowParams);
  const hasMore = fetched.length > plan.pageSize;
  const rows = fetched.slice(0, plan.pageSize);
  return { total_count: total, returned_count: rows.length, has_more: hasMore, page_size: plan.pageSize, rows };
}

export async function callTool(db, name, args = {}) {
  if (name === "crm_search_kandidaten") return runCandidateSearch(db, args);
  if (name === "crm_query") return runCrmQuery(db, args);
  if (name === "crm_search_companies") return runPaged(db, buildCompanySearch(args));
  if (name === "crm_search_nalozi") return runPaged(db, buildOrderSearch(args));
  if (name === "crm_list_tables") {
    const plan = buildListTables(args.search);
    const rows = await db.query(plan.sql, plan.params);
    return { count: rows.length, rows };
  }
  if (name === "crm_describe_table") {
    const plan = buildDescribeTable(args.table);
    const rows = await db.query(plan.sql, plan.params);
    return { table: args.table, count: rows.length, rows };
  }
  if (name === "crm_kandidat_profile") {
    const plan = buildProfile(args.kandidat_id);
    const base = await db.query(plan.baseSql, plan.baseParams);
    if (!base.length) return { error: "not_found", kandidat_id: args.kandidat_id };
    const [sprachen, berufserfahrung, edukacija] = await Promise.all([
      db.query(plan.languageSql, plan.params),
      db.query(plan.experienceSql, plan.params),
      db.query(plan.educationSql, plan.params),
    ]);
    return { kandidat: base[0], sprachen, berufserfahrung, edukacija };
  }
  if (name === "crm_beruf_report") {
    const plan = buildBerufReport(args);
    const counted = await db.query(plan.countSql, plan.countParams);
    const positionen = await db.query(plan.positionSql, plan.positionParams);
    const sprache = plan.languageSql ? await db.query(plan.languageSql, plan.languageParams) : null;
    return { distinct_candidates: Number(counted[0] && counted[0].n), positionen, sprache };
  }
  if (name === "crm_stats") {
    const rows = await db.query(
      "SELECT (SELECT COUNT(*) FROM idk_kandidati) AS kandidaten, (SELECT COUNT(*) FROM idk_kandidati WHERE kandidat_status <> 3) AS aktiv, (SELECT COUNT(*) FROM idk_companies) AS firmen, (SELECT COUNT(*) FROM idk_nalozi) AS auftraege",
      [],
    );
    return rows[0];
  }
  throw new Error("Werkzeug ist in Phase 1 nicht vorhanden.");
}
