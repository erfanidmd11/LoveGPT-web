const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
};

const fixFile = filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const defaultExports = [...content.matchAll(/export default function (\w+)/g)];

  if (defaultExports.length > 1) {
    console.log(`🛠 Fixing duplicate exports in: ${filePath}`);

    let fixed = content;
    defaultExports.forEach((match, index) => {
      const [full, funcName] = match;
      if (index > 0) {
        fixed = fixed.replace(full, `export function ${funcName}`);
      }
    });

    fs.writeFileSync(filePath, fixed, 'utf-8');
  }
};

console.log('🔍 Scanning for duplicate default exports...');
walkDir('./src', fixFile);
console.log('✅ Done!');
