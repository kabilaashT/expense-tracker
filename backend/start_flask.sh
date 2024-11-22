#!/bin/bash
PORT=5001
echo "Checking for processes on port $PORT..."
PIDS=$(lsof -t -i:$PORT)
if [ -n "$PIDS" ]; then
  echo "Killing processes: $PIDS"
  kill -9 $PIDS
fi
echo "Starting Flask server..."
python3 app.py
