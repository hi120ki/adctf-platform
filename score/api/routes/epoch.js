const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const interval = parseInt(process.env.TIME_EPOCH, 10);
  const start = parseInt(process.env.TIME_START, 10);
  const end = parseInt(process.env.TIME_END, 10);
  const now = Math.round(new Date().getTime() / 1000);
  let epoch = 0;
  if (start < now && now < end) {
    epoch = Math.floor((now - start) / interval / 60);
  }
  return res.json({ epoch: epoch, start: start, end: end, interval: interval });
});

module.exports = router;
