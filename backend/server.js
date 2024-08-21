import express from "express"

import cors from "cors";
// import bodyParser from "body-parser";
// import sqlite3 from "sqlite3";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import logger from "morgan";
// import MemoryStore from "memorystore";
// import bcrypt from "bcrypt";

const app = express()
const PORT = 3000

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
    origin: "http://localhost:5173",

    // 許可するアクセス
    methods: ["GET", "POST", "DELETE"],
    // 許可するデータ
    allowedHeaders: ["Content-Type", "Authorization"],

    // セッションCookieを許可するために必要らしい
    // credentials: true
}));

app.get("/", (req, res) => {
    console.log("access to home")
    res.send("Hello World")
})

app.get("/get", (req, res) => {
    console.log("get request")
    res.send({msg: "GET REQUEST"})
})

app.listen(PORT, () => {
    console.log(`Server is running ${ PORT }`)
})