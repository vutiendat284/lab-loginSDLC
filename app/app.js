// app/app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// In-memory demo user (CHỈ DÙNG CHO LAB)
const USERS = [
  { id: 1, username: 'test', passwordHash: bcrypt.hashSync('password123', 8), role: 'user' }
];

app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username/password required' });

  const user = USERS.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/profile', (req, res) => {
  const a = req.headers.authorization || '';
  const m = a.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    res.json({ id: payload.sub, role: payload.role });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = app;
