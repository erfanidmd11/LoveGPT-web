// fixOnboardingStepsMaster.js
// Run with: node fixOnboardingStepsMaster.js

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

  const patterns = [
    /export default (\w+);\s*\(\{([\s\S]*?)\}:(\s*[\w<>]+)\)\s*=>\s*\{/m,
    /export default function (\w+)\((\{[\s\S]*?\})\)/m,
    /export default function (\w+)\(([^)]*)\)\s*\{/m,
    /const (\w+)Component: React.FC<any> & \{ handleNext\?: \(\) => void \} = \(\{ (.*?) \}: (\w+) \) \{/m,
    /const (\w+): React.FC<([\w<>]+)>&?[^=]*=\s*\(([^)]*)\)\s*=>\s*\{/m
  ];

  let matched = false;
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      let compName = match[1];
      let propsList = match[2];
      let propsType = match[3] || 'any';

      const compDecl = `const ${compName}Component: React.FC<${propsType} & { handleNext?: () => void }> = ({ ${propsList} }) => {`;

      content = content.replace(match[0], compDecl);

      if (!content.includes(`${compName}Component.handleNext`)) {
        content = content.replace(
          /return \(/,
          `${compName}Component.handleNext = handleContinue;\n\n  return (`
        );
      }

      if (!content.includes(`export default ${compName}Component;`)) {
        content += `\nexport default ${compName}Component;\n`;
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fully fixed: ${filePath}`);
      matched = true;
      break;
    }
  }

  if (!matched && content.includes('handleNext = handleContinue')) {
    const fallback = filePath.split('/').pop().replace('.tsx', '');
    const compName = fallback.replace(/[^a-zA-Z0-9]/g, '') + 'Component';
    const wrap = `const ${compName}: React.FC<any> & { handleNext?: () => void } = (props) => {
  // Original content preserved below
`;
    content = wrap + content;
    if (!content.includes(`export default ${compName}`)) {
      content += `\nexport default ${compName};\n`;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`🩹 Fallback applied: ${filePath}`);
  } else if (!matched) {
    console.log(`⚠️  Still unmatched: ${filePath}`);
  }
});
