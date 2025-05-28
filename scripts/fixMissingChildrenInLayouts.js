const fs = require('fs');
const path = require('path');

const walk = (dir, action) => {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, action);
    else if (file.endsWith('.tsx')) action(full);
  });
};

const fixFile = file => {
  const content = fs.readFileSync(file, 'utf-8');

  const match = content.match(/export default function ResumePage\(\)[\s\S]*?<DashboardLayout>([\s\S]*?)<\/DashboardLayout>/);

  if (match && match[1].trim() === '{/* Your page JSX here */}') {
    console.log(`🛠 Fixing placeholder in: ${file}`);

    const fixed = content.replace(
      /<DashboardLayout>\s*{\/\* Your page JSX here \*\/}\s*<\/DashboardLayout>/,
      `<DashboardLayout>\n  <div className="p-6 text-center text-gray-500">Page Coming Soon</div>\n</DashboardLayout>`
    );

    fs.writeFileSync(file, fixed, 'utf-8');
  }
};

console.log('🔍 Fixing empty DashboardLayout placeholders...');
walk('./src/pages', fixFile);
console.log('✅ Done!');
