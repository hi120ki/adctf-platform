"""
fetch            1 pt
register         3 pt
login            4 pt
add memo         5 pt
check memo ID    6 pt
check memo text 10 pt
"""

import binascii
import bs4
import os
import requests
import random
import time


def crawl(ip, flag):
    baseurl = "http://" + ip

    app_username = binascii.hexlify(os.urandom(8)).decode()
    app_password = binascii.hexlify(os.urandom(16)).decode()

    with open("./user-agents") as agent_file:
        agents = [x.strip() for x in agent_file.readlines()]
    ua = random.choice(agents)
    headers = {"User-Agent": ua}

    # fetch
    try:
        res = requests.get(baseurl, headers=headers, timeout=1.0)
        if res.status_code == 200:
            pass
        else:
            return 0
    except:
        return 0

    # register
    try:
        payload = {"username": app_username, "password": app_password}
        res = requests.post(
            baseurl + "/register",
            data=payload,
            headers=headers,
            timeout=1.0,
            allow_redirects=False,
        )
        if res.status_code == 302:
            pass
        else:
            return 1
    except:
        return 1

    # login
    try:
        payload = {"username": app_username, "password": app_password}
        res = requests.post(
            baseurl + "/login",
            data=payload,
            headers=headers,
            timeout=1.0,
            allow_redirects=False,
        )
        if res.status_code == 302:
            cookie = res.cookies.get_dict()
            pass
        else:
            return 3
    except:
        return 3

    # add memo
    try:
        payload = {"title": "flag", "text": flag}
        res = requests.post(
            baseurl + "/memo",
            data=payload,
            headers=headers,
            cookies=cookie,
            timeout=1.0,
            allow_redirects=False,
        )
        if res.status_code == 302:
            pass
        else:
            return 4
    except:
        return 4

    time.sleep(30)

    # check memo ID
    try:
        res = requests.get(baseurl, headers=headers, cookies=cookie, timeout=1.0)
        if res.status_code == 200:
            t = bs4.BeautifulSoup(res.text, "html.parser")
            memo = t.find_all(id="memo")
            memo_id = 0
            for i in memo:
                if i.find(id="memo-user").string == app_username:
                    memo_id = i.find(id="memo-id").string
            if memo_id == 0:
                return 5
            else:
                pass
        else:
            return 5
    except:
        return 5

    # check memo text
    try:
        res = requests.get(
            baseurl + "/memo/" + memo_id, headers=headers, cookies=cookie, timeout=1.0
        )
        if res.status_code == 200:
            t = bs4.BeautifulSoup(res.text, "html.parser")
            memo_text = t.find(id="memo-text").string
            if memo_text != flag:
                return 6
            else:
                pass
        else:
            return 6
    except:
        return 6

    return 10
