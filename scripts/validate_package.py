"""Check local package consistency; does not validate or contact the MCP server."""

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate(package):
    errors = []

    def require(condition, message):
        if not condition:
            errors.append(message)

    files = list(package.rglob("*.json"))
    parsed = {path.relative_to(package).as_posix(): load_json(path) for path in files}
    portable = parsed["plugin.json"]
    codex = parsed[".codex-plugin/plugin.json"]
    for field in ("name", "version", "description", "author"):
        require(portable[field] == codex[field], f"Manifest mismatch: {field}")
    require(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", portable["name"])), "Invalid plugin name")
    require(bool(re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?", portable["version"])), "Invalid package version")
    require(codex["interface"]["capabilities"] == ["Read"], "Unexpected advertised capability")
    for field in ("skills", "mcpServers"):
        target = (package / codex[field]).resolve()
        require(target.is_relative_to(package.resolve()) and target.exists(), f"Invalid manifest path: {field}")

    connection = parsed[".mcp.json"]["mcpServers"]
    require(set(connection) == {"pipedrive-crm"}, "Unexpected MCP server")
    crm = connection["pipedrive-crm"]
    require(set(crm) == {"type", "url", "bearer_token_env_var"}, "Unexpected MCP configuration keys")
    endpoint = urlsplit(crm["url"])
    require(endpoint.scheme == "https" and bool(endpoint.hostname) and endpoint.path == "/mcp", "Invalid HTTPS MCP endpoint")
    require(not endpoint.username and not endpoint.password and not endpoint.query and not endpoint.fragment, "MCP URL must not contain credentials or query parameters")
    require(crm["type"] == "http" and crm["bearer_token_env_var"] == "CRM_CANDIDATE_MCP_TOKEN", "Invalid beta authentication configuration")

    skill = package / "skills/crm-kandidatensuche"
    metadata = (skill / "agents/openai.yaml").read_text(encoding="utf-8")
    urls = re.findall(r'^\s+url: "([^"\n]+)"$', metadata, re.MULTILINE)
    require(urls == [crm["url"]], "Skill dependency URL differs from MCP connection")
    require('value: "pipedrive-crm"' in metadata, "Missing matching skill dependency")
    require("$crm-kandidatensuche" in metadata, "Default prompt must name the skill")
    for path in skill.rglob("*.md"):
        for link in re.findall(r"\[[^\]]+\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            if "://" not in link and not link.startswith("#"):
                target = (path.parent / link.split("#", 1)[0]).resolve()
                require(target.is_relative_to(package.resolve()) and target.exists(), f"Broken local reference in {path.name}")

    guide = parsed["mcp/crm_search_guide.json"]
    require(guide["deployment_status"] == "prepared_not_deployed", "Guide must not claim an unverified deployment")
    guide_md = (package / "mcp/crm_search_guide.md").read_text(encoding="utf-8")
    require(f'Version: {guide["version"]}.' in guide_md, "Guide version mismatch")
    require(guide["archive"]["archived_status"] == 3 and guide["archive"]["default"] == "exclude", "Archive default mismatch")
    require(guide["counting"]["unit"] == "distinct_candidates", "Count unit mismatch")
    require(guide["languages"]["minimum_level_dimension"] == "kj_slusanje", "Language dimension mismatch")
    require(guide["privacy"]["prohibited_filters"] == ["eu_buerger", "kandidat_drzavljanstvo_vrsta"], "Prohibited-filter contract mismatch")
    require(guide["limits"]["search_and_query_rows"] == 200 and guide["limits"]["report_top_positions"] == 50, "Declared tool caps mismatch")

    evals = parsed["tests/evals.json"]
    require(evals["version"] == portable["version"], "Evaluation/package version mismatch")
    require(evals["execution"]["fixture_policy"] == "synthetic_only", "Evaluations must be synthetic")
    require(evals["execution"]["status"] == "not_executed", "Do not claim behavioral execution from a structural check")
    ids = [case["id"] for case in evals["cases"]]
    require(len(ids) == len(set(ids)), "Duplicate evaluation IDs")
    for case in evals["cases"]:
        require(case["layer"] in {"skill", "server"}, f'Invalid evaluation layer: {case["id"]}')
        require(bool(case["prompt"]) and bool(case["expected"]), f'Incomplete evaluation: {case["id"]}')

    # Detect common credential/PII forms without printing matched contents.
    patterns = [r"\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}", r"\bBearer\s+[A-Za-z0-9_.-]{20,}", r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", r"[A-Za-z0-9_.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"]
    for path in package.rglob("*"):
        if path.is_file() and path.suffix in {".md", ".json", ".yaml"}:
            content = path.read_text(encoding="utf-8")
            require(not any(re.search(pattern, content) for pattern in patterns), f"Possible credential or contact data in {path.relative_to(package)}")

    if errors:
        print("\n".join(f"FAIL: {error}" for error in errors))
        return False
    print(f"PASS: {len(files)} JSON files, manifest/connection consistency, local references, guide invariants, {len(ids)} evaluation definitions, and common credential/contact patterns.")
    print("Not checked: full plugin schema, live handler security, MCP Inspector, or behavioral execution.")
    return True


if __name__ == "__main__":
    package = Path(sys.argv[1] if len(sys.argv) > 1 else "candidate-search")
    try:
        sys.exit(0 if validate(package) else 1)
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"FAIL: invalid or incomplete package ({type(error).__name__})")
        sys.exit(1)
