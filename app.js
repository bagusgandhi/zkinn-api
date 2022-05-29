const express = require('express');
const morgan = require('morgan');

const AppError = require('./Helpers/appError');
const globalErrorHandler = require('./Controllers/errorController');
const userRoutes = require('./Routes/userRoute');
const authRoutes = require('./Routes/authRoute');
const authDoctorRoutes = require('./Routes/authDoctorRoute');

const app = express();

app.use(express.json());

// dev middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// route
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/doctors', authDoctorRoutes);

// route error handler
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
