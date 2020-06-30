FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.8

RUN pip install -U pip

RUN pip install -U flask PyMySQL

COPY ./ /app
