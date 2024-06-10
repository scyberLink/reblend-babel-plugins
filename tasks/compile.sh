#!/bin/bash

ROOT=$(pwd)

# Set the base directory containing your packages
base_dir="packages"

# Loop through all subdirectories within the base directory
for dir in "$base_dir"/*; do
  # Check if it's a directory (avoid hidden files, etc.)
  if [ -d "$dir" ]; then
    # Change directory to the current package directory
    cd "$dir"

    rm -rf lib
    # Install dependencies using npx tsc
    npx tsc

    # Move back to the base directory (optional)
    cd $ROOT
  fi
done

echo "Build successfully"
