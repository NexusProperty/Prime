# New Project Setup Checklist

## Automated Option

Instead of following the manual checklist below, run `/setup` in Cursor to automate Phases 1 and the file copying parts of the setup. You'll still need to manually fill in your project details (Phase 2) and configure development tools (Phase 3+).

---

## Phase 1: Copy Files (5 min)
- [ ] Copy `.cursor/` to project root
- [ ] Copy `AGENTS.md` to project root
- [ ] Copy `.cursorrules` to project root (then customize)
- [ ] Copy `cursor-memory-bank/` directory
- [ ] Create `memory-bank/` from templates
- [ ] Create `Maunal/` from templates

## Phase 2: Project Identity (30 min)
- [ ] Fill `memory-bank/productContext.md`
- [ ] Fill `memory-bank/techContext.md`
- [ ] Fill `memory-bank/systemPatterns.md`
- [ ] Fill `memory-bank/projectbrief.md`
- [ ] Customize `.cursorrules`

## Phase 3: Development Config (20 min)
- [ ] Set up `package.json`
- [ ] Configure TypeScript
- [ ] Configure build tool
- [ ] Configure testing
- [ ] Configure styling
- [ ] Create `.env` file

## Phase 4: CI/CD (10 min)
- [ ] Set up GitHub Actions
- [ ] Configure pre-commit hooks
- [ ] Configure deployment

## Phase 5: Verify (5 min)
- [ ] `/van` command works
- [ ] `/plan` command works
- [ ] `npm run dev` works
- [ ] `npm test` works

## Optional
- [ ] Install user-level skills
- [ ] Set up LLM Council
- [ ] Configure MCP servers
