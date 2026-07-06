# Vaelora

Free, hands-on cybersecurity education built for the AI era. Cyber Shield Academy offers a self-paced curriculum spanning 13 learning phases, interactive terminal labs, real-time challenges, and progress synchronization via secure accounts.

---

## 🚀 Features

- **13 Comprehensive Phases**: Covering everything from fundamental security layers, system internals, OSINT reconnaissance, and network forensics to advanced AI jailbreaking and modern application hacking.
- **Interactive Labs & Flag Submission**: Test your skills in mock containerized situations with real flags and XP rewards.
- **Interactive Terminal HUD**: Live terminal simulation (`CyberTerminal`) for running security modules and interactive chat helper (`PhoenixChat`).
- **Operative Dossiers (User Profiles)**: Track security stats, daily streaks, level progression, and unlock custom cyberpunk achievements.
- **Multi-method Security Gate**: Secure authentication via email/passphrase or Google OAuth.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (SSR meta-framework built on TanStack Router)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) & custom neon-accented cyberpunk styles
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth, Profiles, Stats, Lab Progress)
- **Development Tools**: [Bun](https://bun.sh/) package runner and builder

---

## 🚦 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed locally.

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Toshi-axiom/cyber-shield-academy.git
   cd cyber-shield-academy
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"
   ```

4. **Launch Dev Server**:
   ```bash
   bun dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🌐 OAuth Google Authentication Setup

To make the Google Sign-in function work:

1. **Google Cloud Console**:
   - Create a project at [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **APIs & Services** > **OAuth consent screen**. Create a consent screen, choosing **External** as the user type.
   - Go to **Credentials** > **Create Credentials** > **OAuth client ID** (select *Web Application*).
   - Under **Authorized redirect URIs**, add your Supabase redirect URI:
     `https://gvnkqkvtacxqyooyqyzs.supabase.co/auth/v1/callback`
   - Copy the generated **Client ID** and **Client Secret**.

2. **Supabase Settings**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard).
   - Select your project.
   - Go to **Authentication** > **Providers** > **Google** and switch it to **Enabled**.
   - Paste the **Client ID** and **Client Secret** and click **Save**.

---

## 📁 Repository Structure

```text
cyber-shield-academy/
├── src/
│   ├── assets/             # Images, icons and graphic elements
│   ├── components/         # Reusable UI (Navbar, Footer, StatCard, etc.)
│   ├── data/               # Academy curriculum phases, modules and lectures
│   ├── hooks/              # Custom React hooks (useAuth, useProgress)
│   ├── integrations/       # External clients (Supabase setup)
│   ├── routes/             # TanStack Router page routes (index, dashboard, profile, auth, etc.)
│   └── styles.css          # Main stylesheet and cyberpunk theme config
├── supabase/
│   └── migrations/         # SQL schema initialization and seed data scripts
└── vite.config.ts          # Vite bundle configuration
```

---

## 🛡️ License

This project is licensed under the MIT License.
