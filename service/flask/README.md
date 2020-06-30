# Flask

シンプルなメモ保存アプリ

## セットアップ

app/src/main.py の 14 行目の IP アドレスを変更

(web アプリとデータベースを接続)

```
conn = pymysql.connect(
    host="192.168.0.99",
```

docker でサービスを変更

```
$ docker-compose build
$ docker-compose up -d
```

(起動後 30 秒程度は DB が初期化処理で応答しないので注意)

## 操作

- ソースコードをビルド

```
$ docker-compose build
```

- 起動・再起動

```
$ docker-compose up -d
```

- 停止

```
$ docker-compose stop
```

- 削除

```
$ docker-compose rm
```

- ログ閲覧

```
$ docker-compose logs
```

### 操作例

一旦サービスを停止する

```
$ docker-compose stop
```

停止しているサービスを再開する

```
$ docker-compose up -d
```

ソースコードを変更した場合

```
$ docker-compose stop
$ docker-compose rm
$ docker-compose build
$ docker-compose up -d
```

データベースを初期化する場合 (データをすべて消す・スキーマ変更・ユーザー名やパスワードの変更)

```
$ docker-compose stop
$ docker-compose rm
$ rm -rf ./db/data
$ docker-compose up -d
```

## 構成

### データベース

- mysql コマンドで接続

```
# mysql クライアントのインストール
$ sudo apt install -y mysql-client

# mysql に接続
$ mysql -u root -p -h 127.0.0.1 -P 3306 --protocol=tcp
Enter password:
```

```
mysql> use flask_db;
mysql> insert into users (username, password) values ('test', '111111');
mysql> select * from users;

+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | test     | 111111   |
+----+----------+----------+

mysql> insert into memos (user, title, text) values ('test', 'test-memo', 'test{this_is_test_memo}');
mysql> select * from memos;

+----+------+-----------+-------------------------+
| id | user | title     | text                    |
+----+------+-----------+-------------------------+
|  1 | test | test-memo | test{this_is_test_memo} |
+----+------+-----------+-------------------------+
```
