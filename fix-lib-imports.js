const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const TARGET_EXTENSIONS = ['.js', '.jsx'];

// Flexible regex to match ../../lib/saveAnswer, etc.
const replacements = [
  {
    description: 'Convert lib/saveAnswer imports',
    find: /(['"])(\.\.\/)+lib\/saveAnswer\1/g,
    replace: "'@/lib/saveAnswer'"
  },
  {
    description: 'Convert lib/firebase imports',
    find: /(['"])(\.\.\/)+lib\/firebase\1/g,
    replace: "'@/lib/firebase'"
  },
  {
    description: 'Convert common/ProgressBar imports',
    find: /(['"])(\.\.\/)+common\/ProgressBar\1/g,
    replace: "'@/components/common/ProgressBar'"
  },
  {
    description: 'Convert common/NavigationButtons imports',
    find: /(['"])(\.\.\/)+common\/NavigationButtons\1/g,
    replace: "'@/components/common/NavigationButtons'"
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
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (TARGET_EXTENSIONS.includes(path.extname(fullPath))) {
      fixFile(fullPath);
    }
  });
}

walk(SRC_DIR);
console.log('🎉 All lib/common import paths updated!');
