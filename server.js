const mongoose = require('mongoose');
const dotenv = require('dotenv');

// dotenv.config({ path: './.env' });
// const app = require('./app');

const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listen on port: ${port}`);
});
