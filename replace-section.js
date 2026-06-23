// Script untuk replace Friend Request Section
// Run: node replace-section.js

const fs = require('fs');

const filePath = 'src/app/[lang]/teman/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find start and end markers
const startMarker = '{/* Friend Request Section';
const endMarker = '</Column>\n\n            {/* Footer Insight */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find section markers!');
    process.exit(1);
}

// New content from page-new.tsx (without the comment at top)
const newSection = fs.readFileSync('src/app/[lang]/teman/page-new.tsx', 'utf8')
    .split('\n')
    .slice(3) // Skip first 3 lines (comments)
    .join('\n')
    .trim();

// Replace
const before = content.substring(0, startIndex);
const after = content.substring(endIndex);
const newContent = before + newSection + '\n\n            {/* Footer Insight */}' + after.substring(endMarker.length);

// Backup
fs.writeFileSync('src/app/[lang]/teman/page-backup.tsx', content);
console.log('✓ Backup created: page-backup.tsx');

// Write new file
fs.writeFileSync(filePath, newContent);
console.log('✓ Section replaced successfully!');
console.log('✓ File updated: page.tsx');
