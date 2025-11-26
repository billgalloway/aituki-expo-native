# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Build for Web Deployment

To build the web version for deployment:

```bash
npm run build
```

This will create a `web-build` directory with the static web assets.

## Cloudflare Pages Deployment

For Cloudflare Pages deployment, you **MUST** configure the following settings in your Cloudflare Pages dashboard:

### Required Settings:

1. **Framework preset**: Select "None" or "Other" (do NOT use React or React Static)
2. **Build command**: `npm run build`
3. **Output directory**: `web-build`
4. **Root directory**: (leave empty)
5. **Environment variables**: 
   - `NODE_VERSION`: `22.16.0` (or latest LTS)

### Important Notes:

- **Do NOT** let Cloudflare auto-detect the framework - it will incorrectly try to use `react-static build`
- **Do NOT** set a deploy command - Cloudflare Pages will automatically deploy from the output directory
- The build command (`npm run build`) will run `expo export -p web` which creates the `web-build` directory
- Make sure to manually set the build command to `npm run build` in the Cloudflare Pages dashboard

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
