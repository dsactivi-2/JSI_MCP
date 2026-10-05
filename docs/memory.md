# Cloud CRM MCP handover

Status date: 5 October 2026

This is the handover for the next session. Do not continue the three earlier chats. Their handovers were not delivered to this session.

## Names

- Repository folder: MCP Plugin 2.
- Installable package: candidate-search, version 0.1.0-beta.2. Do not rename it during this transition.
- Product description: Cloud CRM MCP.
- Linear tracker: https://linear.app/activi/project/lena-1333951b31fb.
- The title Lena was requested and later rejected on 5 October 2026. No replacement name was given. Do not invent one, and do not use Lena as the product or repository name.
- Do not move this work into the older Candidate Search Linear project.

## Decision

Build a new read-only server beside the live Worker. Connect that new server to the existing MySQL database. Finish the first read-only version, then switch only when the user asks. Do not repair, redeploy, or otherwise modify the current Worker.

The first version reads candidates, companies, orders, and statistics. Exports, writes, ranking, photos, and biometrics stay out.

## Testing decision

On 5 October 2026 the user rejected acceptance that uses only the MCP Inspector, the 39 plugin evaluation cases, and synthetic data.

- The new server is connected to the existing MySQL database and is tested with real quotas and real read queries. The spoken wording was "echte Quoten" and "echte Abfragen". It was not redefined.
- The live Worker stays connected in parallel until the user asks for the replacement.
- Committed fixtures, skill files, and screenshots still must not contain real personal data.
- "Unicode Player" is not a product, component, or requirement. The phrase came from a speech-to-text error and is ignored.

This session did not run a real CRM query and did not create a Linear issue.

## Coordination

On 5 October 2026 the user stopped the three other agents. No orchestrator is set up, and none should be set up before this handover has been checked against the live stack. Linear remains the issue tracker. It does not stop a second chat from editing the same files.

The first build stays in one session. That session writes the new read-only server, starting at ACT-141 and carrying ACT-142 and ACT-144 before broader modules. Separate worktrees are for the later UI modules, ACT-145 through ACT-149, not for the first server.

This session did not receive the three handovers, did not merge them, and did not verify the live stack.

## Confirmed state

- The live endpoint remains https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp and must not be modified yet.
- worker-source/ is a downloaded production bundle: wrangler.jsonc and one index.js of about 3.8 MB, without original TypeScript, tests, or a lockfile. It is not the base for the new server. That provenance gap is ACT-143 and does not block the new build.
- server/ contains the Inspector workspace and server/SPEC.md. It does not yet contain the new server implementation.
- The tracker is a complete Linear project in the Activi team, not a project inside this repository. A local Linear cache record from 5 October 2026 names it Lena, slug lena-1333951b31fb, team ACT. The issue list was last read earlier that day as ACT-140 through ACT-154, all in Backlog. This later check did not reconfirm comments or status through the Linear API. Do not add another umbrella issue.
- Codex crm-remote reads CRM_REMOTE_MCP_TOKEN. The plugin and Inspector script read CRM_CANDIDATE_MCP_TOKEN. Both are set on this machine and the values differ. This session did not repeat a live initialize call.
- An earlier chat reported the connected server as crm-mysql 1.1.0 with 11 tools. That report was not rechecked here.
- The three stopped agents did not hand over their work here. Nothing they may have changed was merged or checked against the live endpoint.

## Next session

1. Read this file, docs/project.md, docs/open-work.md, and server/SPEC.md.
2. Build the new read-only server beside the live Worker, connected to the existing MySQL database. Start with ACT-141.
3. Test that server with real quotas and real read queries. Do not treat synthetic Inspector cases as the only acceptance.
4. Leave the live Worker in place until the new one works and the user asks for the replacement.
5. Ask for the replacement project name before renaming the Linear title.
6. Do not start an orchestrator, a second writer on the new server, or a team-and-tools study until the user brings the missing handovers or explicitly replaces this order.

## What was checked

- Linear, earlier on 5 October 2026: 15 issues, newest update then ACT-144 at 04:05 UTC. No new issue was created. A later check could not reconfirm this live.
- The three project chats were read. The proposed synthetic-only acceptance seam was rejected by the user.
- No real CRM query was run in this session.
- A live initialize from this session did not complete because the Worker host did not resolve here.
- The historical DOCX export was not regenerated.
- No live stack check was run for the stopped agents. The Worker host was not queried again.
