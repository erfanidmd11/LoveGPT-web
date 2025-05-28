// fixHandleNextGlobally.js
// Run with: node fixHandleNextGlobally.js

const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, './src/components/onboarding');

const walkDir = (dirPath) => {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (/Step\d+.*\.tsx$/.test(file)) {
      results.push(filePath);
    }
  });
  return results;
};

const stepFiles = walkDir(dir);

stepFiles.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  if (/\.handleNext\s*=\s*handle/.test(content)) {
    content = content.replace(
      /^(export\s+default\s+function\s+\w+)\((\{\s*onNext[^}]*}\))/m,
      'const $2Component: React.FC<$2> & { handleNext?: () => void } = $2 =>'
    );

    content = content.replace(
      /(\w+)\.handleNext\s*=\s*handle\w+;/,
      '// @ts-ignore\n$1.handleNext = $1.handleNext || handleContinue;'
    );

    content = content.replace(
      /export\s+default\s+function\s+(\w+)/,
      'export default $1Component;'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched: ${filePath}`);
  }
});

