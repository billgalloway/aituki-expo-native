# AiTuki Mobile App - Project Structure

This document outlines the complete organization of the AiTuki mobile app project.

## 📁 Directory Structure

```
aituki-mobile/
├── app/                    # Expo Router app structure
│   ├── (auth)/            # Authentication screens
│   └── (tabs)/            # Main tab navigation screens
├── assets/                # Static assets (fonts, images)
├── automations/           # Build and deployment scripts
├── Builds/                # Build artifacts (.aab, .ipa files)
├── components/             # React Native components
├── config/                # Configuration and environment files
├── constants/             # App constants and theme
├── contexts/              # React contexts (Auth, etc.)
├── credentials/           # API keys and authentication files (⚠️ sensitive)
├── data/                  # Data files and mappings
├── help/                  # Documentation and guides
├── hooks/                 # Custom React hooks
├── scripts/               # Utility scripts (SQL, image uploads, etc.)
├── services/              # External service integrations
└── utils/                 # Utility functions
```

## 📂 Folder Descriptions

### `app/` - Expo Router Structure
Contains the app's route structure using Expo Router:
- `(auth)/` - Authentication flow screens
- `(tabs)/` - Main application tabs (Home, Health, Data, etc.)
- `_layout.tsx` - Root layout component
- `modal.tsx` - Modal screens

### `assets/` - Static Assets
- `fonts/` - Custom fonts (MaterialSymbolsRounded.ttf)
- `images/` - App icons, splash screens, and images

### `automations/` - Build & Deployment Scripts
All automation scripts for building and deploying the app:
- Build scripts (Android, iOS)
- Credential setup scripts
- Keystore management scripts
- Deployment automation

**See:** `automations/README.md`

### `Builds/` - Build Artifacts
All compiled build files:
- Android App Bundles (`.aab`)
- iOS App Archives (`.ipa`)
- Development builds
- Bug reports

**See:** `Builds/README.md`

### `components/` - React Components
Reusable React Native components:
- UI components (Header, BottomNavigation)
- Chart components (StepsChart, HeartRateChart, PhysicalScoreChart)
- Feature components (ChatInterface, StressDashboard)

### `config/` - Configuration Files
Environment and configuration files:
- `.env` files with environment variables
- Configuration templates

**See:** `config/README.md`

### `constants/` - App Constants
- `theme.ts` - Design system (colors, typography, spacing)

### `contexts/` - React Contexts
- `AuthContext.tsx` - Authentication state management

### `credentials/` - Credentials (⚠️ SENSITIVE)
API keys and authentication files:
- Apple Sign-In keys (`.p8`)
- Google Play API keys (`.json`)
- Other sensitive credentials

**⚠️ Never commit to version control!**

**See:** `credentials/README.md`

### `data/` - Data Files
Reference data and mappings:
- `IMAGE_MAPPING.txt` - Image asset mappings

**See:** `data/README.md`

### `help/` - Documentation
Comprehensive documentation organized by category:
- `Android/` - Android development guides
- `iOS/` - iOS development guides
- `Integrations/` - Third-party service integrations
- `Deployment/` - Deployment guides
- `General/` - General documentation

**See:** `help/README.md`

### `hooks/` - Custom Hooks
Custom React hooks:
- `useChartData.ts` - Chart data fetching hook
- `useHeroPrograms.ts` - Hero programs hook
- Theme and color scheme hooks

### `scripts/` - Utility Scripts
Utility scripts for various tasks:
- SQL scripts (Supabase table setup)
- Image upload scripts (Figma, Supabase)
- Confluence publishing script

### `services/` - Service Integrations
External service integration code:
- `supabase.ts` - Supabase client setup
- `chartData.ts` - Chart data service
- `contentful.ts` - Contentful CMS integration
- `openai.ts` - OpenAI chat integration

### `utils/` - Utility Functions
Helper functions and utilities:
- `figmaImageHelper.ts` - Figma image utilities
- `testContentful.ts` - Contentful testing utilities

## 📄 Root Files

### Configuration Files
- `app.json` - Expo configuration
- `eas.json` - EAS Build configuration
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

### Documentation
- `README.md` - Main project README
- `PROJECT_STRUCTURE.md` - This file

### Deployment
- `_redirects` - Web deployment redirects (Netlify/Vercel)

## 🔒 Security Notes

Files that should NEVER be committed:
- `credentials/` directory (all files)
- `Builds/` directory (build artifacts)
- `config/*.env` files (environment variables)
- Keystore files (`.jks`, `.p8`)

See `.gitignore` for complete list.

## 📚 Quick Links

- **Documentation:** `help/README.md`
- **Automations:** `automations/README.md`
- **Builds:** `Builds/README.md`
- **Credentials:** `credentials/README.md`
- **Config:** `config/README.md`
- **Data:** `data/README.md`

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up credentials: See `credentials/README.md`
3. Configure environment: See `config/README.md`
4. Read documentation: See `help/README.md`

---

**Last Updated**: January 2025

