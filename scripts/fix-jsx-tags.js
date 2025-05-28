const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Ensure glob is properly required

// Define a broader file pattern to scan all .tsx and .jsx files in the project
const filePatterns = ['**/*.tsx', '**/*.jsx']; // This will search for all .tsx and .jsx files

// Function to fix unclosed tags in JSX files
const fixUnclosedTags = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = fileContent;

  // Regex pattern to find unclosed JSX tags (e.g., <h2> without closing </h2>)
  const tagPattern = /<([a-zA-Z0-9]+)([^>]*)>(.*?)<\/\1>|<([a-zA-Z0-9]+)([^>]*)\/>/g;

  // Iterate through matches and check for unclosed tags
  const matches = [...fileContent.matchAll(tagPattern)];

  // Fix unclosed tags by matching and adding the necessary closing tags
  matches.forEach(match => {
    if (!match[3]) {
      // If there's no content between tags (indicating it's unclosed), close the tag
      const unclosedTag = match[0];
      const tagName = match[1] || match[3];
      fixedContent = fixedContent.replace(unclosedTag, `<${tagName}${match[2]}>${match[3]}</${tagName}>`);
    }
  });

  // If the content was modified, write the fixed content back to the file
  if (fixedContent !== fileContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed unclosed tags in: ${filePath}`);
  }
};

// Function to process all files
const processFiles = (patterns) => {
  // Use glob.sync to get all files matching the patterns synchronously
  const files = glob.sync(patterns.join(' '));

  // Log the matched files for debugging
  console.log("Matched files:", files); // This will show the files being processed

  // Loop through each file and attempt to fix unclosed JSX tags
  files.forEach(file => {
    fixUnclosedTags(file);
  });
};

// Run the script
processFiles(filePatterns);
