# Confluence Documentation Setup

This guide explains how to push the help documentation to Confluence.

## Prerequisites

1. **Confluence Access**: You need access to a Confluence instance (cloud or server)
2. **API Token**: Generate a Confluence API token
3. **Space Key**: Know the space key where documentation will be created

## Step 1: Get Confluence API Token

1. Go to your Confluence instance
2. Click on your profile picture → **Account settings**
3. Go to **Security** → **API tokens**
4. Click **Create API token**
5. Give it a label (e.g., "Documentation Upload")
6. Copy the token (you won't be able to see it again)

## Step 2: Find Your Space Key

1. Go to your Confluence space
2. Look at the URL: `https://your-domain.atlassian.net/wiki/spaces/SPACEKEY/...`
3. The `SPACEKEY` is the space key you need

## Step 3: Set Environment Variables

Set the following environment variables:

```bash
export CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"
export CONFLUENCE_EMAIL="your-email@example.com"
export CONFLUENCE_API_TOKEN="your-api-token-here"
export CONFLUENCE_SPACE_KEY="DOC"  # Replace with your space key
```

Or create a `.env` file in the project root (make sure it's in `.gitignore`):

```env
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-api-token-here
CONFLUENCE_SPACE_KEY=DOC
```

## Step 4: Run the Script

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
node scripts/push-to-confluence.js
```

## What the Script Does

1. **Verifies Connection**: Tests connection to Confluence
2. **Creates Main Page**: Creates "AiTuki Mobile App Documentation" as the root page
3. **Creates Category Pages**: Creates pages for each category (Android, iOS, Integrations, Deployment, General)
4. **Uploads Documentation**: Converts markdown files to Confluence format and uploads them
5. **Updates Existing Pages**: If pages already exist, they will be updated instead of duplicated

## Page Structure in Confluence

```
AiTuki Mobile App Documentation (Root)
├── Android
│   ├── Android Quick Start
│   ├── Android Emulator Setup
│   └── ... (all Android docs)
├── iOS
│   ├── Apple Sign-In Setup
│   ├── Apple JWT Generation
│   └── ... (all iOS docs)
├── Integrations
│   ├── Supabase Auth Setup
│   ├── Google Sign-In Setup
│   └── ... (all Integration docs)
├── Deployment
│   ├── Quick Start Publishing
│   ├── First Submission Guide
│   └── ... (all Deployment docs)
└── General
    ├── Authentication Implementation
    ├── Build Steps
    └── ... (all General docs)
```

## Troubleshooting

### Error: "API Error 401: Unauthorized"
- Check that your email and API token are correct
- Make sure the API token hasn't expired
- Verify you have permission to create pages in the space

### Error: "API Error 403: Forbidden"
- You don't have permission to create pages in the space
- Contact your Confluence administrator

### Error: "API Error 404: Not Found"
- Check that the space key is correct
- Verify the Confluence base URL is correct

### Pages Not Updating
- The script updates existing pages by incrementing the version number
- If you see duplicate pages, delete the old ones manually in Confluence

## Advanced: Customize the Script

The script is located at `scripts/push-to-confluence.js`. You can customize:

- **Markdown Conversion**: Modify `markdownToConfluenceStorage()` to improve markdown-to-Confluence conversion
- **Page Structure**: Change the category organization in the `main()` function
- **Content Formatting**: Adjust how content is formatted before upload

## Notes

- The script converts markdown to Confluence's storage format
- Code blocks are converted to Confluence code macros
- Links are preserved
- The script is idempotent - running it multiple times will update existing pages rather than creating duplicates

## Alternative: Manual Upload

If you prefer to upload manually:

1. Export each markdown file
2. Copy the content
3. Create a new page in Confluence
4. Paste the content (Confluence will auto-format markdown)
5. Organize pages in the same structure as the help/ folder



