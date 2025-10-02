// app/app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secret mặc định (dùng cho lab). Có thể override bằng env JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// In-memory demo user (CHỈ DÙNG CHO LAB)
const USERS = [
  {
    id: 1,
    username: 'test',
    // hash của 'password123'
    passwordHash: bcrypt.hashSync('password123', 8),
    role: 'user'
  }
];

// Homepage (để tránh "Cannot GET /")
app.get('/', (req, res) => {
  res.send('Hello Sốp 🚀 - App is running!');
});

/**
 * POST /login
 * Request body: { username, password }
 * Success: 200 { token: "<jwt>" }
 * Fail: 400/401
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username/password required' });

  const user = USERS.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ token });
});

/**
 * Middleware kiểm tra Authorization header (Bearer token)
 * Nếu thiếu hoặc invalid => trả 401
 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'Unauthorized' });

  const token = m[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Có thể attach payload cho req để dùng sau
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * GET /profile
 * Nếu không có token => 401 (đúng như test mong đợi)
 * Nếu có token hợp lệ => trả thông tin cơ bản
 */
app.get('/profile', requireAuth, (req, res) => {
  return res.status(200).json({ id: req.user.sub, role: req.user.role });
});

module.exports = app;
