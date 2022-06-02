const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config({ path: './.env' });
// const app = require('./app');

const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

app.listen(process.env.PORT, () => {
  console.log(`listen on port: ${process.env.PORT}`);
});
