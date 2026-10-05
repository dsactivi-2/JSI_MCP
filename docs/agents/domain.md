# Domain Docs

How the engineering skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repository root.
- **`docs/adr/`**: read ADRs that affect the area about to be changed.

If these files do not exist, proceed silently. Do not flag their absence or suggest creating them upfront. The `domain-modeling` skill creates them lazily when terms or decisions are resolved.

## File structure

This repository uses a single-context layout:

```text
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-example-decision.md
│   └── 0002-another-decision.md
└── ...
```

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term defined in `GLOSSARY.md`. Do not drift to synonyms the glossary explicitly avoids.

If a required concept is absent, reconsider whether the term belongs to the project or note the gap for the `domain-modeling` skill.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly instead of silently overriding the decision.
