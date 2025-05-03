#!/bin/bash
# Wrapper script for calling Windows ADB from WSL

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to Windows ADB
WINDOWS_ADB="/mnt/c/Users/elawa/AppData/Local/Android/Sdk/platform-tools/adb.exe"

# Run Windows ADB with all arguments passed to this script
"$WINDOWS_ADB" "$@" 