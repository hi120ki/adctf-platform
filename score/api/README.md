# Score API server

<http://localhost:3000/>

## API

- epoch

```
http "http://localhost:3000/epoch"
```

- flag

```
http "http://localhost:3000/flag" X-API-Key:"fzLq1xxUw2uR"
http -f POST "http://localhost:3000/flag/generate" X-API-Key:"fzLq1xxUw2uR" user="3" service="1" epoch="12"
http -f POST "http://localhost:3000/flag/validate" X-API-Key:"fzLq1xxUw2uR" flag="FLAG{eyJ1Ijo}"
```

```
http -f POST "http://localhost:3000/flag/submit" X-API-Key:"d3675f8856a0be07db5db72d" flag="FLAG{eyJ1Ijo}"
```

- index

```
http "http://localhost:3000/"
```

- score

```
http "http://localhost:3000/score"
http "http://localhost:3000/score/status/?id=2"
```

- service

```
http "http://localhost:3000/service"
http -f POST "http://localhost:3000/service" X-API-Key:"fzLq1xxUw2uR" name="pwn"
```

- status

```
http -f POST "http://localhost:3000/status" X-API-Key:"fzLq1xxUw2uR" user="1" service="1" epoch="2" point="10"
```

- user

```
http "http://localhost:3000/user" X-API-Key:"fzLq1xxUw2uR"
```

```
http -f POST "http://localhost:3000/user/register" X-API-Key:"fzLq1xxUw2uR" name="saru" ip="192.168.18.3"
http -f POST "http://localhost:3000/user/register" X-API-Key:"fzLq1xxUw2uR" name="laika" ip="192.168.18.4"
http -f POST "http://localhost:3000/user/register" X-API-Key:"fzLq1xxUw2uR" name="taka" ip="192.168.18.5"
http -f POST "http://localhost:3000/user/register" X-API-Key:"fzLq1xxUw2uR" name="okmt" ip="192.168.18.6"
```

```
http -f POST "http://localhost:3000/user/login" name="saru" passwd="cdjkcdks"
```

## Flag

```
FLAG{eyJuYW1lIjoxLCJzZXJ2aWNlIjoxLCJlcG9jaCI6MTB9.tK68K6J4TtUSdNZpMrdmbQa9xbtLE8AKrHXldml8+rE=}

[user] _ [service] _ [epoch] _ [sign]

{"user":1,"service":1,"epoch":10}
```

<https://qiita.com/Naoto9282/items/8427918564400968bd2b#jwt%E3%81%AE%E6%A4%9C%E8%A8%BC>
