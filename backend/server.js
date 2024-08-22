import express from "express";
import mysql from "mysql";

import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
// import cookieParser from "cookie-parser";
// import logger from "morgan";
// import MemoryStore from "memorystore";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(session(session_opt));
// app.use(logger('dev'));

// JSONデータを解析
app.use(bodyParser.json());

// ミドルウェア
app.use(cors({
    // 以下からのアクセスを許可
    // 全てからのアクセスを許可したい
    origin: "http://localhost:5173",

    // 許可するアクセス
    methods: ["GET", "POST"],
    // 許可するデータ
    allowedHeaders: ["Content-Type", "Authorization"],

    // セッションCookieを許可するために必要らしい
    credentials: true,
}));

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // maxage: 1000 * 60 * 5,

    // 開発環境ではfalse, 本番はtrueらしい
    cookie: { 
        maxAge: 1000 * 60 * 5,
        secure: false,

        // JSからのアクセス防止
        httpOnly: true,
    }
}));

// db接続
const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    // 外部変数?にした方がいい
    password: "",
    database : "copla_db"
});

/**
 * あとでファイル分割する, ログイン系, 投稿系, ...
 */

// ログイン
app.post("/login", (req, res) => {
    // 分割代入
    const { name, pass } = req.body;
    // console.log(req.body);

    con.query(`SELECT * FROM users 
                WHERE userName = ?`, 
                name, 
                (err, rows) => {
        // ユーザが見つかった場合
        if (rows.length) {
            let endFlag = false;
            rows.forEach(row => {
                console.log(row);
                if (bcrypt.compareSync(pass, row.password)) {
                    const data = { userName: row.userName, userID: row.userID };
                    console.log("match");
                    console.log(data);
                    req.session.user = data;        
                    endFlag = true;
                    res.status(200).send({ flag: true, loginName: row.userName, loginID: row.userID });
                }
            });
            if (!endFlag) {
                res.status(200).send({ flag: false });
            }
        }
        else {
            console.log("No users");
            res.status(200).send({ flag: false });
        }
    });
});

// 新規登録
app.post("/signup", (req, res) => {
    // 重複チェック
    const { name, pass } = req.body;
    console.log(name);

    const hashed_pass = bcrypt.hashSync(pass, 10);

    con.query(`SELECT * FROM users 
                WHERE userName = ?`, 
                name, 
                (err, row) => {
        // 既にユーザ名が存在する場合
        if (row.length) {
            res.status(200).send({ flag: false});
        }
        // 新規登録許可
        else {
            con.query("SELECT * FROM users", (err, allRows) => {
                const nextID = allRows.length + 1;
                console.log(nextID, name);
                con.query(`INSERT INTO users(userID, password, userName, idName) VALUES(?, ?, ?, ?)`, 
                            [nextID, hashed_pass, name, nextID],
                            (err) => {
                    if (err) {
                        console.error("Failed to signup", err);
                    }
                    else {
                        res.status(200).send({ flag: true });
                    }
                });
            });
        }
    });
});

// ログアウト
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Failed to destory session:", err);
            res.status(500).send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    })
});

// セッションチェック
app.get("/session", (req, res) => {
    let flag = false;

    console.log("session check");
    console.log(req.session.user);

    if (req.session.user) {
        flag = true;
    }

    res.status(200).send({ flag: flag, user: req.session.user });
});

app.get("/", (req, res) => {
    console.log(req.session.user);
    res.send("Hello World");
});

// 全投稿取得
app.get("/get/all", (req, res) => {
    console.log("get all posts");
    console.log(req.session);
    con.query(`SELECT 
                    p.postID, 
                    p.genre, 
                    u.userName AS postName, 
                    p.body AS postContent, 
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    r.body AS repContent,
                    r.datetime AS repTime,
                    r.fav AS repFav
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID
                ORDER BY p.datetime DESC`, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send({posts: results});
    });
});

// シングルポスト表示
app.get("/get/:id", (req, res) => {
    const id = +req.params.id;
    console.log(`single post id = ${id}`);
    con.query(`SELECT 
                    p.postID, 
                    p.genre, 
                    u.userName AS postName, 
                    p.body AS postContent, 
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    r.body AS repContent,
                    r.datetime AS repTime,
                    r.fav AS repFav
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID
                WHERE p.postID = ?
                ORDER BY p.datetime DESC`, id, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send({posts: results});
    });
});

// 新規投稿
app.post("/post", (req, res) => {
    // セッションからuserIDを取得
    const userID = req.session.user.userID;
    const { content, genre, datetime } = req.body;

    console.log("New POST");
    console.log(userID);


    con.query(`INSERT INTO posts(userID, genre, body, datetime) VALUES(?, ?, ?, ?)`, 
                [userID, genre, content, datetime],
                (err) => {
        if (err) {
            console.error("Failed to post", err);
            res.status(200).send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    })
});

// 新規返信
app.post("/rep/:id", (req, res) => {
    // 投稿idの投稿に返信をする
    const postID = id;
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${ PORT }`);
});