import express from "express";
import { 
        getMenu, 
        getTop3Menu, 
        voteForMenu, 
        isVoted 
    }  from "../controllers/menuController.js";

const router = express.Router();

// これから実装

// メニュー取得
router.get("/", getMenu);

// 上位TOP3のメニュー
router.get("/top3", getTop3Menu);

// 新規投票
router.post("/vote", voteForMenu);

// 投票済み確認
router.get("/isvoted", isVoted);

export default router;