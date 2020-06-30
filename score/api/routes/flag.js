const express = require("express");
const router = express.Router();

const crypto = require("crypto");

const database = require("./../db");
const userTable = database.userTable;
const flagTable = database.flagTable;

function HMAC_SHA256(key, data) {
  const hash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("base64");
  const hashNoPadding = hash.replace(/={1,2}$/, "");
  return hashNoPadding;
}

function generateFlag(user, service, epoch) {
  const key = process.env.FLAG_SECRET_KEY;

  const base64 = json => {
    const jsonStr = JSON.stringify(json);
    const jsonB64 = Buffer.from(jsonStr).toString("base64");
    const jsonB64NoPadding = jsonB64.replace(/={1,2}$/, "");
    return jsonB64NoPadding;
  };

  const payload = { u: user, s: service, e: epoch };
  const unsignedToken = `${base64(payload)}`;
  const signature = HMAC_SHA256(key, unsignedToken);
  const flag = `FLAG{${unsignedToken}.${signature}}`;

  return flag;
}

function validateFlag(flag) {
  if (flag.slice(0, 5) === "FLAG{" && flag.slice(-1) === "}") {
    const splits = flag.slice(5, -1).split(".");
    const unsignedToken = splits[0];
    const signature = splits[1];

    const key = process.env.FLAG_SECRET_KEY;

    if (HMAC_SHA256(key, unsignedToken) === signature) {
      return 0;
    } else {
      return 1;
    }
  } else {
    return 2;
  }
}

function reverseFlag(flag) {
  if (validateFlag(flag) === 0) {
    const splits = flag.slice(5, -1).split(".");
    let unsignedToken = splits[0];
    if (unsignedToken.length % 4 !== 0) {
      unsignedToken + "=" * (4 - (unsignedToken.length % 4));
    }
    const json = Buffer.from(unsignedToken, "base64");
    const payload = JSON.parse(json);

    return payload;
  } else {
    return 0;
  }
}

async function getFlag(user, service, epoch) {
  const result = await flagTable.findAll({
    where: {
      user: user,
      service: service,
      epoch: epoch
    }
  });
  return result;
}

async function createFlag(user, service, epoch, hunter) {
  const result = await flagTable.create({
    user: user,
    service: service,
    epoch: epoch,
    hunter: hunter
  });
  return result;
}

async function getUser(apikey) {
  const result = await userTable.findAll({
    where: {
      apikey: apikey
    }
  });
  return result;
}

router.post("/generate", (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const user = req.body.user;
    const service = req.body.service;
    const epoch = req.body.epoch;
    const regInt = /^\d+$/;
    if (regInt.test(user) && regInt.test(service) && regInt.test(epoch)) {
      const flag = generateFlag(user, service, epoch);
      return res.json({ flag: flag });
    } else {
      return res.status(401).json({ message: "Request param is wrong" });
    }
  }
});

router.post("/validate", (req, res) => {
  if (req.headers["x-api-key"] != process.env.API_SECRET_KEY) {
    return res.status(401).json({ message: "Authentication denied" });
  } else {
    const flag = req.body.flag;
    const result = validateFlag(flag);
    const payload = reverseFlag(flag);
    return res.json({ result: result, payload: payload });
  }
});

router.post("/submit", async (req, res) => {
  // API Key からユーザーを確認
  const userInfo = await getUser(req.headers["x-api-key"]);
  if (userInfo.length != 1) {
    return res.json({ message: "API key is wrong." });
  }
  // Flag の検証
  const flag = req.body.flag;
  const payload = reverseFlag(flag);
  if (payload == 0) {
    return res.json({ message: "This flag is wrong." });
  }
  // Flag のユーザーが違うか検証
  const name = userInfo[0].id;
  if (name == payload.u) {
    return res.json({ message: "This flag is yours." });
  }
  // Flag がすでに取得されてるか
  const check = await getFlag(payload.u, payload.s, payload.e);
  if (check.length != 0) {
    return res.json({ message: "This flag has already taken." });
  }
  // Flag 取得
  await createFlag(payload.u, payload.s, payload.e, name);
  return res.json({ message: "You get a flag." });
});

module.exports = router;
