const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '..', 'shared', 'lib', 'zodiac');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(filename => {
    const fullPath = path.join(dir, filename);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (filename.endsWith('.ts')) {
      callback(fullPath);
    }
  });
}

walk(directory, file => {
  const content = fs.readFileSync(file, 'utf8');

  const fixed = content.replace(
    /import\s+\{\s*ZodiacNarrative\s*\}\s+from\s+['"]\.\.['"];/g,
    "import { ZodiacNarrative } from '../../types';"
  );

  if (content !== fixed) {
    fs.writeFileSync(file, fixed, 'utf8');
    console.log(`✅ Fixed import in: ${file}`);
  }
});
