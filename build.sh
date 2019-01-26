#!/bin/bash
"$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
./node_modules/.bin/browserify ./frontend/index.js --outfile ./dist/index.js --debug
cp ./frontend/index.html ./dist/index.html
cp -r ./frontend/assets ./dist/