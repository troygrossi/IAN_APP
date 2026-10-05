#!/bin/bash
# Sync (get the latest from GitHub) - double-click at the start of a session (Mac).
# The same as typing "npm run sync". See docs/rules/WORKFLOW.md.
cd "$(dirname "$0")" || exit 1

npm run sync
echo
read -n 1 -s -r -p "Press any key to close."
echo
