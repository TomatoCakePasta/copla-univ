import { 
        fetchAllMenu,
        fetchTopLunchMenu,
        addVoteMenu,
        fetchVotedMenuIdByUser
    } from "../models/menuModel.js";

// 全メニュー取得
export const getMenu = (req, res) => {
    console.log("/menu getMenu");

    fetchAllMenu((err, menus) => {
        if (err) {
            console.error("Failed to get menu", err);
            req.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, menus: menus });
        }
    });
};

// 上位3位のメニュー取得
export const getTop3Menu = (req, res) => {
    console.log("/menu/top3 getTop3Menu");

    // モデルを呼出
    fetchTopLunchMenu((err, rank) => {
        if (err) {
            console.error("Failed to get top3 menu", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, rank: rank });
        }
    });
};

// メニュー投票
export const voteForMenu = (req, res) => {
    const userID = req.session.user.userID;
    const menuID = req.body.menuID;

    console.log("/menu/vote voteForMenu");

    addVoteMenu(userID, menuID, (err) => {
        if (err) {
            console.error("Failed to vote menu", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    });
};

// 投票済み確認
export const isVoted = (req, res) => {
    const userID = req.session.user.userID;
    
    console.log("/menu/isvoted isVoted");

    fetchVotedMenuIdByUser(userID, (err, menuID) => {
        if (err) {
            console.error("Failed to get voted menu id by user", err);
            res.send({ flag: false });
        }
        else {
            if (menuID.length) {
                res.send({ flag: true, menuID: menuID });
            }
            else {
                res.send({ flag: false });
            }
        }
    });
};