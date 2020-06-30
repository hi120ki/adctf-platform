create table if not exists users (
  id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  username varchar(255),
  password varchar(255),
  apikey varchar(255),
  ip  varchar(255)
);

create table if not exists flags (
  id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user int,
  service int,
  epoch int,
  hunter int
);

create table if not exists status (
  id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user int,
  service int,
  epoch int,
  point int
);

create table if not exists services (
  id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name varchar(255)
);
