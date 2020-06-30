import datetime
import dotenv
import joblib
import json
import os
import requests
import sys
import threading
import time

from crawl import crawl

dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

API_KEY = os.environ.get("API_SECRET_KEY")
SCORE_URL = "http://" + os.environ.get("API_SERVER_IP") + ":3000/"
SERVICE_ID = int(os.environ.get("SERVICE_ID"))

# 次のEpochまで待つ
def waitNextEpoch():
    try:
        url = SCORE_URL + "epoch"
        res = requests.get(url, timeout=1.0)
        start = json.loads(res.text)["start"]
        epoch = json.loads(res.text)["epoch"]
        interval = json.loads(res.text)["interval"]
        rest = (interval * 60) - (int(time.time()) - start) % (interval * 60)
        print(rest + 10, "seconds wait (Epoch", epoch, "now)")
        time.sleep(rest + 10)
        return interval
    except:
        print("ERROR : API server doesn't work on waitNextEpoch.")
        sys.exit(1)


# Epochを取得
def getEpoch():
    try:
        url = SCORE_URL + "epoch"
        res = requests.get(url, timeout=1.0)
        return json.loads(res.text)["epoch"]
    except:
        print("ERROR : API server doesn't work on getEpoch.")
        sys.exit(1)


# ユーザーのリストを取得
def getUsres():
    try:
        url = SCORE_URL + "user"
        header = {"x-api-key": API_KEY}
        res = requests.get(url, headers=header, timeout=1.0)
        return json.loads(res.text)["data"]
    except:
        print("ERROR : API server doesn't work on getUsres.")
        sys.exit(1)


# フラグの取得
def generateFlag(user, service, epoch):
    try:
        url = SCORE_URL + "flag/generate"
        payload = {"user": user, "service": service, "epoch": epoch}
        header = {"x-api-key": API_KEY}
        res = requests.post(url, headers=header, data=payload, timeout=1.0)
        return json.loads(res.text)["flag"]
    except:
        print("ERROR : API server doesn't work on generateFlag.")
        sys.exit(1)


# サービス生存をスコアサーバーに記録
def sendStatus(user, service, epoch, point):
    try:
        url = SCORE_URL + "status"
        payload = {"user": user, "service": service, "epoch": epoch, "point": point}
        header = {"x-api-key": API_KEY}
        res = requests.post(url, headers=header, data=payload, timeout=1.0)
        if res.status_code == 200:
            return True
        else:
            return False
    except:
        print("ERROR : API server doesn't work on sendStatus.")
        sys.exit(1)


# crawl 関数を実行しスコアを記録
def proc(u, epoch):
    ip = u["ip"]
    user = u["id"]
    service = SERVICE_ID
    flag = generateFlag(user, service, epoch)
    point = crawl(ip, flag)
    print(
        "epoch:{} user:{} service:{} ip:{} is {}pt".format(
            epoch, user, service, ip, point
        )
    )
    sendStatus(user, service, epoch, point)


# 各ユーザーごとに proc 関数を実行
def job():
    epoch = getEpoch()
    print(
        "epoch:{} date:{}".format(
            epoch, datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
        )
    )
    users = getUsres()
    joblib.Parallel(n_jobs=-1)([joblib.delayed(proc)(u, epoch) for u in users])


# job 関数を定期実行
def scheduler(interval, f):
    base_time = time.time()
    next_time = 0
    while True:
        t = threading.Thread(target=f)
        t.start()
        t.join()
        next_time = ((base_time - time.time()) % interval) or interval
        time.sleep(next_time)


if __name__ == "__main__":
    print("### start script ###")
    interval = waitNextEpoch()
    print("### start crawling ###")
    scheduler(interval * 60, job)
