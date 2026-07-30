# Pipeline Configuration

This file is read by all three agents (BA, Developer, QA) at startup to self-configure for your project. Fill it in once when you adopt the pipeline.

---

## Project

```
name: My Project
description: One-line description of what the project does
```

## Tech stack

```
languages: TypeScript, Python, ...
frameworks: React, Express, ...
test_command: npm test
build_command: npm run build
```

## Key source files

List the files each agent should read first to understand the codebase:

```
entry_files:
  - src/main.ts
  - src/App.tsx
  - src/components/...
```

## Roles / Personas

Who uses this product? (Helps BA write relevant user stories.)

```
roles:
  - End User
  - Admin
  - Developer (embedding or extending)
```

## Feature areas

List the major functional areas of the app. QA will verify each one.

```
features:
  - Authentication
  - Dashboard
  - Data export
  - Settings
  - ...
```

## Build notes

Anything the developer or QA needs to know to build and run the project:

```
setup: npm install
dev: npm run dev
build: npm run build
notes: Requires Node 20+. Copy .env.example to .env before first run.
```
