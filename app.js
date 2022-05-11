const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./Routes/userRoute');
// const authRoutes = require('./Routes/authRoute');

const app = express();

// dev middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// route
app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/users', authRoutes);

module.exports = app;
