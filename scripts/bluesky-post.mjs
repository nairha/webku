import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BskyAgent } from '@atproto/api';

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

// Bluesky Credentials
const BSKY_IDENTIFIER = process.env.BLUESKY_IDENTIFIER; // e.g., davingm.com or email
const BSKY_PASSWORD = process.env.BLUESKY_PASSWORD;     // App Password (NOT your main password)
const BASE_URL = 'https://davingm.com'; // Change this to your actual base URL if different

if (!BSKY_IDENTIFIER || !BSKY_PASSWORD) {
  console.error("❌ Missing Bluesky credentials! Please set BLUESKY_IDENTIFIER and BLUESKY_PASSWORD in .env");
  process.exit(1);
}

const contentDir = path.join(process.cwd(), 'src/content/blog');
const locales = ['id', 'en', 'zh'];

// 1. Get all blog posts from local MDX files
function getPosts() {
  const allPosts = [];
  locales.forEach(lang => {
    const langDir = path.join(contentDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir).filter(f => f.endsWith('.mdx'));
      files.forEach(file => {
        const filePath = path.join(langDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        const slug = path.basename(file, '.mdx');
        
        allPosts.push({
          title: data.title,
          summary: data.summary || data.description || '',
          publishedAt: data.publishedAt,
          lang,
          slug,
          url: `${BASE_URL}/${lang}/blog/${slug}`,
          image: data.image
        });
      });
    }
  });
  
  // Sort by date descending (newest first)
  return allPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

async function run() {
  console.log("🚀 Starting Bluesky Auto-Post script...");
  
  const posts = getPosts();
  if (posts.length === 0) {
    console.log("📭 No posts found.");
    return;
  }

  // Increase this number if you want to backpost older articles
  // Using 50 to catch more historical posts
  const latestPosts = posts.slice(0, 50);
  
  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: BSKY_IDENTIFIER, password: BSKY_PASSWORD });
    console.log("✅ Logged in to Bluesky as:", BSKY_IDENTIFIER);

    // Fetch our latest posts from Bluesky to check for duplicates (increased limit for safety)
    const profile = await agent.getAuthorFeed({ actor: BSKY_IDENTIFIER, limit: 100 });
    const existingLinks = profile.data.feed.map(item => {
      // Check for link in text or in external embed
      const text = item.post.record.text || '';
      const externalUri = item.post.embed?.external?.uri || '';
      return { text, externalUri };
    });

    for (const post of latestPosts) {
      const isAlreadyPosted = existingLinks.some(e => 
        e.text.includes(post.url) || e.externalUri === post.url
      );

      if (!isAlreadyPosted) {
        console.log(`🆕 Found new post: "${post.title}" (${post.lang})`);
        console.log(`📤 Posting to Bluesky...`);

        const postHeader = `[${post.lang.toUpperCase()}] ${post.title}\n\n`;
        const postFooter = `\n\nRead more: ${post.url}`;
        
        // Bluesky has a 300 character limit
        const maxSummaryLength = 300 - postHeader.length - postFooter.length - 3; // -3 for ellipsis
        let displaySummary = post.summary;
        
        if (displaySummary.length > maxSummaryLength) {
          displaySummary = displaySummary.substring(0, maxSummaryLength) + '...';
        }

        const postText = `${postHeader}${displaySummary}${postFooter}`;
        
        // Prepare the embed link card
        const embed = {
          $type: 'app.bsky.embed.external',
          external: {
            uri: post.url,
            title: post.title,
            description: post.summary,
          }
        };

        // Optional: Add image to embed if available
        // Note: Real image uploading requires more complex logic to get blob. 
        // For now, we'll just post the link card.

        await agent.post({
          text: postText,
          embed: embed,
          langs: [post.lang === 'zh' ? 'zh-CN' : post.lang],
          createdAt: new Date().toISOString()
        });

        console.log(`✅ Successfully posted: ${post.title}`);
        // Wait a bit between posts if there are multiple
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`✔ Post already exists on Bluesky: "${post.title}"`);
      }
    }

    console.log("🏁 Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Details:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

run();
