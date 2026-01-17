# Configuration Directory

This directory contains environment and configuration files for the AiTuki mobile app.

## 📁 Contents

- `hero content.env` - Environment variables (renamed from `hero content.env`)

## 🔧 Usage

Environment files should contain:

```bash
# Example .env file structure
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key
EXPO_PUBLIC_CONTENTFUL_SPACE_ID=your-space-id
EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your-access-token
```

## ⚠️ Security Notes

- **Never commit `.env` files to version control**
- Add `.env*` to your `.gitignore`
- Use `.env.example` as a template (without actual secrets)
- Use environment variables in CI/CD pipelines

## 📝 Environment Variables Reference

See `app.json` for environment variable configuration:

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_SUPABASE_URL": "...",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY": "..."
    }
  }
}
```

## 🔄 Loading Environment Variables

The app loads environment variables from:
1. `app.json` → `extra` section
2. Environment files in this directory
3. System environment variables

## 📚 Related Documentation

- Environment setup: See integration guides in `help/Integrations/`
- Supabase setup: `help/Integrations/SUPABASE_AUTH_SETUP.md`
- OpenAI setup: `help/Integrations/OPENAI_SETUP.md`
- Contentful setup: `help/Integrations/CONTENTFUL_SETUP.md`

---

**Last Updated**: January 2025

