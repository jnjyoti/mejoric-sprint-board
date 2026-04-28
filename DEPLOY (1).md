# Mejoric Sprint Board — Deployment Guide
# Platform: Railway (recommended) or Render
# Time to live: ~5 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STEP 1 — UPLOAD TO GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://github.com/new
2. Create a repo named: mejoric-sprint-board
3. Upload these files (drag & drop into GitHub):

   mejoric-board/
   ├── server.js
   ├── package.json
   └── public/
       └── index.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STEP 2A — DEPLOY TO RAILWAY (Free)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://railway.app
2. Sign up / log in with GitHub
3. Click "New Project" → "Deploy from GitHub Repo"
4. Select your mejoric-sprint-board repo
5. Railway auto-detects Node.js. No config needed.
6. Click "Generate Domain" → you get:
      https://mejoric-sprint-board.up.railway.app
7. Share this URL with your whole team. Done!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STEP 2B — DEPLOY TO RENDER (Alternative)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://render.com → Sign up free
2. New → Web Service → Connect GitHub repo
3. Settings:
      Build Command:  npm install
      Start Command:  node server.js
      Environment:    Node
4. Deploy → Get URL → Share with team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHY NOT NETLIFY?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Netlify is for STATIC sites only (no server).
Your app needs a live Node.js backend for:
  - Real-time sync (Server-Sent Events)
  - Shared data between 8 team members
  - REST API (add/edit/delete tasks)

Railway and Render support full Node.js servers.
They are free and deploy in under 5 minutes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

mejoric-board/
├── server.js       ← Node.js backend (API + SSE real-time)
├── package.json    ← Dependencies + start command
└── public/
    └── index.html  ← Full frontend (board, standup, AI notes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FEATURES INCLUDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Kanban board — drag & drop tasks
✓ All 8 Mejoric team members pre-loaded
✓ 15 Sprint 1 tasks pre-loaded
✓ Daily standup view per member
✓ Management dashboard (workload, velocity, deadlines)
✓ AI call notes → auto task extraction (Claude AI)
✓ Real-time sync — all 8 members see changes instantly
✓ Add / edit / delete tasks
✓ Create new sprints
✓ Filter by team member
✓ Mobile responsive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NOTE ON DATA PERSISTENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data is stored in server memory. It resets on restart.
For permanent storage, ask for a MongoDB version.
Railway/Render free tier restarts ~every 24h (Render)
or keeps running (Railway with Hobby plan $5/mo).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
