FROM python:3.7-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install -U pip

RUN pip install -r requirements.txt

COPY . .
