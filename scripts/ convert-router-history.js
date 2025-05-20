const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content
    .replace(
      /import\s+{([^}]*?)useHistory([^}]*?)}\s+from\s+['"]react-router-dom['"];/g,
      (match, before, after) => `import {${before}useNavigate${after}} from 'react-router-dom';`
    )
    .replace(/const\s+history\s*=\s*useHistory\(\);/g, 'const navigate = useNavigate();')
    .replace(/history\.push\(/g, 'navigate(')
    .replace(/history\.replace\(/g, 'navigate(')
    .replace(/navigate\(([^)]+)\);/g, 'navigate($1, { replace: true });');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(fullPath)) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(path.resolve(__dirname, '../src'));
