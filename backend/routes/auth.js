import express from "express";
import bcrypt from "bcrypt";
import con from "../etc/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("home");
});

router.get("/info", (req, res) => {
    res.send("home/info");
});

// 新規登録
router.post("/signup", (req, res) => {
    // 重複チェック
    const { name, pass } = req.body;
    console.log(name);

    const hashed_pass = bcrypt.hashSync(pass, 10);

    console.log("/auth/signup");

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

// ログイン処理
router.post("/login", (req, res) => {
    // 分割代入
    const { name, pass } = req.body;
    // console.log(req.body);

    console.log("/auth/login")

    con.query(`SELECT * FROM users 
                WHERE userName = ?`, 
                name, 
                (err, rows) => {
        // ユーザが見つかった場合
        if (rows.length) {
            let endFlag = false;
            rows.forEach(row => {
                // console.log(row);
                if (bcrypt.compareSync(pass, row.password)) {
                    const data = { userName: row.userName, userID: row.userID };
                    console.log("login user match");
                    // console.log(data);
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

// ログアウト
router.post("/logout", (req, res) => {
    console.log("/auth/logout");

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

export default router;