#!/bin/bash

set -eu

source .api-key
mkdir -p _site
cp index.html _site

gem exec neocities push --prune _site
