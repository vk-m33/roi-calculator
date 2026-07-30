# Agent Pipeline — BA → Dev → QA

A drop-in Claude Code agent workflow for any software project. Three persistent agents collaborate through shared Markdown files — no servers, no orchestration layer, no extra tooling required.

---

## How it works

```
Business Analyst ──► features/FEAT-NNN.md (Status: READY)
                                │
                                ▼
         Developer ──► reads feature file, implements, marks IMPLEMENTED
                                │
                                ▼
              QA ──► verifies acceptance criteria
                     PASS → marks TESTED
                     FAIL → writes bugs/BUG-NNN.md (Status: OPEN)
                                │
                                ▼
         Developer ──► reads bug report, fixes, marks RESOLVED
                                │
                                ▼
              QA ──► re-verifies fix
```

BA also runs two other modes:
- **Documentation** — produces `docs/requirements.md` (BRD + user stories) and `docs/test-cases.md`
- **Coverage audit** — checks every FR/NFR has a test case; appends any gaps

---

## Quick start

### 1. Copy the pipeline into your project

**Linux / macOS / Git Bash:**
```bash
bash path/to/agent-pipeline/setup.sh
```

**Windows (cmd):**
```bat
path\to\agent-pipeline\setup.bat
```

This creates:
```
your-project/
├── .claude/agents/
│   ├── business-analyst.md
│   ├── developer.md
│   └── tester.md
├── bugs/
├── features/
├── docs/
└── PIPELINE.md          ← edit this
```

### 2. Configure `PIPELINE.md`

Open `PIPELINE.md` and fill in your project's name, tech stack, build/test commands, key source files, user roles, and feature areas. Every agent reads this file first to self-configure.

### 3. Open Claude Code and run an agent

```
/business-analyst    Plan a new feature or produce documentation
/developer           Implement features or fix bugs
/tester              Run regression or verify new features
```

---

## File conventions

### Feature requests — `features/FEAT-NNN.md`

Written by BA, consumed by Dev and QA.

| Status | Set by | Meaning |
|---|---|---|
| `READY` | BA | Spec complete — dev can pick up |
| `IN-PROGRESS` | Dev | Currently being implemented |
| `IMPLEMENTED` | Dev | Code done, build passes — QA can verify |
| `TESTED` | QA | All acceptance criteria passed |
| `FAILED` | QA | At least one criterion failed — see linked BUG-NNN |
| `NEEDS-INFO` | Dev or QA | Blocked — unclear spec or unresolvable conflict |

### Bug reports — `bugs/BUG-NNN.md`

Written by QA, consumed by Dev.

| Status | Set by | Meaning |
|---|---|---|
| `OPEN` | QA | Defect confirmed — dev should fix |
| `RESOLVED` | Dev | Fix applied, build passes |
| `NEEDS-INFO` | Dev | Cannot reproduce — needs more detail |

---

## Customising the agents

Each agent definition is a plain Markdown file in `.claude/agents/`. Edit them to:
- Add domain-specific knowledge (e.g. "this project uses PostgreSQL, write migrations with Flyway")
- Restrict or expand tool access (the `tools:` frontmatter list)
- Add extra output formats (e.g. "also update the Jira ticket")
- Change severity/priority scales

The agents are entirely self-contained — changes to one don't require updating the others.

---

## Directory structure after a typical sprint

```
project/
├── .claude/agents/          # Agent definitions (committed to git)
│   ├── business-analyst.md
│   ├── developer.md
│   └── tester.md
├── bugs/
│   ├── BUG-001.md           # RESOLVED
│   ├── BUG-002.md           # OPEN
│   └── ...
├── features/
│   ├── FEAT-001.md          # TESTED
│   ├── FEAT-002.md          # IMPLEMENTED (awaiting QA)
│   └── ...
├── docs/
│   ├── requirements.md      # BRD produced by BA
│   └── test-cases.md        # Test suite produced by BA
└── PIPELINE.md              # Project config
```

---

## Tips

- **Keep `PIPELINE.md` up to date.** If you rename a key file or change your build command, update it — all three agents depend on it.
- **Commit `bugs/` and `features/` to git.** They are your audit trail — who found what, what was fixed, when.
- **Chain agents in order.** BA → Dev → QA is the happy path. If QA fails a feature, re-invoke Dev before re-invoking QA.
- **One feature per FEAT file.** Large epics should be split into multiple FEAT files so each can be independently implemented and tested.
- **The agents are stateless.** Each invocation reads fresh from disk. You can pause mid-sprint, close Claude Code, and resume exactly where you left off.
