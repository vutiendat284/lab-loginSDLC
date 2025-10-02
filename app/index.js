// app/index.js
const app = require('./app');
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`lab-login app listening on http://localhost:${port}`));
app.get('/', (req, res) => {
  res.send('Hello Sốp, server đang chạy ngon lành!');
});

app.listen(port, () => {
  console.log(`lab-login app listening on http://localhost:${port}`);
});