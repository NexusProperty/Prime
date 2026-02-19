# Orion Context

> Persistent context file tracking all Orion analysis sessions, their relationships, and outcomes.
> Read at the START and updated at the END of every `/orion` execution.

---

## Session Log

| Orion ID | Date | Target | Status | Outputs | Related Sessions |
|----------|------|--------|--------|---------|------------------|

### Status Values
- **Complete** — Analysis finished, outputs generated
- **Actioned** — Findings acted on via /van → /build
- **Superseded** — Newer session covers same target
- **Stale** — Target changed significantly; re-run recommended

---

## Active Threads

> Ongoing investigations or unresolved findings.

---

## Resolved Threads

> Threads that have been fully addressed.

---

## Relationship Map

> How sessions connect to each other and to the broader task workflow.
