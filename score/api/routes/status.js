const express = require("express");
const router = express.Router();

const database = require("./../db");
const statusTable = database.statusTable;

async function getStatus(user, service, epoch) {
  const result = await statusTable.findAll({
    where: {
      user: user,
      service: service,
      epoch: epoch
    }
  });
  return result;
}

async function createStatus(user, service, epoch, point) {
  const result = await statusTable.create({
    user: user,
    service: service,
    epoch: epoch,
    point: point
  });
  return result;
}

router.post("/", async (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const user = req.body.user;
    const service = req.body.service;
    const epoch = req.body.epoch;
    const point = req.body.point;
    const regInt = /^\d+$/;
    if (
      regInt.test(user) &&
      regInt.test(service) &&
      regInt.test(epoch) &&
      regInt.test(point)
    ) {
      const data = await getStatus(user, service, epoch);
      // status がすでにあるか確認
      if (data.length != 0) {
        return res.json({ message: "Status has already filled" });
      } else {
        await createStatus(user, service, epoch, point);
        return res.json({ message: "success" });
      }
    } else {
      return res.status(401).json({ message: "Request param is wrong" });
    }
  }
});

module.exports = router;
