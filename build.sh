#!/bin/bash
set -e
cd "$( dirname "${BASH_SOURCE[0]}" )"
./node_modules/.bin/browserify ./src/frontend/index.js --outfile ./dist/index.js --debug
cp ./src/frontend/index.html ./dist/index.html
cp -r ./src/frontend/assets ./dist/
echo "Built 'Defend Your Homeworld' Successfully."
