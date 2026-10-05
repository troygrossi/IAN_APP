#!/bin/bash
# Publish (save to GitHub) - double-click when a piece of work is finished (Mac).
# The same as typing: npm run publish -- "what changed". See docs/rules/WORKFLOW.md.
cd "$(dirname "$0")" || exit 1

echo "Publish (save to GitHub)"
echo
echo "Describe what changed in a few plain words, then press Enter."
echo "Example: Add a phone number to the sign-up form"
echo
read -r -p "What changed? " MSG
if [ -n "$MSG" ]; then
  npm run publish -- "$MSG"
else
  npm run publish
fi

echo
read -n 1 -s -r -p "Press any key to close."
echo
