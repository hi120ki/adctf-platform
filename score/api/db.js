const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("database", username, password, {
  host: "db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const userTable = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    apikey: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const flagTable = sequelize.define(
  "flags",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.INTEGER
    },
    service: {
      type: DataTypes.INTEGER
    },
    epoch: {
      type: DataTypes.INTEGER
    },
    hunter: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const statusTable = sequelize.define(
  "status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.INTEGER
    },
    service: {
      type: DataTypes.INTEGER
    },
    epoch: {
      type: DataTypes.INTEGER
    },
    point: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const serviceTable = sequelize.define(
  "services",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = {
  sequelize: sequelize,
  userTable: userTable,
  flagTable: flagTable,
  statusTable: statusTable,
  serviceTable: serviceTable
};
