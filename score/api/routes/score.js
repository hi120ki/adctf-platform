const express = require("express");
const router = express.Router();

const database = require("./../db");
const userTable = database.userTable;
const flagTable = database.flagTable;
const statusTable = database.statusTable;
const serviceTable = database.serviceTable;

async function getUsers() {
  const result = await userTable.findAll();
  return result;
}

async function getUserById(id) {
  const result = await userTable.findAll({
    where: {
      id: id
    }
  });
  return result;
}

async function getServices() {
  const result = await serviceTable.findAll();
  return result;
}

async function getFlags() {
  const result = await flagTable.findAll();
  return result;
}

async function getStatus() {
  const result = await statusTable.findAll();
  return result;
}

async function getStatusById(user) {
  const result = await statusTable.findAll({
    where: {
      user: user
    }
  });
  return result;
}

function getEpoch() {
  const interval = parseInt(process.env.TIME_EPOCH, 10);
  const start = parseInt(process.env.TIME_START, 10);
  const end = parseInt(process.env.TIME_END, 10);
  const now = Math.round(new Date().getTime() / 1000);
  let epoch = 0;
  if (start < now && now < end) {
    epoch = Math.floor((now - start) / interval / 60);
  }
  return epoch;
}

router.get("/", async (req, res) => {
  const point_get_flag = parseInt(process.env.POINT_GET_FLAG, 10);
  const point_lost_flag = parseInt(process.env.POINT_LOST_FLAG, 10);
  const nowEpoch = getEpoch();
  let users = await getUsers();
  let flags = await getFlags();
  let status = await getStatus();
  let services = await getServices();
  let data = [];
  for (let user of users) {
    let s = [];
    for (let service of services) {
      s.push({
        id: service.id,
        name: service.name,
        last: 0,
        health: 0,
        getflag: 0,
        lostflag: 0,
        point: 0
      });
    }
    data.push({
      id: user.id,
      name: user.username,
      point: 0,
      place: 0,
      service: s
    });
  }
  // ポイント計算
  for (let i of data) {
    for (let serv of i.service) {
      for (let flag of flags) {
        // 奪取フラグ
        if (i.id == flag.user && serv.id == flag.service) {
          serv.lostflag += 1;
          serv.point -= point_lost_flag;
          i.point -= point_lost_flag;
        }
        // 獲得フラグ
        if (i.id == flag.hunter && serv.id == flag.service) {
          serv.getflag += 1;
          serv.point += point_get_flag;
          i.point += point_get_flag;
        }
      }
      // サービス維持
      for (let s of status) {
        if (i.id == s.user && serv.id == s.service) {
          // 現在のEpochの情報は除外して点数を加算
          if (s.epoch != nowEpoch) {
            serv.health += s.point;
            serv.point += s.point;
            i.point += s.point;
          }
          // 現在のサービス状況
          if (s.epoch == nowEpoch - 1) {
            serv.last = s.point;
          }
        }
      }
    }
  }
  // 点数順にソート
  data.sort(function(a, b) {
    if (a.point < b.point) {
      return 1;
    }
    if (a.point > b.point) {
      return -1;
    }
  });
  // 順位をつける
  let place = 0;
  for (let d of data) {
    place += 1;
    d.place = place;
  }
  return res.json({ epoch: nowEpoch, data: data });
});

router.get("/status", async (req, res) => {
  const id = req.query.id;
  if (/^\d+$/.test(id)) {
    const status = await getStatusById(id);
    const username = await getUserById(id);
    const services = await getServices();
    const nowEpoch = getEpoch();
    let data = {
      id: id,
      name: username[0].username,
      log: []
    };
    for (let epoch = 0; epoch < nowEpoch; epoch++) {
      let s = {
        epoch: epoch,
        service: []
      };
      for (let serv of services) {
        let result = status.find(function(i) {
          return i.epoch === epoch && i.service === serv.id;
        });
        let add = {};
        if (result == undefined) {
          add = {
            id: serv.id,
            name: serv.name,
            point: null
          };
        } else {
          add = {
            id: serv.id,
            name: serv.name,
            point: result.point
          };
        }
        s.service.push(add);
      }
      data.log.push(s);
    }
    return res.json({ data: data });
  } else {
    return res.status(401).json({ message: "Request param is wrong" });
  }
});

module.exports = router;
