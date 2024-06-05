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

    # Install dependencies using npm install
    npm $1

    # Move back to the base directory (optional)
    cd $ROOT
  fi
done

npm $1

echo "npm $1 run successfully"
