#!/usr/bin/env node

/**
 * Push documentation from help/ folder to Confluence
 * 
 * Requirements:
 * - Confluence base URL (e.g., https://your-domain.atlassian.net)
 * - Confluence API token or username/password
 * - Space key where pages will be created
 * 
 * Usage:
 *   node scripts/push-to-confluence.js
 * 
 * Environment variables:
 *   CONFLUENCE_BASE_URL - Your Confluence base URL
 *   CONFLUENCE_EMAIL - Your Confluence email/username
 *   CONFLUENCE_API_TOKEN - Your Confluence API token
 *   CONFLUENCE_SPACE_KEY - The space key where pages will be created
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

try { require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); } catch (_) {}

// Configuration from environment variables
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || '';
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL || '';
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN || '';
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY || '';

// Helper function to make Confluence API requests
function confluenceRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, CONFLUENCE_BASE_URL);
    const auth = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64');

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}\nResponse: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Convert markdown to Confluence storage format
function markdownToConfluenceStorage(markdown) {
  // Basic markdown to Confluence conversion
  // Confluence uses a storage format with macros
  let confluence = markdown;

  // Convert headers
  confluence = confluence.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  confluence = confluence.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  confluence = confluence.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  confluence = confluence.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

  // Convert code blocks
  confluence = confluence.replace(/```(\w+)?\n([\s\S]*?)```/g, '<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">$1</ac:parameter><ac:plain-text-body><![CDATA[$2]]></ac:plain-text-body></ac:structured-macro>');
  confluence = confluence.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert links
  confluence = confluence.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert bold
  confluence = confluence.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  confluence = confluence.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Convert lists
  confluence = confluence.replace(/^\- (.*$)/gim, '<li>$1</li>');
  confluence = confluence.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');

  // Wrap lists in ul/ol tags (simplified)
  confluence = confluence.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Convert line breaks
  confluence = confluence.replace(/\n\n/g, '</p><p>');
  confluence = '<p>' + confluence + '</p>';

  return confluence;
}

// Get or create a page
async function getOrCreatePage(title, parentId, content, spaceKey) {
  try {
    // Try to find existing page
    const searchResult = await confluenceRequest(
      'GET',
      `/wiki/rest/api/content?title=${encodeURIComponent(title)}&spaceKey=${spaceKey}&expand=version`
    );

    if (searchResult.results && searchResult.results.length > 0) {
      const page = searchResult.results[0];
      console.log(`  Found existing page: ${title} (ID: ${page.id})`);

      // Update existing page
      const updateData = {
        version: { number: page.version.number + 1 },
        title: title,
        type: 'page',
        body: {
          storage: {
            value: content,
            representation: 'storage',
          },
        },
      };

      if (parentId) {
        updateData.ancestors = [{ id: parentId }];
      }

      const updated = await confluenceRequest('PUT', `/wiki/rest/api/content/${page.id}`, updateData);
      console.log(`  ✅ Updated page: ${title}`);
      return updated;
    } else {
      // Create new page
      const createData = {
        type: 'page',
        title: title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: content,
            representation: 'storage',
          },
        },
      };

      if (parentId) {
        createData.ancestors = [{ id: parentId }];
      }

      const created = await confluenceRequest('POST', '/wiki/rest/api/content', createData);
      console.log(`  ✅ Created page: ${title} (ID: ${created.id})`);
      return created;
    }
  } catch (error) {
    console.error(`  ❌ Error with page ${title}:`, error.message);
    throw error;
  }
}

// Process a markdown file (titleOverride: optional page title, otherwise derived from filename)
async function processMarkdownFile(filePath, parentId, spaceKey, titleOverride) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return null;
  const fileName = path.basename(filePath, '.md');
  const content = fs.readFileSync(fullPath, 'utf8');
  const confluenceContent = markdownToConfluenceStorage(content);
  const title = titleOverride || fileName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  console.log(`Processing: ${title}`);
  return await getOrCreatePage(title, parentId, confluenceContent, spaceKey);
}

// Main function
async function main() {
  // Validate configuration
  if (!CONFLUENCE_BASE_URL || !CONFLUENCE_EMAIL || !CONFLUENCE_API_TOKEN || !CONFLUENCE_SPACE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   CONFLUENCE_BASE_URL - Your Confluence base URL (e.g., https://your-domain.atlassian.net)');
    console.error('   CONFLUENCE_EMAIL - Your Confluence email/username');
    console.error('   CONFLUENCE_API_TOKEN - Your Confluence API token');
    console.error('   CONFLUENCE_SPACE_KEY - The space key where pages will be created');
    console.error('\nExample:');
    console.error('  export CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"');
    console.error('  export CONFLUENCE_EMAIL="your-email@example.com"');
    console.error('  export CONFLUENCE_API_TOKEN="your-api-token"');
    console.error('  export CONFLUENCE_SPACE_KEY="DOC"');
    console.error('  node scripts/push-to-confluence.js');
    process.exit(1);
  }

  console.log('🚀 Starting Confluence documentation push...\n');
  console.log(`Base URL: ${CONFLUENCE_BASE_URL}`);
  console.log(`Space: ${CONFLUENCE_SPACE_KEY}\n`);

  try {
    // Verify connection
    console.log('Verifying Confluence connection...');
    await confluenceRequest('GET', `/wiki/rest/api/space/${CONFLUENCE_SPACE_KEY}`);
    console.log('✅ Connected to Confluence\n');

    // Create main documentation page
    const helpReadme = fs.readFileSync(path.join(__dirname, '..', 'help', 'README.md'), 'utf8');
    const mainPage = await getOrCreatePage(
      'AiTuki Mobile App Documentation',
      null,
      markdownToConfluenceStorage(helpReadme),
      CONFLUENCE_SPACE_KEY
    );

    // --- Project (root .md in aituki-mobile) ---
    console.log('\n📁 Processing category: Project');
    const projectPage = await getOrCreatePage(
      'Project',
      mainPage.id,
      '<p>Project and HealthKit documentation.</p>',
      CONFLUENCE_SPACE_KEY
    );
    const rootDir = path.join(__dirname, '..');
    const rootMd = fs.readdirSync(rootDir).filter(f => f.endsWith('.md'));
    for (const f of rootMd) {
      await processMarkdownFile(f, projectPage.id, CONFLUENCE_SPACE_KEY);
    }

    // --- Scripts ---
    console.log('\n📁 Processing category: Scripts');
    const scriptsPage = await getOrCreatePage(
      'Scripts',
      mainPage.id,
      '<p>Script and setup guides.</p>',
      CONFLUENCE_SPACE_KEY
    );
    const scriptsDir = path.join(__dirname, '..', 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const scriptsMd = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.md'));
      for (const f of scriptsMd) {
        await processMarkdownFile(`scripts/${f}`, scriptsPage.id, CONFLUENCE_SPACE_KEY);
      }
    }

    // --- Reference (data, config, automations, Builds, tests) ---
    console.log('\n📁 Processing category: Reference');
    const refPage = await getOrCreatePage(
      'Reference',
      mainPage.id,
      '<p>Data, config, automations, and test docs.</p>',
      CONFLUENCE_SPACE_KEY
    );
    const refFiles = [
      { path: 'data/README.md', title: 'Data' },
      { path: 'config/README.md', title: 'Config' },
      { path: 'automations/README.md', title: 'Automations' },
      { path: 'Builds/README.md', title: 'Builds' },
      { path: 'tests/test-oauth-profile-sync-README.md', title: 'Test OAuth Profile Sync' },
    ];
    for (const { path: p, title } of refFiles) {
      await processMarkdownFile(p, refPage.id, CONFLUENCE_SPACE_KEY, title);
    }

    // --- Help categories (Android, iOS, Integrations, Deployment, General) ---
    const categories = ['Android', 'iOS', 'Integrations', 'Deployment', 'General'];

    for (const category of categories) {
      console.log(`\n📁 Processing category: ${category}`);
      const categoryPage = await getOrCreatePage(
        category,
        mainPage.id,
        `<p>Documentation for ${category}</p>`,
        CONFLUENCE_SPACE_KEY
      );

      const categoryDir = path.join(__dirname, '..', 'help', category);
      if (fs.existsSync(categoryDir)) {
        const files = fs.readdirSync(categoryDir)
          .filter(f => f.endsWith('.md') && !f.endsWith('.local'));
        for (const file of files) {
          await processMarkdownFile(
            `help/${category}/${file}`,
            categoryPage.id,
            CONFLUENCE_SPACE_KEY
          );
        }
      }
      // Help root files in General
      if (category === 'General') {
        await processMarkdownFile('help/ORGANIZATION_SUMMARY.md', categoryPage.id, CONFLUENCE_SPACE_KEY);
        await processMarkdownFile('help/CONFLUENCE_SETUP.md', categoryPage.id, CONFLUENCE_SPACE_KEY);
      }
    }

    console.log('\n✅ Documentation push completed!');
    console.log(`\nView your documentation at: ${CONFLUENCE_BASE_URL}/wiki/spaces/${CONFLUENCE_SPACE_KEY}/pages/${mainPage.id}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, markdownToConfluenceStorage, getOrCreatePage };



