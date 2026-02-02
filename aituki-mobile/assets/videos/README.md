# Loading screen video

Place `splash-loop.mp4` here to use a custom looping video on the loading screen.

- Use a short clip (about 5–15 seconds) so it loops smoothly.
- For a teal/water look, search “teal abstract loop” or “water surface” on Pixabay or Pexels and export as MP4.
- In `components/LoadingScreen.tsx`, set:

  `VIDEO_SOURCE = require('@/assets/videos/splash-loop.mp4')`

  and remove the `{ uri: '...' }` default.

If no local file is added, the app uses a remote sample video. If that fails (e.g. offline), the screen falls back to the gradient and teardrop logo.
