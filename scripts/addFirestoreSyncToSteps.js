// scripts/addFirestoreSyncToSteps.js
const fs = require('fs');
const path = require('path');

const stepsDir = path.resolve(__dirname, '../src/components/onboarding/steps');
const files = fs.readdirSync(stepsDir).filter(file => file.endsWith('.tsx'));

files.forEach((file) => {
  const filePath = path.join(stepsDir, file);
  let code = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  if (!code.includes("saveAnswer")) {
    code = code.replace(
      /import[^;]+from\s+['"]@\/lib\/firebase['"];/,
      match => `${match}\nimport { saveAnswer, getAnswer, saveAnswerToFirestore } from '@/lib/saveAnswer';`
    );
    modified = true;
  }

  if (!code.includes('getAnswer(') && code.includes('useEffect')) {
    code = code.replace(
      /useEffect\(\(\) => \{[^}]+\}/,
      match =>
        match.replace(
          /\{/,
          `{
    if (uid) {
      getAnswer(uid, '${file.replace(/\.tsx$/, '')}').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }`
        )
    );
    modified = true;
  }

  if (!code.includes('saveAnswerToFirestore') && code.includes('handleContinue')) {
    code = code.replace(
      /const handleContinue = async \(\) => \{[\s\S]*?\{/,
      match =>
        match.replace(
          /\{/,
          `{
    if (uid) {
      saveAnswer('Step${file.replace(/\D/g, '')}', values);
      await saveAnswerToFirestore(uid, 'Step${file.replace(/\D/g, '')}', values);
    }`
        )
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code);
    console.log(`Updated: ${file}`);
  }
});
