// fixAllHandleNextExports.js
// Run with: node fixAllHandleNextExports.js

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

  const exportDefaultPattern = /export\s+default\s+(\w+);\(\{/;
  const match = content.match(exportDefaultPattern);

  if (match) {
    const compName = match[1];

    content = content.replace(
      exportDefaultPattern,
      `const ${compName}: React.FC<any> & { handleNext?: () => void } = ({`
    );

    if (!content.includes(`${compName}.handleNext =`)) {
      content = content.replace(
        /return \(/,
        `${compName}.handleNext = handleContinue;\n\n  return (`
      );
    }

    content += `\nexport default ${compName};\n`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched: ${filePath}`);
  }
});
