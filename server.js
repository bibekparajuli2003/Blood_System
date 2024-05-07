const app = require("./index");
const PORT = process.env.PORT || 3000;

//for handling uncaughtexception error
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught exception occured shutting down");

  process.exit(1);
});

//initializign config file
const dotenv = require("dotenv");
const { sequelize } = require("./model");
const { QueryTypes } = require("sequelize");
dotenv.config();

const server = app.listen(PORT, async () => {
  await sequelize.query(
    `CREATE TABLE  IF NOT EXISTS ambulances(id INT NOT NUll AUTO_INCREMENT PRIMARY KEY,hospitalId VARCHAR(255) REFERENCES bloodGroups ON DELETE CASCADE ON UPDATE CASCADE ,name VARCHAR(255),phone VARCHAR(255),province VARCHAR(255),district VARCHAR(255),localLevel VARCHAR(255),createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    {
      type: QueryTypes.CREATE,
    }
  );
  console.log("server has started at port,", PORT);
});

//for unhandledrejection error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejection occured shutting down");
  server.close(() => {
    process.exit(1);
  });
});