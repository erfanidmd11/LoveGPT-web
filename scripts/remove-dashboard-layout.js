const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'src');
const layoutName = 'DashboardLayout';

function scanAndFix(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndFix(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Remove import lines
      content = content.replace(
        new RegExp(`import\\s+.*${layoutName}.*?;\\n`, 'g'),
        ''
      );

      // Remove JSX usage
      content = content
        .replace(new RegExp(`<${layoutName}[^>]*>`, 'g'), '')
        .replace(new RegExp(`</${layoutName}>`, 'g'), '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Cleaned: ${fullPath}`);
      }
    }
  }
}

scanAndFix(rootDir);
