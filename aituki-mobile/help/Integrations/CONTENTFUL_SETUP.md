# Contentful Integration Setup Guide

This guide will help you set up Contentful to manage hero card content for the AiTuki mobile app.

## Prerequisites

- A Contentful account (sign up at https://www.contentful.com/)
- Node.js and npm installed
- Expo CLI installed

## Step 1: Create a Contentful Space

1. Log in to your Contentful account
2. Create a new space or use an existing one
3. Note your **Space ID** (found in Settings → General settings)

## Step 2: Create a Content Delivery API Token

1. Go to Settings → API keys
2. Click "Add API key"
3. Name it "Mobile App" or similar
4. Copy the **Content Delivery API - access token**

## Step 3: Create the Hero Program Content Type

1. In Contentful, go to Content model
2. Click "Add content type"
3. Name it "Hero Program" with API ID: `heroProgram`
4. Add the following fields:

### Fields to Add:

1. **Title** (Short text)
   - Field ID: `title`
   - Required: Yes
   - Help text: "The title of the hero program"

2. **Duration** (Number - Integer)
   - Field ID: `duration`
   - Required: Yes
   - Help text: "Number of weeks for the program"

3. **Duration Days** (Number - Integer)
   - Field ID: `durationDays`
   - Required: Yes
   - Help text: "Current day number in the program (e.g., Day 15)"

4. **Minutes Per Week** (Number - Integer)
   - Field ID: `minPerWeek`
   - Required: Yes
   - Help text: "Time per week in minutes (e.g., 40 min pw)"

5. **Image** (Media - Single asset)
   - Field ID: `image`
   - Required: Yes
   - Help text: "Hero card image"
   - Allowed media types: Images only

   OR

3. **Image URL** (Short text) - Alternative if you want to use external URLs
   - Field ID: `imageUrl`
   - Required: No
   - Help text: "External image URL (used if image asset is not provided)"

4. Click "Save" to create the content type

## Step 4: Add Content

1. Go to Content → Add entry
2. Select "Hero Program"
3. Fill in:
   - Title: e.g., "Yoga and Pilates"
   - Duration: e.g., `8` (number of weeks)
   - Duration Days: e.g., `15` (current day)
   - Minutes Per Week: e.g., `40` (minutes per week)
   - Image: Upload an image or provide an Image URL
4. Click "Publish"
5. Repeat for all hero programs you want to display

### Optional: Article content type (Articles list – Figma 668-20891)

To power the Articles list on the Home screen from Contentful:

1. In Content model, add a content type with API ID: `article`
2. Add fields: **Title** (Short text, `title`), **Slug** (Short text, `slug`), **Excerpt** (Long text, `excerpt`), **Body** (Long text, `body`), **Image** (Media, `image`) or **Image URL** (Short text, `imageUrl`)
3. Publish the content type and add entries. The app will show these in the Articles list; if the type is missing or empty, it falls back to default articles.

## Step 5: Configure Environment Variables

1. Create a `.env` file in the `aituki-mobile` directory (if it doesn't exist)
2. Add the following variables:

```env
EXPO_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

3. Replace `your_space_id_here` with your Space ID from Step 1
4. Replace `your_access_token_here` with your Access Token from Step 2

**Important:** 
- The `EXPO_PUBLIC_` prefix is required for Expo to expose these variables to your app
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file

## Step 6: Install Dependencies

The Contentful SDK should already be installed. If not, run:

```bash
npm install contentful
```

## Step 7: Test the Integration

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app on your device or simulator
3. Navigate to the Home screen
4. You should see your hero programs loaded from Contentful

## Troubleshooting

### Contentful not configured warning
- Make sure your `.env` file exists and contains the correct variables
- Restart your Expo development server after adding/changing environment variables
- Verify the variable names start with `EXPO_PUBLIC_`

### No hero programs showing
- Check that you've published entries in Contentful (not just saved as drafts)
- Verify the content type API ID is exactly `heroProgram`
- Check the browser/device console for error messages
- The app will fall back to default hero programs if Contentful fails

### Images not loading
- If using Contentful assets: Make sure images are published
- If using external URLs: Verify the URLs are accessible
- Check the console for image loading errors

### TypeScript errors
- Make sure all dependencies are installed: `npm install`
- Restart your TypeScript server in your IDE

## Content Type Schema Reference

```json
{
  "sys": {
    "id": "heroProgram"
  },
  "name": "Hero Program",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "required": true
    },
    {
      "id": "duration",
      "name": "Duration",
      "type": "Integer",
      "required": true
    },
    {
      "id": "durationDays",
      "name": "Duration Days",
      "type": "Integer",
      "required": true
    },
    {
      "id": "minPerWeek",
      "name": "Minutes Per Week",
      "type": "Integer",
      "required": true
    },
    {
      "id": "image",
      "name": "Image",
      "type": "Link",
      "linkType": "Asset",
      "required": true,
      "validations": [
        {
          "linkMimetypeGroup": ["image"]
        }
      ]
    }
  ]
}
```

## API Reference

### useHeroPrograms Hook

```typescript
const { heroPrograms, loading, error } = useHeroPrograms();
```

- `heroPrograms`: Array of hero program objects
- `loading`: Boolean indicating if data is being fetched
- `error`: Error object if fetch failed

### HeroProgram Interface

```typescript
interface HeroProgram {
  title: string;
  duration: string;
  image: string;
  sys: {
    id: string;
  };
}
```

## Next Steps

- Consider adding more fields to the Hero Program content type (e.g., description, category, link)
- Set up content preview for draft content
- Add caching to reduce API calls
- Implement refresh functionality for pulling latest content

