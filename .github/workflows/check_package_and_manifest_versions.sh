#!/bin/bash

# Define the paths to the JSON files
file1="package.json"
file2="manifest.json"

# Extract the version fields from both files
version1=$(jq -r '.version' "$file1")
version2=$(jq -r '.version' "$file2")

# Compare the version fields and return the appropriate exit code
if [[ "$version1" == "$version2" ]]; then
  echo "0"
  exit 0  # Versions are the same, return 0
else
  echo "1"
  exit 1  # Versions are different, return 1
fi
