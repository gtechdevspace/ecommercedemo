#!/usr/bin/env bash
set -e

# Usage: wait_for host:port timeout
hostport=$1
timeout=${2:-60}
IFS=':' read -r host port <<< "$hostport"

start=$(date +%s)
while true; do
  if nc -z $host $port; then
    echo "$hostport is available"
    exit 0
  fi
  now=$(date +%s)
  if [ $((now-start)) -ge $timeout ]; then
    echo "Timeout waiting for $hostport"
    exit 1
  fi
  sleep 1
done
