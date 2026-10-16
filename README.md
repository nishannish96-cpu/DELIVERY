# KudlaDirect: Mangalore Distributor-to-Home Delivery Platform
## 🚀 Production Deployment Guide for Render (render.com)

**KudlaDirect** is a hyper-local e-commerce and batch-fulfillment web platform specifically tailored for **Mangaluru (Dakshina Kannada)**, connecting primary wholesale distributors in **Bunder (Old Port)**, **Baikampady Industrial Estate**, and **Malpe Docks** directly to residential households across Mangalore's core residential neighborhoods (Kadri, Bejai, Urwa, Mannagudda, Kankanady, Bendoorwell, Surathkal, and Derlakatte).

This directory contains the complete, production-ready codebase pre-configured for instant deployment on [Render](https://render.com).

---

## 📁 Repository Structure

```
kudla_direct/
├── index.html            # Standalone, responsive frontend with inlined base64 hero & assets
├── public/
│   └── index.html        # Public web root copy for Render Static Site deployment
├── server.js             # Production Node.js/Express server (serves frontend, APIs & /healthz)
├── package.json          # Node.js project manifest, dependencies, engines, and start script
├── render.yaml           # Render Blueprint (Infrastructure-as-Code) specification
├── Dockerfile            # Container configuration for Render Docker Web Services
├── .dockerignore         # Exclusions for Docker image builds
├── .gitignore            # Git exclusion rules for node_modules and OS artifacts
└── README.md             # Render deployment manual and API documentation
```

---

## 🛠️ Deployment Methods on Render.com

Render offers multiple ways to host **KudlaDirect**. Choose whichever fits your workflow best:

---

### Method 1: Deploy as a Node.js Web Service (Recommended for Full-Stack & APIs)

Running as a **Node.js Web Service** powers both the dynamic frontend storefront and the live backend API endpoints (`/api/products`, `/api/orders`, `/api/dispatch/morning-manifest`, and `/healthz`).

1. **Sign in to Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and log in (via GitHub, GitLab, or email).

2. **Create New Web Service**:
   - Click the **"New +"** button in the top right.
   - Select **"Web Service"**.

3. **Connect Your Git Repository**:
   - Connect your GitHub or GitLab account and select your `kudladirect` repository.

4. **Configure Service Settings**:
   - **Name**: `kudladirect` (or your preferred name)
   - **Region**: `Singapore` (Recommended: lowest latency for India/Karnataka users) or `Oregon`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Instance Type / Plan**: `Free`

5. **Advanced Settings (Health Check & Port)**:
   - Click **"Advanced"**.
   - **Health Check Path**: `/healthz` (Render uses this for zero-downtime health monitoring).
   - Under **Environment Variables**, add:
     - `NODE_ENV` = `production`
     - *(Note: Render automatically injects `PORT=10000`, which `server.js` listens on automatically).*

6. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will clone your repo, execute `npm install`, start `node server.js`, verify the `/healthz` check, and assign a free HTTPS URL (e.g., `https://kudladirect.onrender.com`).

---

### Method 2: Deploy as a Render Static Site (100% Free CDN Hosting)

If you only require the client-side storefront and interactive simulations served via Render’s global high-speed edge CDN:

1. In the Render Dashboard, click **"New +"** $\rightarrow$ **"Static Site"**.
2. Connect your Git repository.
3. Configure the following:
   - **Name**: `kudladirect-store`
   - **Branch**: `main`
   - **Build Command**: Leave blank (no build step required).
   - **Publish Directory**: `./public` (or `./`)
4. **Redirects & Rewrites**:
   - Under **"Redirects / Rewrites"**, add:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
5. Click **"Create Static Site"**. Your site goes live instantly with global SSL!

---

### Method 3: 1-Click Infrastructure Deployment using `render.yaml` (Blueprint)

This repository includes a native `render.yaml` Blueprint file:

1. Push this repository to GitHub or GitLab.
2. In the Render Dashboard, click **"New +"** $\rightarrow$ **"Blueprint"**.
3. Select your repository.
4. Render will read `render.yaml` and automatically configure:
   - `kudladirect-web` (Node.js Web Service on port 10000 with `/healthz` check).
   - `kudladirect-static` (Global CDN Static Site).
5. Click **"Apply"** to launch both services in one click!

---

### Method 4: Deploy using Docker Container

Render supports native Docker containers out of the box:

1. In the Render Dashboard, click **"New +"** $\rightarrow$ **"Web Service"**.
2. Select your repository.
3. For **Runtime**, select **"Docker"**.
4. Render will automatically detect `Dockerfile` in the root directory, build the lightweight Alpine Linux image, expose port 3000, and launch the service.

---

## 💻 Step-by-Step: Initializing & Pushing to GitHub

Run these commands in your local terminal to push this project to a new GitHub repository:

```bash
# 1. Navigate to the project directory
cd kudla_direct

# 2. Initialize git repository
git init

# 3. Add all files
git add .

# 4. Commit changes
git commit -m "Initial commit: KudlaDirect platform with Render deployment config"

# 5. Rename default branch to main
git branch -M main

# 6. Add your GitHub remote (replace with your repository URL)
git remote add origin https://github.com/<your-username>/kudladirect.git

# 7. Push to GitHub
git push -u origin main
```

Once pushed, go to Render and follow **Method 1** or **Method 3** above!

---

## 📡 Live Backend API Reference (When Deployed as Web Service)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the complete responsive KudlaDirect application |
| `GET` | `/healthz` | Health check endpoint for Render zero-downtime monitoring (`{"status": "ok"}`) |
| `GET` | `/api/products` | Returns all verified Mangalore wholesale distributor hubs & metadata |
| `GET` | `/api/orders` | Retrieves active consolidated batch orders |
| `POST` | `/api/orders` | Locks in a customer order for the next morning 5:30 AM Bunder pick |
| `GET` | `/api/dispatch/morning-manifest` | Returns route manifest for electric two-wheeler milk-run fleet riders |

---

## 🧪 Local Testing

To test the application locally before deploying to Render:

```bash
# Install dependencies
npm install

# Start local server
npm start

# Open in browser:
# http://localhost:3000
```
