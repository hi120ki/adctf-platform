const express = require("express");
const router = express.Router();

const database = require("./../db");
const serviceTable = database.serviceTable;

async function getServices() {
  const result = await serviceTable.findAll();
  return result;
}

async function createservice(name) {
  const result = await serviceTable.create({
    name: name
  });
  return result;
}

router.get("/", async (req, res) => {
  const data = await getServices();
  return res.json({ data: data });
});

router.post("/", async (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const name = req.body.name;
    const result = await createservice(name);
    return res.json({ result: result });
  }
});

module.exports = router;
