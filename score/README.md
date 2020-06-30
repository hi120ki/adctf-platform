# Score

## Setup

- docker

Calculate start and end UNIX times and put them in docker-compose.yml

<https://keisan.casio.jp/exec/system/1526003938>

```
$ nano docker-compose.yml
```

Delete information from the database

```
$ rm -rf mysql/data/*
```

Create an environment variable file of visualizer

```
$ cp visual/.env.example visual/.env
$ nano visual/.env
```

Starting services with docker-compose

```
$ docker-compose build
$ docker-compose up -d
```

Register a problem

```
$ http -f POST "http://localhost:3000/service" X-API-Key:"bbb" name="flask"
$ http -f POST "http://localhost:3000/service" X-API-Key:"bbb" name="pwn"
```

Adding a User

```
$ http -f POST "http://localhost:3000/user/register" X-API-Key:"bbb" name="u1" ip="192.168.0.211"
$ http -f POST "http://localhost:3000/user/register" X-API-Key:"bbb" name="u2" ip="192.168.0.212"
$ http -f POST "http://localhost:3000/user/register" X-API-Key:"bbb" name="u3" ip="192.168.0.213"
```

Get a list of users

```
$ http "http://localhost:3000/user/" X-API-Key:"bbb"
```
