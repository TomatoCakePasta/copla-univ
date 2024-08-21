import express from "express";
import mysql from "mysql";

import cors from "cors";
// import bodyParser from "body-parser";
// import sqlite3 from "sqlite3";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import logger from "morgan";
// import MemoryStore from "memorystore";
// import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

/*
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(session_opt));
app.use(logger('dev'));
*/

// JSONデータを解析
// app.use(bodyParser.json());

// ミドルウェア
app.use(cors({
    // 以下からのアクセスを許可
    // origin: "http://localhost:5173",

    // 許可するアクセス
    methods: ["GET", "POST"],
    // 許可するデータ
    allowedHeaders: ["Content-Type", "Authorization"],

    // セッションCookieを許可するために必要らしい
    // credentials: true
}));

// db接続
const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "",
    database : "copla_db"
});

app.get("/", (req, res) => {
    con.query("SELECT * FROM posts ORDER BY datetime DESC", (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/get/all", (req, res) => {
    console.log("get request");
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
        res.send({posts: results});
    });
});

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
        res.send({posts: results});
    });
});

app.listen(PORT, () => {
    console.log(`Server is running ${ PORT }`);
});