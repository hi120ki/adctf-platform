create table if not exists users (id int AUTO_INCREMENT NOT NULL PRIMARY KEY, username varchar(255), password varchar(1000));
create table if not exists memos (id int AUTO_INCREMENT NOT NULL PRIMARY KEY, user varchar(255), title varchar(1000), text varchar(1000));
