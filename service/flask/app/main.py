from flask import *
import pymysql.cursors

# flaskの初期化
app = Flask(__name__)

# session の秘密鍵
app.secret_key = "sugoi_himitu"


# SQLを実行する関数
def ExecuteQuery(sql):
    conn = pymysql.connect(
        host="172.29.149.60",
        user="root",
        password="root",
        db="flask_db",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql)
            conn.commit()
            result = cursor.fetchall()
    finally:
        conn.close()
        return result


# トップページ
# app.route に methods の指定がなければ GET です
@app.route("/")
def index():
    # ログイン済み
    if session.get("login"):
        username = session["username"]
        memos = ExecuteQuery("SELECT id, user, title FROM memos")
        users = ExecuteQuery("SELECT username FROM users")
        return render_template(
            "index.tmpl", username=username, memos=memos, users=users
        )
    # ログインしてない場合はログインページへ
    else:
        return redirect("/login")


# メモの内容閲覧
# memo/1 にアクセスが来ると memo_id=1 として処理する
@app.route("/memo/<memo_id>")
def memo_page(memo_id):
    # ログイン済み
    if session.get("login"):
        # ログインしているユーザーの指定されたidのメモを取得
        username = session["username"]
        memo = ExecuteQuery(
            "SELECT * FROM memos where user = '{}' and id = '{}'".format(
                username, memo_id
            )
        )
        if len(memo) == 0:
            # 該当するメモが存在しなかったのでエラーページを返す
            message = "Error! There are no memos that you can see."
            return render_template("memo.tmpl", username=username, message=message)
        else:
            return render_template("memo.tmpl", username=username, memo=memo)
    # ログインしてない場合はログインページへ
    else:
        return redirect("/login")


# メモの追加
@app.route("/memo", methods=["POST"])
def memo():
    # ログイン済み
    if session.get("login"):
        username = session["username"]
        # リクエストから title と text を取得
        title = request.form["title"]
        text = request.form["text"]
        result = ExecuteQuery(
            "insert into memos (user, title, text) values ('{}', '{}', '{}')".format(
                username, title, text
            )
        )
        return redirect("/")
    # ログインしてない場合はログインページへ
    else:
        return redirect("/login")


# ログインページ
@app.route("/login")
def login_page():
    return render_template("login.tmpl")


# ログイン処理
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    result = ExecuteQuery(
        "SELECT * FROM users where username = '{}' and password = '{}'".format(
            username, password
        )
    )
    # ユーザー名とパスワードを確認
    if len(result) == 0:
        # 該当するユーザーが存在しない
        return render_template("login.tmpl", fail=1)
    else:
        # セッション(cookieに保存)にログイン状態とユーザー名を保存
        session["login"] = True
        session["username"] = username
        return redirect("/")


# ユーザー登録ページ
@app.route("/register")
def register_page():
    return render_template("register.tmpl")


# ユーザー登録処理
@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    # すでにユーザーが存在しないか確認する
    result = ExecuteQuery("SELECT * FROM users where username = '{}'".format(username))
    if len(result) == 0:
        # ユーザーを新規作成
        result = ExecuteQuery(
            "insert into users (username, password) values ('{}', '{}')".format(
                username, password
            )
        )
        return redirect("/login")
    else:
        # すでにユーザーが存在するのでエラー
        return render_template("register.tmpl", fail=1)


# ログアウト
@app.route("/logout")
def logout():
    # セッションを削除しトップページへリダイレクト
    session["login"]: bool = False
    session["username"]: str = None
    return redirect("/")


# 開発用
@app.route("/debug", methods=["GET"])
def debug_get():
    return render_template_string(request.args.get("q", ""))


# 開発用
@app.route("/debug", methods=["POST"])
def debug_post():
    return jsonify(ExecuteQuery(request.form["q"]))


if __name__ == "__main__":
    app.run(debug=True)
