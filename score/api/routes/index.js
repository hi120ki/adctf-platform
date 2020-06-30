const express = require("express");
const router = express.Router();

const database = require("./../db");
const sequelize = database.sequelize;

router.get("/", (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
      res.json({ status: "Connection has been established successfully." });
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
      res.json({ status: "Unable to connect to the database" });
    });
});

module.exports = router;
