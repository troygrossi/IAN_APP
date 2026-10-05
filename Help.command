#!/bin/bash
# Help - double-click to read the map of the project (Mac).
# The same as typing "npm run help". The words live in HELP.md.
cd "$(dirname "$0")" || exit 1

npm run help
while true; do
  read -r -p "Type a section number (or press Enter to close): " TOPIC
  [ -z "$TOPIC" ] && exit 0
  npm run help -- "$TOPIC"
done
