import express from "express";
import mysql from "mysql";

import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
// import cookieParser from "cookie-parser";
// import logger from "morgan";
// import MemoryStore from "memorystore";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import schedule from "node-schedule";

import authRouter from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import transitTimeRoutes from "./routes/transitTimeRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

const app = express();
const PORT = 3000;

// multerインスタンス
// const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(session(session_opt));
// app.use(logger('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 静的ファイルを提供
// パス名はカレントディレクトリにimagesを追記したパス
app.use("/images", express.static(path.join(__dirname, "images")));

// JSONデータを解析
app.use(bodyParser.json());

// ミドルウェア
app.use(cors({
    // 以下からのアクセスを許可
    // 全てからのアクセスを許可したい
    // origin: "192.168.0.10:5173",

    // これでも動いてる?
    origin: "*",

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
        maxAge: 1000 * 60 * 15,
        secure: false,

        // JSからのアクセス防止
        httpOnly: true,
    }
}));

// 認証関連(ログイン,ログアウト,サインアップ)
app.use("/auth", authRouter);

// 投稿関連(通常投稿, 返信, 検索)
app.use("/posts", postRoutes);

// いいね関連(押下, いいね投稿取得)
app.use("/likes", likeRoutes);

// ブックマーク関連(押下, ブックマーク投稿取得)
app.use("/bookmarks", bookmarkRoutes);

// メニュー関連(閲覧, 投票)
app.use("/menu", menuRoutes);

// 時間割関連(予定閲覧, 修正)
app.use("/schedule", scheduleRoutes);

// 交通時刻表関連(閲覧)
app.use("/transit", transitTimeRoutes);

// 設定
app.use("/setting", settingRoutes);

// セッションチェック
app.get("/session", (req, res) => {
    let flag = false;

    // console.log("session check");
    // console.log(req.session.user);

    if (req.session.user) {
        console.log("session ok");
        flag = true;
    }
    else {
        console.log("session invalid");
    }

    res.status(200).send({ flag: flag, user: req.session.user });
});

// 初期ルート
app.get("/", (req, res) => {
    // console.log(req.session.user);
    res.send("Hello World");
});

// 投票リセット
// second, minute, hour, day of month, month, day of weekの順に指定
// 毎日23:00にその日の投票結果を記録する
const job = schedule.scheduleJob('0 0 23 * * *', function(){
    console.log("本日の投票をリセットします");

    recordVotes();
});

const recordVotes = () => {
    // 翌日とかに直で更新する場合
    // let query = `INSERT INTO menu_sales(menuID, fav, saleDate)
    //             SELECT menuID, fav, '2024-09-04' FROM menus`;
    
    let query = `INSERT INTO menu_sales(menuID, fav)
                SELECT menuID, fav FROM menus`;

    let clearQuery = `UPDATE menus SET fav = 0`;

    con.query(query, (err) => {
        if (err) {
            console.error("Failed to record day votes", err);
        }
        else {
            con.query(clearQuery, (err) => {
                if (err) {
                    console.error("Failed to clear day votes", err);
                }
                else {
                    console.log("今日の投票結果を記録しました");
                }
            })
        }
    })
}

// 直書きでサーバ起動時に実行される
// recordVotes();

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${ PORT }`);
});