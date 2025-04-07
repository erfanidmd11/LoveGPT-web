const fs = require('fs');
const path = require('path');

// Path to check
const checkPath = path.resolve(__dirname, 'src/lib/firebase.js'); 

// Check if file exists
if (fs.existsSync(checkPath)) {
  console.log('✅ Firebase file exists:', checkPath);
} else {
  console.error('❌ Firebase file not found!');
}

const saveAnswerPath = path.resolve(__dirname, 'src/lib/saveAnswer.js');
if (fs.existsSync(saveAnswerPath)) {
  console.log('✅ saveAnswer file exists:', saveAnswerPath);
} else {
  console.error('❌ saveAnswer file not found!');
}
