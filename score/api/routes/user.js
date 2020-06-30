const express = require("express");
const router = express.Router();

const crypto = require("crypto");

const database = require("./../db");
const userTable = database.userTable;

async function getUser(username) {
  const result = await userTable.findAll({
    where: {
      username: username
    }
  });
  return result;
}

async function createUser(username, ip) {
  const password = crypto.randomBytes(6).toString("hex");
  const apikey = crypto.randomBytes(12).toString("hex");
  const result = await userTable.create({
    username: username,
    password: password,
    apikey: apikey,
    ip: ip
  });
  return result;
}

router.get("/", async (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const data = await userTable.findAll();
    return Promise.resolve(res.json({ data: data }));
  }
});

router.post("/login", async (req, res) => {
  const name = req.body.name;
  const passwd = req.body.passwd;
  const data = await getUser(name);
  if (data.length != 1 || data[0].password != passwd) {
    return res.json({ message: "Username or Password is wrong." });
  } else {
    return res.json({ apikey: data[0].apikey, ip: data[0].ip });
  }
});

router.post("/register", async (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const name = req.body.name;
    const ip = req.body.ip;
    const result = await createUser(name, ip);
    return res.json({ result: result });
  }
});

module.exports = router;
