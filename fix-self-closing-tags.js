const fs = require('fs');
const path = require('path');

// Define self-closing tags
const selfClosingTags = [
  'input', 'img', 'br', 'hr', 'link', 'meta', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'
];

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

function fixFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  
  let fixedCode = code;

  let changesMade = false;

  // Fix self-closing tags
  selfClosingTags.forEach(tag => {
    const regex = new RegExp(`<${tag}(?![\\w\\d\\s=\\\"\\/]+)>`, 'g');
    const newCode = fixedCode.replace(regex, `<${tag} />`);
    if (newCode !== fixedCode) {
      changesMade = true;
      fixedCode = newCode;
    }
  });

  // If changes were made, save the updated file
  if (changesMade) {
    fs.writeFileSync(filePath, fixedCode, 'utf8');
    console.log(`✅ Fixed self-closing tags in: ${filePath}`);
  } else {
    console.log(`⚠️ No changes in: ${filePath}`);
  }
}

const targetDir = './src';

// Start walking through files and applying the fix
walkDir(targetDir, fixFile);
