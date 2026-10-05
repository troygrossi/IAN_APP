#!/bin/bash
# Start App - double-click to run the app on this computer (Mac).
# The same as typing "npm run dev". See HELP.md, section 2.
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

if [ ! -d node_modules ]; then
  echo "First run: installing packages. This takes a minute..."
  if ! npm install; then
    echo
    echo "The install stopped. Double-click Doctor.command"
    finish
    exit 1
  fi
fi
[ -f .env.local ] || npm run doctor -- --fix

echo
echo "Starting the app. Your browser will open http://localhost:3000 in a few seconds."
echo "Leave this window open while you work. To stop the app, close this window."
echo
(sleep 5 && open http://localhost:3000) &
npm run dev

echo
echo "The app stopped. If that was not what you wanted, double-click Doctor.command"
finish
