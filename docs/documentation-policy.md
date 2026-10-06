# Documentation policy

## Canonical sources

- The Linear tracker at https://linear.app/activi/project/lena-1333951b31fb is authoritative for assignment and work status. Its title Lena was rejected on 5 October 2026 and is not the product name.
- `docs/project.md` is authoritative for current repository and deployment facts.
- `docs/SPEC.md` is authoritative for approved product scope.
- `docs/open-work.md` mirrors the Linear work breakdown for local readers.
- Dated audits are evidence records; they are not silently rewritten into
  current implementation claims.

## Update rule

When behavior, architecture, configuration, security policy, deployment state,
or an issue decision changes:

1. Update the canonical source and every directly affected active document.
2. Update `docs/changes.md`, `docs/memory.md` and `docs/coverage.json` where relevant.
3. Mark superseded historical documents instead of erasing their dated claims.
4. Update Linear when assignment, scope or status changes.
5. Run package checks appropriate to the change and the documentation check.
6. Record failures and unverified external state honestly.

Planned, implemented, locally checked, externally verified and production
released are distinct states. Documentation must not collapse them.

## Review command

See [setup.md](setup.md) for the local commands. A successful structural check
does not prove external URLs, Linear state, live Worker behavior, security or
semantic correctness. A fresh review record is required after relevant inputs
change.
