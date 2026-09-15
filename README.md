<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/df76e35c-b5bd-48c2-b927-ebad3dfac7c8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set `APP_URL` when the app is hosted or used by server-side routes. This is the public base URL of the application, such as `http://localhost:3000` for local runs or the deployed GitHub Pages / Netlify / Vercel URL in production. It is used for self-referential links, API callbacks, and any server-side route that needs to build absolute URLs.
4. Run the app:
   `npm run dev`

> Note: keep `APP_URL` in sync with the environment where the app is actually running. If it changes, update the env file before starting the app or server-side routes that generate links.
