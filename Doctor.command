#!/bin/bash
# Doctor - double-click to check that this computer is ready, and repair what can be repaired (Mac).
# The same as typing "npm run doctor -- --fix". See HELP.md, section 7.
cd "$(dirname "$0")" || exit 1

finish() {
  echo
  read -n 1 -s -r -p "Press any key to close."
  echo
}

if ! command -v node >/dev/null 2>&1; then
  echo "Node is not installed. Install the LTS version from https://nodejs.org"
  echo "then double-click this file again. See ONBOARDING.md, step 5."
  finish
  exit 1
fi

npm run doctor -- --fix
finish
