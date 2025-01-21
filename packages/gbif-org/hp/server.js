import express from 'express';

const app = express();

app.use(express.static('dist/hp'));

app.get('/dashboard', (_, res) => {
  res.sendFile('hp/dashboard.html', { root: process.cwd() });
});

app.get('*', (_, res) => {
  res.sendFile('hp/index.html', { root: process.cwd() });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
