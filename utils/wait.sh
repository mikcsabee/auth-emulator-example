#!/bin/bash

wait() {
  READY=false
  TRIES=1
  while [ "$READY" != "true" ];
  do
    PROJECT_ID=$(curl -s http://localhost:4000/api/config | jq '.projectId'| sed 's/\^//g'| sed 's/\"//g')
    if [ "$PROJECT_ID" = "auth-emulator-example" ]; then
      echo "Firebase is running"
      READY=true
    else
      echo "Waiting for Firebase ($TRIES)"
      sleep 1
      ((TRIES=TRIES+1))
    fi
    if [ "$TRIES" -gt 30 ]; then
      echo "Timeout"
      exit 1
    fi
  done
}

wait
