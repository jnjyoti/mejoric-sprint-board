const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

let STATE = {
  sprint: "Sprint 1 — May Launch",
  tasks: [
    {id:"MEJ-001",t:"Mentor platform go-live 15 May",d:"All IT mentor profiles live and bookable",s:"inprogress",p:"high",a:"vinod",tags:["Platform"],due:"2026-05-15",ai:false},
    {id:"MEJ-002",t:"Onboard 8 Emotional Mentors",d:"Complete Dr. Madhumati alignment interviews",s:"inprogress",p:"high",a:"madhu",tags:["Onboarding"],due:"2026-05-20",ai:false},
    {id:"MEJ-003",t:"Academy Batch 1 — 12 May launch",d:"38 interns enrolled. Confirm curriculum.",s:"todo",p:"high",a:"madhu",tags:["Academy"],due:"2026-05-12",ai:false},
    {id:"MEJ-004",t:"DPIIT Startup India recognition",d:"Apply at startupindia.gov.in",s:"todo",p:"high",a:"ismail",tags:["Legal"],due:"2026-05-10",ai:false},
    {id:"MEJ-005",t:"Submit pitch to Inflection Point",d:"Online application + pitch deck v3",s:"todo",p:"high",a:"jyoti",tags:["Funding"],due:"2026-05-08",ai:false},
    {id:"MEJ-006",t:"Instagram 14-day content calendar",d:"28 posts — 2/day Barkha executing",s:"inprogress",p:"med",a:"barkha",tags:["Marketing"],due:"2026-05-14",ai:false},
    {id:"MEJ-007",t:"Mate Voice Challenge Week 2",d:"Post window tomorrow 11AM–11PM",s:"todo",p:"med",a:"richa",tags:["Community"],due:"2026-05-05",ai:false},
    {id:"MEJ-008",t:"Mentor candidate tracker setup",d:"Share with Ritika and Dr. Madhumati",s:"done",p:"med",a:"jyoti",tags:["Operations"],due:"2026-05-03",ai:false},
    {id:"MEJ-009",t:"Professional Mentor form review",d:"Ritika to review all 7 sections",s:"inprogress",p:"med",a:"ritika",tags:["Onboarding"],due:"2026-05-07",ai:false},
    {id:"MEJ-010",t:"T&C — Ismail review + CIN number",d:"Add CIN and Grievance Officer name",s:"todo",p:"high",a:"ismail",tags:["Legal"],due:"2026-05-06",ai:false},
    {id:"MEJ-011",t:"Rs.199 first session pricing live",d:"Confirmed live on platform",s:"done",p:"high",a:"vinod",tags:["Platform"],due:"2026-05-01",ai:false},
    {id:"MEJ-012",t:"UTM links — 13 Marketing Mates",d:"13 individual links for Quora/Reddit",s:"todo",p:"med",a:"vinod",tags:["Marketing"],due:"2026-05-08",ai:false},
    {id:"MEJ-013",t:"Co-founder tech brief on LinkedIn",d:"Post from Jyoti personal account",s:"done",p:"high",a:"jyoti",tags:["Hiring"],due:"2026-05-02",ai:false},
    {id:"MEJ-014",t:"IT Mentor Phase 1 — start outreach",d:"Ritika begins LinkedIn DMs, 4 domains",s:"todo",p:"med",a:"ritika",tags:["IT Mentors"],due:"2026-05-10",ai:false},
    {id:"MEJ-015",t:"Mandatory consent screen — 12 boxes",d:"Build pre-session consent screen",s:"blocked",p:"high",a:"vinod",tags:["Platform","Legal"],due:"2026-05-12",ai:false},
  ],
  notes: [
    {id:"n1",date:"2026-04-28",type:"Daily Scrum",body:"Jyoti: Pitch deck v3 sent to 3 investors.\nRicha: 14 Mates live, 9 more onboarding.\nVinod: Rs.199 pricing confirmed live.\nRitika: 6 professional mentors shortlisted.\nBlocker: Consent screen pending Vinod bandwidth.",aiTasks:[]},
  ],
  standups: {},
  nextId: 16,
};

let clients = [];

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients = clients.filter(c => {
    try { c.write(msg); return true; }
    catch { return false; }
  });
}

app.get('/health', (req, res) => res.json({ ok: true, clients: clients.length, tasks: STATE.tasks.length }));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  clients.push(res);
  res.write(`event: state\ndata: ${JSON.stringify(STATE)}\n\n`);
  const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch { clearInterval(ping); } }, 25000);
  req.on('close', () => { clearInterval(ping); clients = clients.filter(c => c !== res); });
});

app.get('/api/state', (req, res) => res.json(STATE));

app.post('/api/tasks', (req, res) => {
  const task = { ...req.body, id: `MEJ-${String(STATE.nextId).padStart(3,'0')}` };
  STATE.nextId++;
  STATE.tasks.push(task);
  broadcast('update', STATE);
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const idx = STATE.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  STATE.tasks[idx] = { ...STATE.tasks[idx], ...req.body };
  broadcast('update', STATE);
  res.json(STATE.tasks[idx]);
});

app.delete('/api/tasks/:id', (req, res) => {
  STATE.tasks = STATE.tasks.filter(t => t.id !== req.params.id);
  broadcast('update', STATE);
  res.json({ ok: true });
});

app.post('/api/tasks/bulk', (req, res) => {
  const created = req.body.tasks.map(task => {
    const t = { ...task, id: `MEJ-${String(STATE.nextId).padStart(3,'0')}` };
    STATE.nextId++;
    STATE.tasks.push(t);
    return t;
  });
  broadcast('update', STATE);
  res.json(created);
});

app.post('/api/notes', (req, res) => {
  const note = { ...req.body, id: `n${Date.now()}` };
  STATE.notes.push(note);
  broadcast('update', STATE);
  res.json(note);
});

app.put('/api/sprint', (req, res) => {
  STATE.sprint = req.body.name;
  broadcast('update', STATE);
  res.json({ sprint: STATE.sprint });
});

app.put('/api/standups/:memberId', (req, res) => {
  STATE.standups[req.params.memberId] = req.body;
  broadcast('update', STATE);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mejoric Board running at http://localhost:${PORT}`));
