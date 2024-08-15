const express = require('express');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
app.use(express.json());
app.get('/', authMiddleware, (req, res) => {
  res.send('App Running');
});

app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);
module.exports = app;
