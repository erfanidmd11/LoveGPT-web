// scripts/generateZodiacTypes.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../src/types/zodiacData.d.ts');

const content = `declare module '@/data/zodiacData.json' {
  export interface ZodiacProfile {
    element: string;
    maleTraits: string[];
    femaleTraits: string[];
    best_matches: string[];
    caution_matches: string[];
    growth_areas: string[];
    ai_tips: string[];
  }

  const value: Record<string, ZodiacProfile>;
  export default value;
}
`;

fs.writeFileSync(outputPath, content, 'utf-8');
console.log('✅ Type definition generated at src/types/zodiacData.d.ts');
