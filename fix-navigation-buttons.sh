#!/bin/bash

echo "🔍 Searching for NavigationButtons usage..."

# Define old and new import paths
OLD_PATH='@/components/onboarding/common/NavigationButtons'
NEW_PATH='@/components/common/NavigationButtons'

# Find all .tsx files using NavigationButtons
grep -rl "NavigationButtons" ./src | while read -r file; do
  echo "📄 Found in $file"

  # Ensure file is writable
  chmod u+w "$file"

  # Fix import path using correct sed syntax (macOS-safe)
  if grep -q "$OLD_PATH" "$file"; then
    echo "🔧 Fixing import path in $file"
    sed -i '' "s|$OLD_PATH|$NEW_PATH|g" "$file"
  fi

  # Suggest manual prop control
  if grep -q "showBack=" "$file" || grep -q "showNext=" "$file"; then
    echo "✅ Props already set — $file"
  else
    echo "⚠️ Add showBack/showNext manually: $file"
  fi
done

echo "✅ All NavigationButtons references processed."

