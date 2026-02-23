# EcoScan — AI-Powered Waste Sorting Assistant

EcoScan uses Gemini 2.5 Flash (via Vertex AI) to identify waste items through your camera and tell you which recycling bin they belong in.

The project has a **React/Vite frontend** and a **Node.js/Express backend** that proxies all Google Cloud API calls.

---

## Running locally

### 1. Prerequisites

| Tool | Purpose |
|------|---------|
| [Node.js 20+](https://nodejs.org/) | Run the frontend dev server and backend |
| [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) | Authenticate against Vertex AI |

### 2. Authenticate with Google Cloud

```bash
gcloud init                              # one-time: select project & region
gcloud auth application-default login   # grant ADC credentials to the backend
```

### 3. Configure backend environment variables

```bash
cd backend
cp .env.local.example .env.local
```

Open `backend/.env.local` and set your values:

```ini
GOOGLE_CLOUD_PROJECT=your-gcp-project-id   # e.g. my-project-123
GOOGLE_CLOUD_LOCATION=us-central1          # Vertex AI region
```

> **Tip:** Make sure the Vertex AI API is enabled in your project:
> `gcloud services enable aiplatform.googleapis.com`

### 4. Install dependencies and start

From the **repository root** (not inside `ecoscan/`):

```bash
cd ecoscan
npm install
npm run dev
```

The app is then available at **http://localhost:5173** (frontend) with the backend proxy running at **http://localhost:5000**.

---

## Deploying to Google Cloud Run

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds a Docker image and deploys to Cloud Run on every push to `main`.

### One-time GCP setup

```bash
# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  aiplatform.googleapis.com

# Create a service account for GitHub Actions
gcloud iam service-accounts create ecoscan-deployer \
  --display-name "EcoScan GitHub Actions deployer"

SA="ecoscan-deployer@$(gcloud config get-value project).iam.gserviceaccount.com"

# Grant the minimum required roles
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:$SA" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:$SA" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:$SA" --role="roles/iam.serviceAccountUser"

# Download a JSON key for the service account
gcloud iam service-accounts keys create sa-key.json --iam-account="$SA"
```

### Configure GitHub repository secrets

In your GitHub repository go to **Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID |
| `GCP_SA_KEY` | Contents of `sa-key.json` (the entire JSON) |

> Delete `sa-key.json` from your machine after adding it to GitHub.

### Deploy

Push (or merge a PR) to `main`. The workflow will:
1. Build a Docker image from `ecoscan/Dockerfile`
2. Push the image to Google Container Registry tagged with the commit SHA
3. Deploy the new revision to Cloud Run (`--allow-unauthenticated`)
4. Inject `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION` as runtime env vars

The public URL is shown in the Cloud Run console and in the workflow run output.

---

## Project structure

```
ecoscan/
├── backend/
│   ├── .env.local.example   # copy to .env.local and fill in your values
│   └── server.js            # Express proxy for Vertex AI API calls
├── frontend/
│   └── ...                  # React + Vite app (TypeScript)
├── Dockerfile               # multi-stage build: Vite build → Node.js image
└── .dockerignore
```

## Environment variables reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLOUD_PROJECT` | ✅ | — | Google Cloud project ID |
| `GOOGLE_CLOUD_LOCATION` | ✅ | — | Vertex AI region (e.g. `us-central1`) |
| `API_BACKEND_PORT` | No | `8080` / `PORT` | Port the backend listens on |
| `API_PAYLOAD_MAX_SIZE` | No | `7mb` | Max request body size |
