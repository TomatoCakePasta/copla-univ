import { 
        fetchUserInfoByUserId,
        isUserByUserId,
        updateUser
    } from "../models/settingModel.js";

import bcrypt from "bcrypt";

// ユーザ情報取得
export const getUserInfo = (req, res) => {
    const userID = req.session.user.userID;

    console.log("get /setting getUserInfo");

    fetchUserInfoByUserId(userID, (err, userInfo) => {
        if (err) {
            console.error("Failed to fetch user info by userID", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, userInfo: userInfo });
        }
    });
};

export const updateUserInfo = (req, res) => {
    const userID = req.session.user.userID;
    const { userName, profilePict, currentPass, renewPass } = req.body;
    
    let hashedRenewPass = bcrypt.hashSync(renewPass, 10);

    console.log("post /setting updateUserInfo");

    if (renewPass !== "") {
        // 既存のパスと比較
        isUserByUserId(userID, (err, results) => {
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
                updateUser(userName, profilePict, hashedRenewPass, userID, (err, results) => {
                    if (err) {
                        console.error("DB query error:", err);
                        res.send({ flag: -1 });
                        return;    
                    }
    
                    res.status(200).send({ flag: 2 });
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
        updateUser(userName, profilePict, hashedRenewPass, userID, (err, results) => {
            if (err) {
                console.error("DB query error:", err);
                res.send({ flag: -1 });
                return;
            }
            else {
                res.status(200).send({ flag: 2 });
            }
        });
    }
};
