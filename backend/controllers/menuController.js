import { 
        getAllMenu,
        getTopLunchMenu,
        addVoteMenu,
        getVotedMenuIdByUser
    } from "../models/menuModel.js";

// 全メニュー取得
export const getMenu = (req, res) => {
    console.log("/menu getMenu");

    getAllMenu((err, menus) => {
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
    getTopLunchMenu((err, rank) => {
        if (err) {
            console.error("Failed to get top3 menu", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, rank: rank });
        }
    });
};

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

export const isVoted = (req, res) => {
    const userID = req.session.user.userID;
    
    console.log("/menu/isvoted isVoted");

    getVotedMenuIdByUser(userID, (err, menuID) => {
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