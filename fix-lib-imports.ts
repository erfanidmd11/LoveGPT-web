import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const TARGET_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Patterns to replace relative paths with aliases
const replacements = [
  {
    description: 'Convert lib/saveAnswer imports',
    find: /(['"])(\.\.\/)+lib\/saveAnswer\1/g,
    replace: "'@/lib/saveAnswer'",
  },
  {
    description: 'Convert lib/firebase imports',
    find: /(['"])(\.\.\/)+lib\/firebase\1/g,
    replace: "'@/lib/firebase'",
  },
  {
    description: 'Convert common/ProgressBar imports',
    find: /(['"])(\.\.\/)+common\/ProgressBar\1/g,
    replace: "'@/components/common/ProgressBar'",
  },
  {
    description: 'Convert common/NavigationButtons imports',
    find: /(['"])(\.\.\/)+common\/NavigationButtons\1/g,
    replace: "'@/components/common/NavigationButtons'",
  },
];

function fixFile(filePath: string) {
  const originalContent = fs.readFileSync(filePath, 'utf-8');
  let updatedContent = originalContent;

  replacements.forEach(({ find, replace }) => {
    updatedContent = updatedContent.replace(find, replace);
  });

  if (updatedContent !== originalContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walk(dir: string) {
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

// Start fixing
walk(SRC_DIR);
console.log('🎉 All import paths updated to use @/ aliases!');
