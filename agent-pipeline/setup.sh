#!/usr/bin/env bash
# Initialises the BA → Dev → QA agent pipeline in any project.
# Run from the project root: bash path/to/setup.sh

set -e

PROJECT_ROOT="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Setting up agent pipeline in: $PROJECT_ROOT"

# Create directory structure
mkdir -p "$PROJECT_ROOT/.claude/agents"
mkdir -p "$PROJECT_ROOT/bugs"
mkdir -p "$PROJECT_ROOT/features"
mkdir -p "$PROJECT_ROOT/docs"

# Copy agent definitions
cp "$SCRIPT_DIR/.claude/agents/business-analyst.md" "$PROJECT_ROOT/.claude/agents/"
cp "$SCRIPT_DIR/.claude/agents/developer.md"        "$PROJECT_ROOT/.claude/agents/"
cp "$SCRIPT_DIR/.claude/agents/tester.md"           "$PROJECT_ROOT/.claude/agents/"

# Copy pipeline config template (only if one doesn't already exist)
if [ ! -f "$PROJECT_ROOT/PIPELINE.md" ]; then
  cp "$SCRIPT_DIR/PIPELINE.md" "$PROJECT_ROOT/PIPELINE.md"
  echo "Created PIPELINE.md — edit it to configure the pipeline for your project."
else
  echo "PIPELINE.md already exists — skipping."
fi

# Add gitkeep files so empty directories are tracked
touch "$PROJECT_ROOT/bugs/.gitkeep"
touch "$PROJECT_ROOT/features/.gitkeep"
touch "$PROJECT_ROOT/docs/.gitkeep"

# Optionally add pipeline directories to .gitignore exclusions
# (they should be tracked, so we do nothing here by default)

echo ""
echo "Done. Next steps:"
echo "  1. Edit PIPELINE.md with your project name, stack, and entry files."
echo "  2. Open Claude Code in the project root."
echo "  3. Use /business-analyst, /developer, or /tester to run an agent."
echo ""
echo "Pipeline flow:"
echo "  /business-analyst  →  writes features/FEAT-NNN.md"
echo "  /developer         →  reads features/ and bugs/, implements/fixes"
echo "  /tester            →  verifies features/, writes bugs/BUG-NNN.md"
