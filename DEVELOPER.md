# Developer Guide

## Prerequisites

- Node.js 20+
- npm 10+
- macOS (the app is macOS-only for now)

## Getting started

```bash
git clone https://github.com/tessellate-digital/open-routines-desktop
cd open-routines-desktop
npm install
```

Create a `.env` file at the root (see [Environment variables](#environment-variables) below), then start the app:

```bash
npm start
```

To run the marketing website locally:

```bash
npm run website
```

## Environment variables

Create a `.env` file at the root of the repository. It is gitignored and should never be committed.

```
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
```

These are only required if you want Gmail integration to work. The rest of the app runs fine without them.

### Providing your own Google OAuth credentials

The Gmail integration uses OAuth 2.0 with the `gmail.readonly` scope. To set up your own credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project (or use an existing one).
2. Enable the **Gmail API** under *APIs & Services → Library*.
3. Go to *APIs & Services → Credentials* and create an **OAuth 2.0 Client ID**.
   - Application type: **Desktop app**
4. Copy the **Client ID** and **Client Secret** into your `.env` file.

Google's official guide: [Using OAuth 2.0 for Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Electron app in development mode |
| `npm run website` | Start the marketing website dev server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Lint the source |
| `npm run test` | Run all tests (frontend + backend) |
| `npm run make` | Package the app for distribution |
| `npm run pipeline-checks` | Full CI check (typecheck, lint, format, test) |
