import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Load .env file automatically for raw node scripts
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.endsWith('\r')) value = value.slice(0, -1);
      process.env[match[1]] = value.replace(/^['"](.*)['"]$/, '$1');
    }
  });
}

// Get Environment Variables
// We need Admin API Key to push records to Algolia
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY; 
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

if (!APP_ID || !ADMIN_KEY || !INDEX_NAME) {
  console.error("❌ Missing required Algolia environment variables!");
  console.error("Please ensure NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, and NEXT_PUBLIC_ALGOLIA_INDEX_NAME are set.");
  process.exit(1);
}

const contentDir = path.join(process.cwd(), 'src/content');
let allRecords = [];

// Function to read all files recursively
function getFilesInDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Exclude backups and other non-content folders
      if (file !== 'backups') {
        getFilesInDir(filePath, fileList);
      }
    } else if (filePath.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Map files to Algolia records
const mdxFiles = getFilesInDir(contentDir);

for (const filePath of mdxFiles) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);
  
  // Extract content type and language from path
  // src/content/[type]/[lang]/filename.mdx
  const relativePath = path.relative(contentDir, filePath);
  const parts = relativePath.split(path.sep);
  
  if (parts.length >= 3) {
    const type = parts[0]; // blog, proyek, berbicara
    const lang = parts[1]; // id, en, cn
    const slug = path.basename(filePath, '.mdx');
    
    // Create Algolia record
    const record = {
      objectID: `${lang}-${type}-${slug}`, // Unique ID
      title: data.title || slug,
      summary: data.summary || data.description || '',
      type, // 'blog' | 'proyek' | 'berbicara'
      lang,
      slug,
      path: `/${type}/${slug}`, // E.g. /blog/my-post, localized prefix handled in front-end
      tags: data.tags || data.tech || [],
      publishedAt: data.publishedAt || new Date().toISOString(),
    };
    
    allRecords.push(record);
  }
}

console.log(`Pusihing ${allRecords.length} records to Algolia Index: ${INDEX_NAME}...`);

// Algolia Batch Insert API Document:
// https://www.algolia.com/doc/rest-api/search/#batch-write-operations
const batchUrl = `https://${APP_ID}.algolia.net/1/indexes/${INDEX_NAME}/batch`;
const batchOps = allRecords.map(record => ({
  action: 'addObject',
  body: record
}));

fetch(batchUrl, {
  method: 'POST',
  headers: {
    'X-Algolia-Application-Id': APP_ID,
    'X-Algolia-API-Key': ADMIN_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ requests: batchOps })
})
.then(async (res) => {
  const result = await res.json();
  if (res.ok) {
    console.log(`✅ Successfully synced ${allRecords.length} items to Algolia!`);
    
    // Now update index settings to ensure 'lang' is filterable
    const settingsUrl = `https://${APP_ID}.algolia.net/1/indexes/${INDEX_NAME}/settings`;
    return fetch(settingsUrl, {
      method: 'PUT',
      headers: {
        'X-Algolia-Application-Id': APP_ID,
        'X-Algolia-API-Key': ADMIN_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attributesForFaceting: ['filterOnly(lang)', 'type'],
        searchableAttributes: ['title', 'summary', 'tags', 'slug'],
        customRanking: ['desc(publishedAt)']
      })
    });
  } else {
    console.error(`❌ Failed to sync:`, result);
  }
})
.then(async (res) => {
  if (res) {
    const result = await res.json();
    if (res.ok) {
      console.log(`✅ Index settings updated (lang is now filterable).`);
    } else {
      console.error(`❌ Failed to update index settings:`, result);
    }
  }
})
.catch(err => {
  console.error("❌ Error during Algolia operation:", err);
});
