import app from './app';

const port = 3000;

app.listen(port, (err) => {
  if (err) {
    console.log(`api not listening on port ${port}`);
  } else {
    console.log(`api listening on ${port}`);
  }
});
