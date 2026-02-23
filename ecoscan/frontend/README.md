
# 🌿 EcoScan: Smart Waste Sorter

EcoScan is an AI-powered Progressive Web App (PWA) that helps you sort rubbish instantly using your camera.

## 🚀 How to Deploy

### Option 1: Vercel (Easiest & Safest)
Vercel is the best way to host this app because it handles the Gemini API Key securely.
1. Push this code to a **GitHub Repository**.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `ecoscan` repository.
4. In the **Environment Variables** section, add:
   - Key: `API_KEY`
   - Value: `[Your Google Gemini API Key]`
5. Click **Deploy**. Your app will be live on a `.vercel.app` domain!

### Option 2: GitHub Pages
1. Push this code to a GitHub Repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, set the source to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` will automatically build and deploy your site to `https://your-username.github.io/ecoscan/`.
5. **Note:** Since GitHub Pages is static, you must ensure the `API_KEY` is available. For public repos, it is safer to use Vercel to avoid exposing your key.

## 🛠️ Local Setup
1. Clone the repo.
2. Serve the folder using a local server (e.g., `npx serve .`).
3. Open `index.html` in your browser.
4. To use the AI locally, you may need to temporarily paste your API key into the `index.html` script tag (but don't commit it to GitHub!).

## 📜 License
This project is licensed under the MIT License.
