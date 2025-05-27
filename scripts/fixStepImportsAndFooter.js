// scripts/fixStepImportsAndFooter.js
const fs = require('fs');
const path = require('path');

const stepsDir = path.resolve(__dirname, '../src/components/onboarding/steps');
const files = fs.readdirSync(stepsDir).filter(file => file.endsWith('.tsx'));

files.forEach((file) => {
  const filePath = path.join(stepsDir, file);
  let code = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Fix AnimatedTypingText path if present
  if (code.includes("AnimatedTypingText") && !code.includes("@/components/common/AnimatedTypingText")) {
    code = code.replace(
      /import\s+AnimatedTypingText.*?['"].*?['"];?/g,
      "import AnimatedTypingText from '@/components/common/AnimatedTypingText';"
    );
    modified = true;
  }

  // Add missing Footer prop types for onboarding variant
  if (code.includes('<Footer') && code.includes('onNext=') && !code.includes('variant="onboarding"')) {
    code = code.replace('<Footer', '<Footer variant="onboarding"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code);
    console.log(`✔ Patched: ${file}`);
  }
});
