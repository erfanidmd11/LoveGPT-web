#!/bin/bash

echo "🤖 Auto-tagging NavigationButtons with showBack/showNext props..."

OLD_PATH='@/components/onboarding/common/NavigationButtons'
NEW_PATH='@/components/common/NavigationButtons'

# Define replacement strings safely
BACK_INSERT='<NavigationButtons showBack={false} '
NEXT_INSERT='<NavigationButtons showNext={false} '

grep -rl "NavigationButtons" ./src | while read -r file; do
  echo "📄 Found in $file"
  chmod u+w "$file"

  if grep -q "$OLD_PATH" "$file"; then
    echo "🔧 Fixing import path..."
    awk -v old="$OLD_PATH" -v new="$NEW_PATH" '{gsub(old, new)}1' "$file" 
> tmp && mv tmp "$file"
  fi

  if grep -q "NavigationButtons" "$file"; then
    HAS_BACK=$(grep -c "showBack=" "$file")
    HAS_NEXT=$(grep -c "showNext=" "$file")

    if [[ "$HAS_BACK" -eq 0 && "$HAS_NEXT" -eq 0 ]]; then
      if [[ "$file" == *Step1* ]]; then
        echo "🔹 First step — inserting showBack={false}"
        awk -v insert="$BACK_INSERT" '{sub(/<NavigationButtons /, 
insert)}1' "$file" > tmp && mv tmp "$file"
      elif [[ "$file" == *Step10* ]] || [[ "$file" == *StepFinal* ]] || [[ 
"$file" == *SupportRequest* ]]; then
        echo "🔹 Final step — inserting showNext={false}"
        awk -v insert="$NEXT_INSERT" '{sub(/<NavigationButtons /, 
insert)}1' "$file" > tmp && mv tmp "$file"
      else
        echo "⚠️ Middle/unknown step — review manually: $file"
      fi
    else
      echo "✅ Props already present — $file"
    fi
  fi
done

echo "✅ Auto-tagging complete."

