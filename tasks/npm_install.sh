#!/bin/bash

# Set the base directory containing your packages
base_dir="packages"

# Loop through all subdirectories within the base directory
for dir in "$base_dir"/*; do
  # Check if it's a directory (avoid hidden files, etc.)
  if [ -d "$dir" ]; then
    # Change directory to the current package directory
    cd "$dir"

    # Install dependencies using npm install
    npm install

    # Move back to the base directory (optional)
    cd -/dev/null
  fi
done

npm install

echo "Dependencies installed for all packages in ${base_dir}"
