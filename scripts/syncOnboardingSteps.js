// scripts/syncOnboardingSteps.js
const fs = require('fs');
const path = require('path');

const stepsDir = path.resolve(__dirname, '../src/components/onboarding/steps');
const files = fs.readdirSync(stepsDir).filter(file => file.endsWith('.tsx'));

files.forEach((file) => {
  const filePath = path.join(stepsDir, file);
  let code = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace any duplicate uid declarations and invalid useRoute
  code = code.replace(/const route = useRoute<any>\(\);\nconst uid = route\?\.params\?\.uid;/g, '');
  code = code.replace(/useRoute<.*?>\(\);?\n?/g, '');

  // Add saveAnswerToFirestore import if missing
  if (!code.includes('saveAnswerToFirestore')) {
    code = code.replace(
      /from ['"]@\/lib\/saveAnswer['"];/,
      ", getAnswer, saveAnswerToFirestore from '@/lib/saveAnswer';"
    );
    modified = true;
  }

  // Fix ProgressBar prop usage if found
  code = code.replace(
    /<ProgressBar current={(\d+)} total={(\d+)} \/>/g,
    '<ProgressBar step=$1 totalSteps=$2 />'
  );

  // Remove invalid navigation.replace structure
  code = code.replace(
    /router\.replace\("\/onboarding\/" \+ '(.+?)', \{ uid \}\.toLowerCase\(\) \+ "\?uid=" \+ uid\);/g,
    'router.replace("/onboarding/$1?uid=" + uid);'
  );

  if (modified) {
    fs.writeFileSync(filePath, code);
    console.log(`✔ Fixed: ${file}`);
  }
});