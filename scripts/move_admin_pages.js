const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const pagesDir = path.join(projectRoot, 'src', 'pages', 'admin');
const componentsDir = path.join(projectRoot, 'src', 'components', 'admin');

const files = ['settings.tsx', 'referral-policy.tsx', 'invites.tsx', 'referrals.tsx'];

files.forEach((filename) => {
  const pagePath = path.join(pagesDir, filename);
  const baseName = filename.replace('.tsx', '');
  const componentName = baseName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Page';
  const componentFile = `${componentName}.tsx`;
  const componentPath = path.join(componentsDir, componentFile);

  if (!fs.existsSync(pagePath)) {
    console.error(`❌ File not found: ${pagePath}`);
    return;
  }

  const content = fs.readFileSync(pagePath, 'utf8');
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Moved: ${filename} → ${componentFile}`);

  const wrapper = `import dynamic from 'next/dynamic';\nconst ${componentName} = dynamic(() => import('@/components/admin/${componentName}'), { ssr: false });\nexport default ${componentName};\n`;
  fs.writeFileSync(pagePath, wrapper);
  console.log(`🔁 Replaced ${filename} with dynamic wrapper.`);
});
