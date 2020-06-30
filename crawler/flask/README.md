# Crawler for Flask web app

## Prod

```
$ cd crawler/flask
$ cp .env.example .env
$ nano .env
$ docker-compose build
$ docker-compose up -d
```

## Dev

```
$ cd crawler/flask
$ cp .env.example .env
$ nano .env
$ python -m venv venv
$ source venv/bin/activate
$ pip install -U pip black pipdeptree ; pip install -r requirements.txt
$ python main.py
```
