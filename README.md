# Delhi Doors - Digital Growth Agency

Delhi Doors is a premium digital growth agency landing page featuring a highly interactive, responsive 3D Glassmorphism centerpiece, custom-tailored layouts, viewport scroll animations, and a robust back-end lead qualification system.

---

## Technical Architecture

* **Frontend**: React (v18), TypeScript, Vite, TailwindCSS, Framer Motion, and Lucide React.
* **Backend**: Node.js, Express, TypeScript, SQLite3 (database), and the official Resend SDK (email notifications).
* **Integrations**: Resend API for lead qualification alerts.

---

## Directory Structure

```text
├── public/                 # Static assets (including project screenshots)
├── src/                    # Frontend React source code
│   ├── components/         # Reusable UI elements (Buttons, Animations, etc.)
│   ├── sections/           # Landing page sections (Hero, About, Projects, Services, Consultation)
│   ├── App.tsx             # Root page router/controller
│   └── main.tsx            # Application entry point
├── server/                 # Backend Express + TypeScript server
│   ├── db.ts               # SQLite3 database helper & initialization
│   ├── index.ts            # API routes, validations, Resend email logic, rate limiting
│   ├── tsconfig.json       # TypeScript compiler options
│   └── package.json        # Backend package scripts & dependencies
├── package.json            # Root configuration scripts (concurrent runner)
└── .gitignore              # Multi-tier Git exclusion rules
```

---

## Local Setup & Configuration

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```bash
cp server/.env.example server/.env
```
Open [server/.env](server/.env) and populate the values:
```env
PORT=5000
ADMIN_PASSWORD=your_dashboard_password     # Password to log into the Leads Console
RESEND_API_KEY=re_your_api_key             # Your Resend.com API key
NOTIFICATION_EMAIL=your_email@gmail.com    # Gmail address to receive lead notifications
```

### 3. Install Dependencies
From the root project directory, run:
```bash
npm install
npm --prefix server install
```

### 4. Running Locally
Start both the Vite frontend server and Express backend server concurrently:
```bash
npm run dev
```
* **Frontend client**: `http://localhost:5173/`
* **Backend API server**: `http://localhost:5000/`

---

## Admin Leads Console

The application includes a secure admin leads dashboard to manage and update client requests:
1. Access the console by pressing **`Shift + A`** or clicking the hidden **Admin** link in the footer of the Consultation page.
2. Log in using the `ADMIN_PASSWORD` defined in your `server/.env`.
3. Filter leads by status (New Lead, Contacted, Proposal Sent, Closed Won, Closed Lost), search by client name, and download a CSV sheet of all leads.

---

## Deployment Guide

### Frontend (Vercel)

The React client compiles to static HTML/CSS/JS and can be deployed directly to Vercel:

1. Push your code to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `Delhi-Door` repository.
4. **Configuration**:
   * **Framework Preset**: Vite
   * **Root Directory**: `./` (Root folder)
   * **Build Command**: `npm run build:frontend`
   * **Output Directory**: `dist`
5. Click **Deploy**.

*Note: Update the API request URLs in `src/sections/ConsultationPage.tsx` to reference your hosted backend API URL instead of `http://localhost:5000` when deploying to production.*

### Backend (Render / Railway / VPS)

Since the backend uses a local SQLite database (`database.sqlite`) and requires a persistent server instance to run, it should be deployed to a provider supporting persistent storage.

#### Option A: Railway (Recommended)
1. In Railway, click **New Project** -> **GitHub**.
2. Select your `Delhi-Door` repository.
3. In settings, change the **Root Directory** to `server`.
4. Add the following **Environment Variables**:
   * `PORT=5000`
   * `ADMIN_PASSWORD`
   * `RESEND_API_KEY`
   * `NOTIFICATION_EMAIL`
5. In **Volume Settings**, attach a persistent disk mounted to `/app/server/database.sqlite` (or configure a MySQL/PostgreSQL addon and update `server/db.ts` to use it instead of SQLite).

#### Option B: Render.com
1. Create a new **Web Service** in Render.
2. Connect your GitHub repository.
3. Configure the service:
   * **Build Command**: `npm run build`
   * **Start Command**: `node dist/index.js`
   * **Root Directory**: `server`
4. Add your `.env` variables under **Environment**.
5. Create a **Disk** under the service settings to preserve the SQLite database file across deploys.

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
