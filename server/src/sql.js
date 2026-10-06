const PAGE_SIZE = 50;

function pageSize(value) {
  if (value === undefined) return PAGE_SIZE;
  if (!Number.isSafeInteger(value) || value < 1 || value > PAGE_SIZE) {
    throw new Error("Seitengroesse ist 50. Eine groessere Seite ist nicht erlaubt.");
  }
  return value;
}

function whereSql(clauses) {
  return clauses.length ? "WHERE " + clauses.join(" AND ") : "";
}

export function buildCandidateSearch(args = {}) {
  if (args.limit !== undefined && args.page_size !== undefined) {
    throw new Error("Nur limit oder page_size angeben.");
  }
  const size = pageSize(args.page_size ?? args.limit);
  const clauses = [];
  const params = [];
  if (!args.archived) clauses.push("k.kandidat_status <> 3");
  if (args.name) {
    clauses.push("(k.kandidat_ime LIKE ? OR k.kandidat_prezime LIKE ?)");
    params.push("%" + args.name + "%", "%" + args.name + "%");
  }
  if (args.eu_buerger === true) {
    clauses.push("k.kandidat_drzavljanstvo_vrsta LIKE ?");
    params.push("EU%");
  } else if (args.eu_buerger === false) {
    clauses.push("(k.kandidat_drzavljanstvo_vrsta NOT LIKE ? OR k.kandidat_drzavljanstvo_vrsta IS NULL OR TRIM(k.kandidat_drzavljanstvo_vrsta) = '')");
    params.push("EU%");
  }
  if (args.alter_von !== undefined || args.alter_bis !== undefined) {
    const from = args.alter_von ?? 0;
    const to = args.alter_bis ?? 150;
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 0 || to > 150 || from > to) {
      throw new Error("Alter muss zwischen 0 und 150 liegen.");
    }
    clauses.push("k.kandidat_datumrodjenja IS NOT NULL");
    clauses.push("TIMESTAMPDIFF(YEAR, k.kandidat_datumrodjenja, CURRENT_DATE) BETWEEN ? AND ?");
    params.push(from, to);
  }
  if (args.position_text || args.berufsgruppe_id) {
    const term = args.position_text ?? args.berufsgruppe_id;
    clauses.push("EXISTS (SELECT 1 FROM idk_kandidat_radno_iskustvo w WHERE w.kri_kandidat_id = k.kandidat_id AND w.kri_pozicija LIKE ?)");
    params.push("%" + term + "%");
  }
  const countSql = "SELECT COUNT(DISTINCT k.kandidat_id) AS total_count FROM idk_kandidati k " + whereSql(clauses);
  const rowParams = params.slice();
  const rowClauses = clauses.slice();
  if (args.cursor !== undefined) {
    if (typeof args.cursor !== "string" || !/^[0-9]+$/.test(args.cursor)) {
      throw new Error("Ungueltiger Fortsetzungscursor.");
    }
    rowClauses.push("k.kandidat_id < ?");
    rowParams.push(args.cursor);
  }
  const rowSql = [
    "SELECT k.kandidat_id, k.kandidat_ime, k.kandidat_prezime, k.kandidat_status,",
    "k.kandidat_datumrodjenja,",
    "TIMESTAMPDIFF(YEAR, k.kandidat_datumrodjenja, CURRENT_DATE) AS alter_jahre",
    "FROM idk_kandidati k " + whereSql(rowClauses),
    "ORDER BY k.kandidat_id DESC",
    "LIMIT " + (size + 1),
  ].join(" ");
  return { countSql, countParams: params, rowSql, rowParams, pageSize: size };
}

function filteredRead(table, columns, orderColumn, args, filters) {
  const size = pageSize(args.page_size ?? args.limit);
  const clauses = [];
  const params = [];
  filters(clauses, params);
  return {
    countSql: "SELECT COUNT(*) AS total_count FROM " + table + " " + whereSql(clauses),
    countParams: params,
    rowSql: "SELECT " + columns + " FROM " + table + " " + whereSql(clauses) + " ORDER BY " + orderColumn + " DESC LIMIT " + (size + 1),
    rowParams: params,
    pageSize: size,
  };
}

export function buildCompanySearch(args = {}) {
  return filteredRead("idk_companies", "company_id, company_name, company_country, company_status", "company_id", args, (clauses, params) => {
    if (args.q) {
      clauses.push("company_name LIKE ?");
      params.push("%" + args.q + "%");
    }
    if (args.country) {
      clauses.push("company_country = ?");
      params.push(args.country);
    }
    if (args.status !== undefined) {
      clauses.push("company_status = ?");
      params.push(args.status);
    }
  });
}

export function buildOrderSearch(args = {}) {
  return filteredRead("idk_nalozi", "nalog_id, nalog_naslov, nalog_opis, nalog_status", "nalog_id", args, (clauses, params) => {
    if (args.q) {
      clauses.push("(nalog_naslov LIKE ? OR nalog_opis LIKE ?)");
      params.push("%" + args.q + "%", "%" + args.q + "%");
    }
    if (args.status !== undefined) {
      clauses.push("nalog_status = ?");
      params.push(args.status);
    }
  });
}

export function buildProfile(kandidatId) {
  if (!Number.isSafeInteger(kandidatId) || kandidatId < 1) {
    throw new Error("kandidat_id fehlt.");
  }
  return {
    baseSql: "SELECT k.kandidat_id, k.kandidat_ime, k.kandidat_prezime, k.kandidat_status, k.kandidat_datumrodjenja, g.kg_title AS gruppe, s.status_naziv AS status_label FROM idk_kandidati k LEFT JOIN idk_kandidati_grupe g ON g.kg_id = k.kandidat_group LEFT JOIN idk_kandidat_status s ON s.status_id = k.kandidat_status WHERE k.kandidat_id = ?",
    baseParams: [kandidatId],
    languageSql: "SELECT kj_naziv, kj_slusanje, kj_citanje, kj_pisanje FROM idk_kandidat_jezici WHERE kj_kandidatid = ?",
    experienceSql: "SELECT w.kri_pozicija, w.kri_darum_od, w.kri_datum_do FROM idk_kandidat_radno_iskustvo w WHERE w.kri_kandidat_id = ?",
    educationSql: "SELECT ke_naziv, ke_naziv_kvalifikacije FROM idk_kandidat_edukacija WHERE ke_kandidat_id = ?",
    params: [kandidatId],
  };
}

export function buildListTables(search) {
  const clauses = ["TABLE_SCHEMA = DATABASE()", "TABLE_NAME LIKE 'idk_%'"];
  const params = [];
  if (search) {
    clauses.push("TABLE_NAME LIKE ?");
    params.push("%" + search + "%");
  }
  return {
    sql: "SELECT TABLE_NAME AS table_name, TABLE_ROWS AS approx_rows FROM information_schema.TABLES WHERE " + clauses.join(" AND ") + " ORDER BY TABLE_NAME",
    params,
  };
}

const ALLOWED_TABLE = /^(?:idk_[A-Za-z0-9_]+|beruf_mapping)$/;

export function buildDescribeTable(table) {
  if (typeof table !== "string" || !ALLOWED_TABLE.test(table)) {
    throw new Error("Tabelle nicht erlaubt.");
  }
  return {
    sql: "SELECT COLUMN_NAME AS column_name, COLUMN_TYPE AS column_type, IS_NULLABLE AS nullable, COLUMN_KEY AS key_kind FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
    params: [table],
  };
}

const WRITE_WORD = /\b(insert|update|delete|drop|alter|create|replace|grant|revoke|call|load|into|outfile|dumpfile|union|intersect|except)\b/i;

export function buildCrmQuery(sql) {
  const text = String(sql ?? "").trim();
  if (text.includes(";")) throw new Error("Nur ein SELECT ist erlaubt.");
  if (text.includes("--") || text.includes("/*") || text.includes("#")) {
    throw new Error("Kommentare sind nicht erlaubt.");
  }
  if (!/^select\b/i.test(text)) throw new Error("Nur SELECT-Queries erlaubt.");
  if (WRITE_WORD.test(text)) throw new Error("Nur ein lesendes SELECT ist erlaubt.");
  if (/select\s+\*/i.test(text) || /select\s+[a-z_][a-z0-9_]*\.\*/i.test(text)) {
    throw new Error("SELECT * ist nicht erlaubt.");
  }
  const tables = [...text.matchAll(/\b(?:from|join)\s+([A-Za-z_][A-Za-z0-9_]*)/gi)].map((match) => match[1]);
  if (tables.length === 0 || tables.some((table) => !ALLOWED_TABLE.test(table))) {
    const blocked = tables.find((table) => !ALLOWED_TABLE.test(table)) ?? "unbekannt";
    throw new Error("Tabelle '" + blocked + "' ist nicht erlaubt.");
  }
  const limit = text.match(/\blimit\s+(\d+)\b/i);
  const aggregate = /^select\s+(?:count|sum|min|max|avg)\s*\(/i.test(text);
  if (aggregate) {
    if (limit) throw new Error("Eine Zaehlung bekommt kein Seitenlimit.");
    return { mode: "count", sql: text, params: [] };
  }
  if (limit && Number(limit[1]) > PAGE_SIZE) {
    throw new Error("Eine Liste hat hoechstens 50 Zeilen pro Seite.");
  }
  if (!limit) return { mode: "page", sql: text + " LIMIT 51", params: [] };
  return { mode: "page", sql: text, params: [] };
}

export function buildBerufReport(args = {}) {
  if (!Array.isArray(args.begriffe) || args.begriffe.length === 0) {
    throw new Error("Mindestens ein Suchbegriff ist noetig.");
  }
  const requested = args.top_positionen ?? 15;
  if (!Number.isSafeInteger(requested) || requested < 1) {
    throw new Error("Top-Positionen muessen eine positive ganze Zahl sein.");
  }
  const top = Math.min(requested, 50);
  const like = args.begriffe.map(() => "w.kri_pozicija LIKE ?").join(" OR ");
  const likeParams = args.begriffe.map((term) => "%" + term + "%");
  const archive = args.archived ? "" : " AND k.kandidat_status <> 3";
  const countSql = "SELECT COUNT(DISTINCT k.kandidat_id) AS n FROM idk_kandidati k WHERE EXISTS (SELECT 1 FROM idk_kandidat_radno_iskustvo w WHERE w.kri_kandidat_id = k.kandidat_id AND (" + like + "))" + archive;
  const positionSql = "SELECT w.kri_pozicija AS position, COUNT(DISTINCT w.kri_kandidat_id) AS kandidaten FROM idk_kandidat_radno_iskustvo w JOIN idk_kandidati k ON k.kandidat_id = w.kri_kandidat_id WHERE (" + like + ")" + archive + " GROUP BY w.kri_pozicija ORDER BY kandidaten DESC LIMIT " + top;
  const language = typeof args.sprache === "string" ? args.sprache.trim() : "";
  return {
    countSql,
    countParams: likeParams,
    positionSql,
    positionParams: likeParams,
    languageSql: language ? "SELECT TRIM(j.kj_naziv) AS sprache, j.kj_slusanje FROM idk_kandidat_jezici j WHERE TRIM(j.kj_naziv) = ?" : null,
    languageParams: language ? [language].concat(likeParams) : null,
  };
}
