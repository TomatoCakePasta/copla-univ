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

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    // cbはcall backの略
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        // console.log("画像格納");
        // console.log(req.session.user.userID);
        // 先頭にユーザID, 時刻を追加
        // 別の形式に変換されたものを元に戻す(デコード)
        const decodeName = req.session.user.userID + "_" + Date.now() + "_" + decodeURIComponent(file.originalname);
        cb(null, decodeName);
    },
});

// multerインスタンス
const upload = multer({ storage: storage });

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
    // envファイル, dotenv?
    password: "",
    database : "copla_db",
    // 日本時間
    timezone: "jst"
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
                [ name ] , 
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
                        // 時間割の枠を作成
                        let count = 0;
                        for (let i = 0; i < 5; i++) {
                            for (let j = 0; j < 5; j++) {
                                con.query(`INSERT INTO timetable(userID, dayID, periodID) VALUES(?, ?, ?)`, [ nextID, i, j ], (err) => {
                                    if (err) {

                                    }
                                    else if (++count === 25) {
                                        res.status(200).send({ flag: true });
                                    }
                                })
                            }
                        }
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
            res.send({ flag: false });
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

// ユーザ情報取得
app.get("/get/user", (req, res) => {
    const userID = req.session.user.userID;

    let query = `SELECT 
                    u.userName,
                    u.icon
                FROM users u
                WHERE userID = ?`;
    
    con.query(query, [ userID ], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            res.send({ flag: false });
            return;
        }
        else {
            // console.log(results);
            res.status(200).send({ flag: true, userInfo: results });
        }
    })

});

// ユーザ情報更新
app.post("/set/user", (req, res) => {
    const userID = req.session.user.userID;

    let { userName, profilePict, currentPass, renewPass } = req.body;
    
    let hashedRenewPass = bcrypt.hashSync(renewPass, 10);

    // console.log(userName, " : ", profilePict, currentPass, " -> ", renewPass);

    let query = `UPDATE users SET 
                userName = COALESCE(?, userName),
                icon = COALESCE(?, icon),
                password = COALESCE(?, password)
                WHERE userID = ?`

    // もしパスワードが入力されている場合
    if (renewPass !== "") {
        // 既存のパスと比較
        con.query(`SELECT * FROM users WHERE userID = ?`, 
                [ userID ], 
                (err, results) => {
            if (err || results.length === 0) {
                console.error("DB query error:", err);
                res.send({ flag: -1 });
                return;
            }
            // ユーザ入力の現在のパスが一致しなかった場合
            else if (!bcrypt.compareSync(currentPass, results[0].password)) {
                console.log("現在のパスが不一致");
                res.send({ flag: 0 });
                return;
            }
            else {
                // データ更新
                console.log("パスワード込みデータ更新");
                con.query(query, [userName, profilePict, hashedRenewPass, userID], (err, results) => {
                    if (err) {
                        console.error("DB query error:", err);
                        res.send({ flag: -1 });
                        return;    
                    }
    
                    res.send({ flag: 2 });
                });
            }
        });
    }
    else {
        console.log("通常データ更新")
        // もし空データならnullに変換
        if (renewPass === "") {
            hashedRenewPass = null;
        }
    
        // データ更新
        con.query(query, [userName, profilePict, hashedRenewPass, userID], (err, results) => {
            if (err) {
                console.error("DB query error:", err);
                res.send({ flag: -1 });
                return;
            }
            else {
                res.status(200).send({ flag: 2 });
            }
        })
    }
});

// 投稿取得
app.get("/get/genre/:id", (req, res) => {
    console.log("get all posts");
    console.log(req.session);

    let genre = +req.params.id;
    let query = `SELECT 
                    p.postID, 
                    p.genre, 
                    p.title,
                    u.userName AS postName, 
                    u.icon AS postUserIcon,
                    p.body AS postContent, 
                    p.pic AS postPic,
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    u2.icon AS repUserIcon,
                    r.body AS repContent,
                    r.datetime AS repTime,
                    r.fav AS repFav
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID`;

    // 全投稿
    if (genre === 0) {
        query += " ORDER BY p.datetime DESC";
    }
    // 特定ジャンル
    else {
        query += ` WHERE p.genre = ${ genre } ORDER BY p.datetime DESC`;
    }

    con.query(query, (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }

        // 結果に画像URLを追加
        // 要素をスプレッド構文で展開して要素の末尾にpicUrlを追加
        const postsWithImageUrls = results.map(post => ({
            ...post,
            picUrl: post.postPic ? `/images/${post.postPic}` : null
        }));

        res.status(200).send({ flag: true, posts: postsWithImageUrls });
    });
});

// 自分の投稿
app.get("/get/myposts", (req, res) => {
    console.log("get my posts");
    console.log(req.session);

    const userID = req.session.user.userID;

    let query = `SELECT 
                    p.postID, 
                    p.genre, 
                    p.title,
                    u.userName AS postName, 
                    u.icon AS postUserIcon,
                    p.body AS postContent, 
                    p.pic AS postPic,
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    u2.icon AS repUserIcon,
                    r.body AS repContent,
                    r.datetime AS repTime,
                    r.fav AS repFav
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID
                WHERE p.userID = ? ORDER BY p.postID DESC`;

    con.query(query, [ userID ], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }

        const postsWithImageUrls = results.map(post => ({
            ...post,
            picUrl: post.postPic ? `/images/${post.postPic}` : null
        }));

        res.status(200).send({ flag: true, posts: postsWithImageUrls });
    });
});

// 検索投稿取得
app.post("/search", (req, res) => {
    let rowWords = req.body.words;
    const queryWords = rowWords.map(word => `%${word}%`);
    const genreWords = { "授業": 1, "サークル": 2, "研究室": 3, "就活": 4, "その他": 5, "イベント": 6, "記事": 7 };
    let genreIDs = [];
    let genre = 0;

    let query = `SELECT 
                    p.postID, 
                    p.genre, 
                    p.title,
                    u.userName AS postName, 
                    u.icon AS postUserIcon,
                    p.body AS postContent, 
                    p.pic AS postPic,
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    u2.icon AS repUserIcon,
                    r.body AS repContent,
                    r.datetime AS repTime,
                    r.fav AS repFav
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID`;

    if (rowWords.length > 0) {
        query += " WHERE";
    }

    query += queryWords.map((word) => ` p.body LIKE '${ word }' OR p.title LIKE '${ word }' OR u.userName LIKE '${ word }'`).join(" OR ");
                // OR p.genre = ?

                // p.genreがまだ中途半端
                // Allの投稿が全て当てはまるから
                // 記事タイトルも

    // もしタグ名が含まれていたら
    rowWords.some((word) => {
        if (genreWords[word]) {
            genreIDs.push(genreWords[word]);
        }
    });

    if (genreIDs.length > 0) {
        query += ` OR p.genre IN (${ genreIDs }) ORDER BY p.datetime DESC`;
    }
    else {
        query += ` ORDER BY p.datetime DESC`;
    }

    // console.log(genre, queryWords, query);

    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.send({ flag: false, msg: "Internal Server Error" });
        }
        else {
            // console.log(results);
            const postsWithImageUrls = results.map(post => ({
                ...post,
                picUrl: post.postPic ? `/images/${post.postPic}` : null
            }));
            res.send({ flag: true, posts: postsWithImageUrls });
        }
    });

})

// シングルポスト表示
app.get("/get/:id", (req, res) => {
    const id = +req.params.id;
    // console.log(`single post id = ${id}`);
    con.query(`SELECT 
                    p.postID, 
                    p.genre, 
                    p.title,
                    u.userName AS postName, 
                    u.icon AS postUserIcon,
                    p.body AS postContent, 
                    p.pic AS postPic,
                    p.datetime AS postTime, 
                    p.fav AS postFav,
                    r.repID,
                    u2.userName AS repName,
                    u2.icon AS repUserIcon,
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
            console.error("DB query error:", err);
            return;
        }

        const postsWithImageUrls = results.map(post => ({
            ...post,
            picUrl: post.postPic ? `/images/${post.postPic}` : null
        }));

        res.status(200).send({ posts: postsWithImageUrls });
    });
});

// 新規投稿
app.post("/post", upload.single("image"), (req, res) => {
    // セッションからuserIDを取得
    const userID = req.session.user.userID;
    const data = JSON.parse(req.body.data)
    let { content, genre, datetime, title } = data;

    let pic = "";

    // console.log("get post info: ", content, genre, datetime, title);

    // console.log("New POST");
    // console.log(userID);

    if (req.file) {
        pic = req.file.filename;
        // console.log("pic: ", pic);
    }

    // console.log("---------data-----------");
    // console.log(data);

    con.query(`INSERT INTO posts(userID, genre, body, pic, datetime, title) VALUES(?, ?, ?, ?, ?, ?)`, 
                [userID, genre, content, pic, datetime, title],
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
app.post("/reply", (req, res) => {
    const userID = req.session.user.userID;
    const { postID, repContent, datetime } = req.body;

    // console.log("New Reply");
    // console.log(userID);

    con.query(`INSERT INTO replies(postID, userID, body, datetime) VALUES(?, ?, ?, ?)`, 
                [postID, userID, repContent, datetime],
                (err) => {
        if (err) {
            console.error("Failed to reply", err);
            res.status(200).send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    })
});

// いいね済み投稿の取得
app.get("/posts/faved", (req, res) => {
    const userID = req.session.user.userID;

    con.query(`SELECT 
                    postID
                FROM post_likes
                WHERE userID = ?
                ORDER BY postID ASC`, [userID], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }
        else {
            // console.log(results.length);
            res.status(200).send({flag: true, postIDs: results, favs: results.length });
        }
    });

});

// いいね済み返信の取得
app.get("/replies/faved", (req, res) => {
    const userID = req.session.user.userID;

    // console.log("rep fav");
    con.query(`SELECT 
                    repID
                FROM reply_likes
                WHERE userID = ?
                ORDER BY repID ASC`, [userID], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }
        else {
            // console.log(results.length);
            res.status(200).send({flag: true, repIDs: results, favs: results.length });
        }
    });

});

// ブックマーク済み投稿IDの取得
app.get("/bookmarks", (req, res) => {
    const userID = req.session.user.userID;

    con.query(`SELECT 
                    postID
                FROM bookmarks
                WHERE userID = ?
                ORDER BY bookmarkID ASC`, [userID], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }
        else {
            // console.log(results.length);
            res.status(200).send({flag: true, postIDs: results, bookmarks: results.length });
        }
    });

});

// ブックマーク済み投稿要素全体の取得
app.get("/bookmark-posts", (req, res) => {
    const query = `SELECT 
                        book.postID, 
                        p.genre, 
                        p.title,
                        u.userName AS postName, 
                        u.icon AS postUserIcon,
                        p.body AS postContent, 
                        p.pic AS postPic,
                        p.datetime AS postTime, 
                        p.fav AS postFav,
                        r.repID,
                        u2.userName AS repName,
                        u2.icon AS repUserIcon,
                        r.body AS repContent,
                        r.datetime AS repTime,
                        r.fav AS repFav
                    FROM bookmarks book
                    LEFT JOIN posts p ON book.postID = p.postID
                    LEFT JOIN users u ON book.userID = u.userID 
                    LEFT JOIN replies r ON book.postID = r.postID
                    LEFT JOIN users u2 ON r.userID = u2.userID
                    WHERE book.userID = ?
                    ORDER BY book.postID DESC`;

    const userID = req.session.user.userID;

    con.query(query, [ userID ], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return;
        }
        else {
            // console.log("お気に入り");
            // console.log(results);

            const postsWithImageUrls = results.map(post => ({
                ...post,
                picUrl: post.postPic ? `/images/${post.postPic}` : null
            }));

            res.status(200).send({ flag: true, posts: postsWithImageUrls });
        }
    });

});

// 投稿いいね押下
app.post("/post/add-fav", (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;

    // post_likesで誰がどの投稿にいいねしたか追加
    con.query(`INSERT INTO post_likes(postID, userID) VALUES(?, ?)`, 
                [postID, userID],
                (err) => {
        if (err) {
            console.error("Failed to fav", err);
            res.status(200).send({ flag: false });
        }
        else {
            // postsで投稿のいいね数を加算
            con.query(`UPDATE posts SET fav = fav + 1 WHERE postID = ?`, [postID], (err) => {
                if (err) {
                    console.error("Failed to fav", err);
                    res.status(200).send({ flag: false });
                }
                else {
                    res.status(200).send({ flag: true });
                }
            });
        }
    });
});

// 返信いいね押下
app.post("/reply/add-fav", (req, res) => {
    const repID = req.body.repID;
    const userID = req.session.user.userID;

    // post_likesで誰がどの返信にいいねしたか追加
    con.query(`INSERT INTO reply_likes(repID, userID) VALUES(?, ?)`, 
                [repID, userID],
                (err) => {
        if (err) {
            console.error("Failed to rep fav", err);
            res.status(200).send({ flag: false });
        }
        else {
            // postsで投稿のいいね数を加算
            con.query(`UPDATE replies SET fav = fav + 1 WHERE repID = ?`, [repID], (err) => {
                if (err) {
                    console.error("Failed to rep fav", err);
                    res.status(200).send({ flag: false });
                }
                else {
                    res.status(200).send({ flag: true });
                }
            });
        }
    });
});

// ブックマーク追加
app.post("/bookmark/add", (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;

    // bookmarksで誰がどの投稿にブックマークしたか追加
    con.query(`INSERT INTO bookmarks(postID, userID) VALUES(?, ?)`, 
                [postID, userID],
                (err) => {
        if (err) {
            console.error("Failed to add bookmark", err);
            res.status(200).send({ flag: false });
        }
        else {
            res.send({ flag: true });
        }
    });
});

// ブックマーク削除
app.delete("/bookmark/del", (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;
    // console.log("削除", postID, userID);

    // bookmarksで誰がどの投稿にブックマーク削除したか
    con.query(`DELETE FROM bookmarks WHERE postID = ? AND userID = ?`, 
                [postID, userID],
                (err) => {
        if (err) {
            console.error("Failed to delete bookmark", err);
            res.status(200).send({ flag: false });
        }
        else {
            res.send({ flag: true });
        }
    });
});

// メニュー取得
app.get("/menus", (req, res) => {
    // console.log("メニュー取得");
    con.query(`SELECT * FROM menus ORDER BY genre ASC`, (err, results) => {
        if (results) {
            res.send({ flag: true, menus: results });
        }
        else {
            res.send({ flag: false });
        }
    });
});

// 新規投票
app.post("/vote", (req, res) => {
    const userID = req.session.user.userID;
    const menuID = req.body.menuID;

    con.query(`INSERT INTO votes(userID, menuID, voteDate) VALUES(?, ?, curdate())`,
        [ userID, menuID ], (err) => {
            if (err) {
                console.error("Failed to add new vote", err);
                res.send({ flag: false});
            }
            else {
                // いいねを追加
                con.query(`UPDATE menus SET fav = fav + 1 WHERE menuID = ?`,
                    [ menuID ],
                    (err) => {
                        if (err) {
                            console.error("Failed to add new fav", err);
                            res.send({ flag: false });
                        }
                        else {
                            // console.log("新規投票を追加 : userID ", userID, ", menuID : ", menuID);
                            res.send({ flag: true });
                        }
                    }
                )
            }
        }
    )
});

// 投票済み
app.get("/isVoted", (req, res) => {
    const userID = req.session.user.userID;

    // 今日そのユーザが投票したか
    con.query(`SELECT menuID FROM votes WHERE userID = ? AND voteDate = curdate();`,
            [ userID ], 
            (err, results) => {
                if (results.length) {
                    // console.log("isVoted : ", results);
                    res.send({ flag: true, menuID: results });
                }
                else {
                    // console.log("isNotVoted : ", results);
                    res.send({ flag: false });
                }
            }
    );
});

// 時間割取得
app.get("/timetable", (req, res) => {
    const userID = req.session.user.userID;

    con.query(`SELECT 
                    className,
                    dayID,
                    periodID
                FROM timetable
                WHERE userID = ?
                ORDER BY dayID DESC, periodID DESC`,
            [ userID ],
            (err, results) => {
                if (err) {
                    res.send({ flag: false });
                }
                else {
                    // console.log(results);
                    res.send({ flag: true, timetable: results });
                }
            });
})

// 時間割更新
app.post("/set/timetable", (req, res) => {
    const userID = req.session.user.userID;
    const timetable = req.body.classes;
    // console.log(timetable);

    let count = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            con.query(`UPDATE timetable 
                        SET className = ?
                        WHERE userID = ? AND dayID = ? AND periodID = ?`,
                        [ timetable[i][j], userID, i, j ],
                        (err) => {
                            if (err) {
                                console.error("Failed to set new timetable", err);
                                res.send({ flag: false });
                            }
                            else if (++count === 25) {
                                res.send({ flag: true });
                            }
                        }

            )
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${ PORT }`);
});