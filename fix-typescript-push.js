const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fixFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const fixed = code.replace(
    /Object\.values\((.*?)\)\.forEach\(\s*\((\w+)\)\s*=>\s*([\w.]+)\.push\(\2\)\s*\)/g,
    (match, obj, val, target) =>
      `Object.values(${obj}).forEach((${val}) => {\n  if (typeof ${val} === 'string') ${target}.push(${val});\n})`
  );

  if (code !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

const targetDir = './src';

walkDir(targetDir, function (filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    fixFile(filePath);
  }
});
