<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4a4f1676-b4c0-43a5-a587-8c24ea2744fc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included for automatic deployment to **GitHub Pages**.

1. Commit  and push your code to the `main` branch.
2. In your repository on GitHub, go to **Settings > Pages**.
3. Set the **Source** to **GitHub Actions**.
4. The deployment will start automatically upon pushing to the `main` branch.

*(Note: If you are deploying to a repository site rather than a user site (e.g., `https://<username>.github.io/<repo-name>/`), make sure to add `base: '/<repo-name>/'` in your `vite.config.ts`)*
