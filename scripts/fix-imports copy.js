const fs = require('fs');
const path = require('path');

const TARGET_EXTENSIONS = ['.js', '.jsx'];
const SRC_DIR = path.join(__dirname, 'src');

// Define replacements
const replacements = [
  {
    find: /(['"])..\/..\/common\/ProgressBar\1/g,
    replace: "'@/components/common/ProgressBar'"
  },
  {
    find: /(['"])..\/..\/common\/NavigationButtons\1/g,
    replace: "'@/components/common/NavigationButtons'"
  },
  {
    find: /(['"])..\/..\/lib\/firebase\1/g,
    replace: "'@/lib/firebase'"
  },
  {
    find: /(['"])..\/..\/lib\/saveAnswer\1/g,
    replace: "'@/lib/saveAnswer'"
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = content;

  replacements.forEach(({ find, replace }) => {
    updated = updated.replace(find, replace);
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const entry = path.join(dir, file);
    const stat = fs.statSync(entry);

    if (stat.isDirectory()) {
      walk(entry);
    } else if (TARGET_EXTENSIONS.includes(path.extname(entry))) {
      fixFile(entry);
    }
  });
}

// Run it
walk(SRC_DIR);
console.log('🎉 All import paths updated.');
