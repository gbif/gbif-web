import express from 'express';

const PORT = parseInt(process.env.PORT || 3000);

const app = express();

app.use(express.static('dist/hp'));

app.get('/dashboard', (_, res) => {
  res.sendFile('hp/dashboard.html', { root: process.cwd() });
});

app.get('/:locale/dashboard', (_, res) => {
  res.sendFile('hp/dashboard.html', { root: process.cwd() });
});

app.get('*', (_, res) => {
  res.sendFile('hp/index.html', { root: process.cwd() });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
