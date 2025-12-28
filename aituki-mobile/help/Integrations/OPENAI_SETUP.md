# OpenAI Chat Integration Setup

This guide will help you set up the OpenAI chat interface for the Twin screen.

## Overview

The Twin screen now includes a fully functional AI chat interface that uses OpenAI's GPT models to provide personalized health and wellness guidance. Users can have conversations with their AI digital twin.

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click **"+ Create new secret key"**
5. Give it a name (e.g., "AiTuki Mobile App")
6. Copy the API key immediately (you won't be able to see it again!)
7. Save it securely

**Important:** 
- Keep your API key secret and never commit it to version control
- OpenAI charges based on usage (tokens). Monitor your usage in the [Usage Dashboard](https://platform.openai.com/usage)

## Step 2: Add API Key to app.json

1. Open `app.json` in your project
2. Find the `extra` section
3. Add your OpenAI API key:

```json
"extra": {
  "EXPO_PUBLIC_OPENAI_API_KEY": "sk-your-actual-api-key-here"
}
```

**Note:** Replace `sk-your-actual-api-key-here` with your actual API key from Step 1.

## Step 3: For Local Development (Optional)

If you prefer to use environment variables for local development:

1. Create or edit `.env` file in the `aituki-mobile` directory
2. Add:

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Make sure `.env` is in `.gitignore` (it should already be there)
4. Restart your Expo development server

**Note:** The app will prioritize `app.json` configuration for Expo updates, so make sure to add it there for production builds.

## Step 4: Test the Integration

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app on your device or simulator
3. Navigate to the **Twin** tab
4. Type a message in the chat input (e.g., "What are some good health tips?")
5. Press send or tap the send button
6. You should see the AI response appear

## Configuration

### Customizing the AI Personality

You can customize the AI's behavior by editing the `systemPrompt` in `app/(tabs)/twin.tsx`:

```typescript
const aiSystemPrompt = `Your custom system prompt here. 
This defines how the AI behaves and responds to users.`;
```

### Changing the OpenAI Model

By default, the app uses `gpt-4o-mini` for cost-effectiveness. To change it, edit `services/openai.ts`:

```typescript
model: 'gpt-4o-mini', // Change to 'gpt-4o', 'gpt-3.5-turbo', etc.
```

**Model Options:**
- `gpt-4o-mini` - Fast, cost-effective (recommended)
- `gpt-4o` - More capable, higher cost
- `gpt-3.5-turbo` - Fast, lower cost, less capable

### Adjusting Response Settings

In `services/openai.ts`, you can adjust:

- `temperature` (0-2): Controls randomness. Higher = more creative, lower = more focused
- `max_tokens`: Maximum length of response (default: 500)

## Troubleshooting

### Error: "OpenAI API key is not configured"

**Solution:**
- Make sure you've added `EXPO_PUBLIC_OPENAI_API_KEY` to `app.json`
- Restart your Expo development server after adding the key
- Check that the key is spelled correctly (case-sensitive)

### Error: "Incorrect API key provided"

**Solution:**
- Verify your API key is correct in `app.json`
- Make sure there are no extra spaces or quotes around the key
- Check your OpenAI account has available credits

### API Rate Limits

If you hit rate limits:
- Check your [OpenAI usage dashboard](https://platform.openai.com/usage)
- Consider upgrading your OpenAI plan
- Add rate limiting on your side if needed

### No Response / Slow Responses

**Solutions:**
- Check your internet connection
- Verify your OpenAI account has credits
- Try using `gpt-3.5-turbo` for faster responses
- Check the console for error messages

## Cost Management

OpenAI charges based on:
- **Tokens used** (both input and output)
- **Model selected** (gpt-4o-mini is cheaper than gpt-4o)

**Estimated Costs (gpt-4o-mini):**
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

**Tips to reduce costs:**
- Use `gpt-4o-mini` instead of `gpt-4o`
- Set lower `max_tokens` values
- Implement caching for common queries (future enhancement)
- Add user limits/rate limiting

## Security Best Practices

1. **Never commit API keys to Git**
   - Use environment variables or `app.json` (which should be private)
   - Add `.env` to `.gitignore`

2. **Use API key restrictions** (in OpenAI dashboard)
   - Restrict keys to specific IPs if possible
   - Set usage limits
   - Rotate keys regularly

3. **Monitor usage**
   - Check OpenAI dashboard regularly
   - Set up billing alerts
   - Track API calls in your app

## Next Steps

Once the basic chat is working, you might want to:

1. **Add message persistence** - Save chat history to Supabase
2. **Add user context** - Include user health data in system prompt
3. **Implement voice input** - Use Expo Speech for voice messages
4. **Add message reactions** - Let users react to AI responses
5. **Integrate with goals** - Let AI help create/manage health goals
6. **Add conversation history** - Show previous chat sessions

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your API key is correct
3. Check OpenAI's [status page](https://status.openai.com/)
4. Review OpenAI's [API documentation](https://platform.openai.com/docs)

