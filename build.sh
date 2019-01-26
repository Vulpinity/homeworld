#!/bin/bash
while kill -0 "$(cat run.pid)" >/dev/null 2>&1
do
    kill "$(cat run.pid)" &> /dev/null
done
cd "$( dirname "${BASH_SOURCE[0]}" )"
./node_modules/.bin/browserify ./src/frontend/index.js --outfile ./dist/index.js --debug
cp ./src/frontend/index.html ./dist/index.html
cp -r ./src/frontend/assets ./dist/
node src/backend/server.js &
echo "$!" >run.pid
