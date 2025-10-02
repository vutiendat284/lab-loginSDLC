// app/app.js
const express = require('express');
const app = express();

// Middleware để parse request body (form, JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage
app.get('/', (req, res) => {
  res.send('Hello Sốp 🚀 - App is running!');
});

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login Page</h1>
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'sop' && password === '123') {
    res.send('Login success ✅');
  } else {
    res.send('Login failed ❌');
  }
});

// Logout
app.get('/logout', (req, res) => {
  res.send('Logged out!');
});

module.exports = app;
