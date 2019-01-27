#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"
while kill -0 "$(cat run.pid)" >/dev/null 2>&1
do
    kill "$(cat run.pid)" &> /dev/null
done
. ./build.sh
node ./src/backend/server.js &
echo "$!" >run.pid
