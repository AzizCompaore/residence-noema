<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/be8ee41d-996e-42f3-b921-376e18aff944

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Connexion Google en local

1. Dans Google Cloud Console, créez un identifiant OAuth de type **Application Web**.
2. Ajoutez `http://localhost:3000/api/auth/google/callback/` dans les URI de redirection autorisées.
3. Copiez `.env.example` vers `.env`, puis renseignez `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`.
4. Vérifiez que `FRONTEND_URL="http://localhost:3000"`, puis démarrez Django sur le port `8000` et l’application avec `npm run dev`.

En production, remplacez l’URL de callback par l’URL publique HTTPS correspondante et utilisez les mêmes valeurs dans `GOOGLE_REDIRECT_URI` et Google Cloud Console.
