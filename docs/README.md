# Cloud CRM MCP documentation index

Status date: 5 October 2026

This directory is the current documentation entry point for the Cloud CRM MCP project in folder MCP Plugin 2. It is separate from the older Linear project Candidate Search. The installable package is still named candidate-search. The Linear title Lena was rejected on 5 October 2026. The names to use are in project.md. The handover is memory.md.

| Topic | Canonical current source | Status |
| --- | --- | --- |
| Project, scope, boundaries | [project.md](project.md) | Current |
| Product and UI specification | [../server/SPEC.md](../server/SPEC.md) | Approved planning scope; not implemented |
| Architecture and repository map | [project.md](project.md) | Current |
| Setup and checks | [setup.md](setup.md) | Current; live Inspector authorization blocked |
| Work and decisions | [open-work.md](open-work.md) and the Linear tracker at https://linear.app/activi/project/lena-1333951b31fb | Linear is authoritative for status; its title is not the product name |
| Transition handover | [memory.md](memory.md) | Current decision for the next session |
| Documentation policy | [documentation-policy.md](documentation-policy.md) | Current |
| Documentation coverage | [coverage.json](coverage.json) | Machine-readable current-state evidence |
| Change evidence | [changes.md](changes.md) | Current |
| External sources | [sources.md](sources.md) | Current |
| Worker current-state assessment | [cloudflare-current-state-assessment.md](cloudflare-current-state-assessment.md) | Historical audit; findings remain evidence |
| Downloaded Worker audit | [cloudflare-worker-source-audit.md](cloudflare-worker-source-audit.md) | Historical audit; remediation tracked under ACT-143, ACT-142, ACT-144, and ACT-154 |
| MCP primary-source audit | [mcp-server-primary-source-audit.md](mcp-server-primary-source-audit.md) | Historical audit; later Worker audit has precedence |
| Earlier implementation plan | [CRM-Kandidatensuche-Projektstatus-und-Implementierungsplan.md](CRM-Kandidatensuche-Projektstatus-und-Implementierungsplan.md) | Superseded historical plan |
| DOCX export | `CRM-Kandidatensuche-Projektstatus-und-Implementierungsplan.docx` | Historical export; historical export; not regenerated for this transition |

## Reading order

1. Read [project.md](project.md) for the current facts and boundaries.
2. Read [../server/SPEC.md](../server/SPEC.md) for the approved product scope.
3. Read [open-work.md](open-work.md) before implementation.
4. Read the relevant audit before modifying Worker, authentication, SQL, or PII paths.
5. Follow [setup.md](setup.md) and record new evidence in [changes.md](changes.md).

No roadmap entry is evidence of implementation. No historical audit is a
deployment authorization.
