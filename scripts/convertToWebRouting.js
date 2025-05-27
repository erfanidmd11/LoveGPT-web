const fs = require('fs');
const path = require('path');

const stepsDir = path.resolve(__dirname, '../src/components/onboarding/steps');

const files = fs.readdirSync(stepsDir).filter(file => file.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(stepsDir, file);
  let code = fs.readFileSync(filePath, 'utf-8');

  if (!code.includes('@react-navigation/native')) return;

  console.log(`Converting: ${file}`);

  code = code
    .replace(/import\s+\{[^}]*useNavigation[^}]*\}\s+from\s+['"]@react-navigation\/native['"];/g, "import { useRouter } from 'next/router';")
    .replace(/import\s+\{[^}]*useRoute[^}]*\}\s+from\s+['"]@react-navigation\/native['"];/g, '')
    .replace(/const\s+navigation\s+=\s+useNavigation\(\);/g, 'const router = useRouter();')
    .replace(/const\s+route\s+=\s+useRoute\(\);/, 'const uid = router.query.uid as string;')
    .replace(/navigation\.replace\(([^)]+)\);/g, 'router.replace("/onboarding/" + $1.toLowerCase() + "?uid=" + uid);')
    .replace(/navigation\.goBack\(\);/g, 'router.back();');

  fs.writeFileSync(filePath, code);
});
