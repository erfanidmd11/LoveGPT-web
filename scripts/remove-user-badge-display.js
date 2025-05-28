const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'src');
const targetName = 'UserBadgeDisplay';

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove import line
  content = content.replace(
    new RegExp(`^.*import\\s+${targetName}.*?;\\s*$`, 'gm'),
    ''
  );

  // Remove JSX component usage
  content = content
    .replace(new RegExp(`<${targetName}[^>]*>`, 'g'), '')
    .replace(new RegExp(`</${targetName}>`, 'g'), '')
    .replace(new RegExp(`<${targetName} />`, 'g'), '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      cleanFile(fullPath);
    }
  }
}

walk(rootDir);
