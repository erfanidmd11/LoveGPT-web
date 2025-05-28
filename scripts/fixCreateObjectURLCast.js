const fs = require('fs');
const path = require('path');

const walk = (dir, action) => {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, action);
    else if (file.endsWith('.tsx')) action(full);
  });
};

const fixFile = file => {
  const content = fs.readFileSync(file, 'utf-8');

  const regex = /URL\.createObjectURL\(([^)]+)\)/g;
  let match;
  let fixed = content;
  let modified = false;

  while ((match = regex.exec(content))) {
    const inside = match[1].trim();
    if (!inside.includes('as')) {
      const fixedLine = `URL.createObjectURL(${inside} as Blob)`;
      fixed = fixed.replace(match[0], fixedLine);
      modified = true;
    }
  }

  if (modified) {
    console.log(`🛠 Fixed createObjectURL casting in: ${file}`);
    fs.writeFileSync(file, fixed, 'utf-8');
  }
};

console.log('🔍 Scanning for createObjectURL without type casting...');
walk('./src/pages', fixFile);
console.log('✅ Done!');
