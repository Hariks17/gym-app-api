const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Shutting Server Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running in Port ${PORT}`);
});
