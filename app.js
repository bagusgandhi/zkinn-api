require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;
const routes = require('./Routes/index');

app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`listen on port: ${port}`);
});
