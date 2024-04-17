#!/bin/bash

set -eu

source .api-key
mkdir -p _site
cp index.html index.js _site

pushd _site
    # gem exec neocities push --prune .
    gem exec neocities push --prune -e 1 -e 2 -e 3 -e 4 -e 5 -e 6 -e 7 -e 8 -e 9 -e a -e b -e c -e d -e e -e f -e g -e h -e i -e j -e k -e l -e m -e n -e o -e p -e q -e r -e s -e t -e u -e v -e w -e x -e y -e z .
popd


