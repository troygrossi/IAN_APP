#!/bin/bash
# Deploy (deploy to Vercel) - double-click when the work is ready for visitors (Mac).
# The same as typing "npm run deploy". See docs/rules/WORKFLOW.md.
cd "$(dirname "$0")" || exit 1

echo "Deploy (deploy to Vercel)"
echo
echo "This makes the live site match what you last published."
echo "Visitors will see the change in about two minutes."
echo
read -r -p "Type yes and press Enter to continue: " OK
case "$OK" in
  [Yy][Ee][Ss]) npm run deploy ;;
  *) echo "Nothing was deployed." ;;
esac

echo
read -n 1 -s -r -p "Press any key to close."
echo
