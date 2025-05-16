const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      callback(fullPath);
    }
  });
}

function findUnclosedJSXTags(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const stack = [];
  const tagRegex = /<\/?([A-Za-z0-9]+)(\s[^>]*)?(\/?)>/g;

  lines.forEach((line, lineNum) => {
    let match;
    while ((match = tagRegex.exec(line)) !== null) {
      const [, tag, , selfClosing] = match;
      if (selfClosing === '/' || match[0].startsWith('</')) {
        if (stack.length && stack[stack.length - 1].tag === tag) {
          stack.pop();
        } else {
          // Skip closing tags that were never opened
        }
      } else {
        stack.push({ tag, line: lineNum + 1 });
      }
    }
  });

  if (stack.length) {
    console.log(`🔍 Unclosed tags in: ${filePath}`);
    stack.forEach(({ tag, line }) =>
      console.log(`  ❌ <${tag}> opened at line ${line} might be missing a closing </${tag}>`)
    );
    console.log('');
  }
}

const targetDir = './src';

walkDir(targetDir, findUnclosedJSXTags);
