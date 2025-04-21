// scripts/checkCriticalFiles.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ ESM-compatible __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths to verify
const filesToCheck = [
  'src/lib/firebase.ts',
  'src/lib/saveAnswer.ts',
];

filesToCheck.forEach((relativePath) => {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Found: ${relativePath}`);
  } else {
    console.error(`❌ Missing: ${relativePath}`);
  }
});
