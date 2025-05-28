#!/bin/bash

# Navigate to your project root if not already there
cd "$(dirname "$0")"

echo "🔧 Fixing all incorrect firebaseConfig import paths..."

# Find all .ts or .tsx files and replace the incorrect import path
grep -rl "../firebase/firebaseConfig" ./src | while read -r file; do
  echo "✅ Fixing $file"
  sed -i '' 's|../firebase/firebaseConfig|@/firebase/firebaseConfig|g' 
"$file"
done

echo "✅ All imports fixed."

