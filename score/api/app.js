const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const flagRouter = require("./routes/flag");
const scoreRouter = require("./routes/score");
const statusRouter = require("./routes/status");
const serviceRouter = require("./routes/service");
const epochRouter = require("./routes/epoch");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/flag", flagRouter);
app.use("/score", scoreRouter);
app.use("/status", statusRouter);
app.use("/service", serviceRouter);
app.use("/epoch", epochRouter);

module.exports = app;
