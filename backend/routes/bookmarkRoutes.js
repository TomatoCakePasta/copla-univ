import express from "express";
import { 
        getUserBookmarkIds, 
        getUserBookmarkPosts,
        addBookmark,
        delBookmark
    }  from "../controllers/bookmarksController.js";

const router = express.Router();

// これから実装

// ブックマーク済み投稿IDの取得(押下済みアイコンにするか判定用)
router.get("/", getUserBookmarkIds);

// ブックマーク済み投稿要素全体の取得
router.get("/posts", getUserBookmarkPosts);

// ブックマーク押下
router.post("/", addBookmark);

// ブックマーク削除
router.delete("/", delBookmark);

export default router;