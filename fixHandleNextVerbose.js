// fixHandleNextVerbose.js
// Run with: node fixHandleNextVerbose.js

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

const files = walkDir(dir);

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  const brokenPattern = /const (\w+): React\.FC<any> & \{ handleNext\?: \(\) => void \} = \(props\) => \{/;
  const validTypedPattern = /const (\w+): React\.FC<\{\s*[^}]+\}> & \{ handleNext\?: \(\) => void \} = \(\{[^)]*\}\) => \{/;

  if (brokenPattern.test(content) && !validTypedPattern.test(content)) {
    const compName = content.match(brokenPattern)[1];

    const propBlockRegex = new RegExp(`const ${compName}: React.FC<any> & \{ handleNext\?: \(\) => void \} = \(props\) => \{`);
    const propFix = `const ${compName}: React.FC<{ onNext: () => void }> & { handleNext?: () => void } = ({ onNext }) => {`;

    content = content.replace(propBlockRegex, propFix);

    if (!content.includes(`${compName}.handleNext =`)) {
      content = content.replace(
        /return \(/,
        `${compName}.handleNext = handleContinue;\n\n  return (`
      );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ FIXED: ${filePath}`);
  } else {
    console.log(`ℹ️ Checked (no fix needed): ${filePath}`);
  }
});
