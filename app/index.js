// app/index.js
const app = require('./app');
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`🚀 lab-login app listening on http://localhost:${port}`);
});
