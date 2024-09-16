import bcrypt from "bcrypt";
import { findUserByName, getAllUsers, insertUser, createTimetableForUser } from "../models/userModel.js";

// Controllerは関数を呼出
// 必要なModelを呼び出すイメージ

// 新規登録
export const signup = (req, res) => {
    const { name, pass } = req.body;
    // console.log(name);
    const hashed_pass = bcrypt.hashSync(pass, 10);

    console.log("/auth/signup");

    findUserByName(name, (err, row) => {
        // 既にユーザ名が存在する場合
        if (row.length) {
            res.status(200).send({ flag: false});
        }
        else {
            getAllUsers((err, allRows) => {
                const nextID = allRows.length + 1;
                console.log(nextID, name);

                insertUser(nextID, hashed_pass, name, nextID, (err) => {
                    if (err) {
                        console.error("Failed to signup", err);
                        res.send({ flag: false });
                    }
                    else {
                        createTimetableForUser(nextID, (err) => {
                            if (err) {
                                console.error("Failed to create timetable", err);
                                res.send({ flag: false });
                            }
                            else {
                                res.send({ flag: true });
                            }
                        });
                    }
                });
            });
        }
    });
};

// ログイン
export const login = (req, res) => {
    const { name, pass } = req.body;
    console.log("/auth/login");

    findUserByName(name, (err, rows) => {
        // ユーザが見つかった場合
        if (rows.length) {
            let endFlag = false;

            rows.forEach(row => {
                if (bcrypt.compareSync(pass, row.password)) {
                    const data = { userName: row.userName, userID: row.userID };
                    req.session.user = data;
                    endFlag = true;

                    console.log("login user match");
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
    })
}

// ログアウト
export const logout = (req, res) => {
    console.log("/auth/logout");

    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destory session:", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    });
};