// fixFormDataValueCasting.js
// Run with: node fixFormDataValueCasting.js

const fs = require('fs');
const path = require('path');

const directory = path.resolve(__dirname, './src/components/onboarding');

const walkDir = (dir) => {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filepath));
    } else if (filepath.endsWith('.tsx')) {
      results.push(filepath);
    }
  });
  return results;
};

const files = walkDir(directory);

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  const regex = /(renderField\([^,]+,\s*[^,]+,\s*)(formData\[[^\]]+\])(\s*\))/g;
  const jsxRegex = /{\s*(formData\[[^\]]+\])\s*}/g;

  let updated = content;
  let updatedFlag = false;

  updated = updated.replace(regex, (match, start, key, end) => {
    updatedFlag = true;
    return `${start}String(${key})${end}`;
  });

  updated = updated.replace(jsxRegex, (match, key) => {
    updatedFlag = true;
    return `{String(${key})}`;
  });

  if (updatedFlag) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️ Checked: ${filePath}`);
  }
});
