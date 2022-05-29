const express = require('express');
const morgan = require('morgan');

const AppError = require('./Helpers/appError');
const globalErrorHandler = require('./Controllers/errorController');
const userRoutes = require('./Routes/userRoute');
const authRoutes = require('./Routes/authRoute');
const authDoctorRoutes = require('./Routes/authDoctorRoute');
const diseaseRoutes = require('./Routes/diseaseRoute');
const doctorRoutes = require('./Routes/doctorRoute');

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
app.use('/api/v1/users', diseaseRoutes);
app.use('/api/v1/doctors', authDoctorRoutes);
app.use('/api/v1/doctors', doctorRoutes);

// route error handler
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
