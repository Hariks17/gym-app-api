const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const { default: mongoose } = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception Shutting Server Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_DB_URL.replace(
  '<password>',
  process.env.MONGO_DB_PASSWORD,
);
mongoose
  .connect(URL)
  .then(() => {
    console.log('DB Connect Sucessfully');
  })
  .catch((err) => {
    console.error(`DB Connection failed with error ${err}`);
  });
const server = app.listen(PORT, () => {
  console.log(`Server running in Port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Uncaught Rejection Shutting Server Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
