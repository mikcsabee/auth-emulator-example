#!/bin/bash

cat package.json | jq '.dependencies."firebase-tools"' | sed 's/\^//g'| sed 's/\"//g'
