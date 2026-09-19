#!/usr/bin/env bash
#
# Look at this branch's website before it goes anywhere near main.
#
# GitHub Pages serves `main`, so work on a development branch is
# invisible on yap-itsupport.com until it is merged — which is correct,
# and also means "I don't see it on the site" is the expected state
# rather than a fault. This serves the working copy locally instead.
#
#   ./preview.sh          → http://localhost:8080
#   ./preview.sh 9000     → a different port, if 8080 is busy
#
# Ctrl+C stops it. Nothing is written, nothing is pushed, and no branch
# is changed: it serves whatever files are checked out right now.

set -euo pipefail

PORT="${1:-8080}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'not a git checkout')"

echo
echo "  Serving $HERE"
echo "  Branch:  $BRANCH"
echo
echo "  Open:    http://localhost:$PORT/"
echo "  Login:   http://localhost:$PORT/login.html"
echo
echo "  The header, the footer and the three legal pages should each"
echo "  carry a Business Login link. On a narrow window it lives in the"
echo "  menu behind the hamburger."
echo
echo "  Ctrl+C to stop."
echo

# python3 is already a dependency of this project's tooling, and its
# http.server needs nothing installed. --bind 127.0.0.1 keeps the
# preview on this machine rather than on the network.
exec python3 -m http.server "$PORT" --bind 127.0.0.1
