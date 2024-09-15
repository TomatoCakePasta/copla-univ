import express from "express";
import { 
        createNewPost, 
        createNewReply,  
        getPosts,
        getSinglePost,
        getMyPosts,
        searchPosts
    }  from "../controllers/postsController.js";

import upload from "../middleware/multerConfig.js";

const router = express.Router();

// これから実装

// 通常投稿
router.post("/", upload.single("image"), createNewPost);

// 返信
router.post("/reply", createNewReply);

// 通常投稿取得
router.get("/genre/:id", getPosts);

// シングルポスト取得
router.get("/single/:id", getSinglePost);

// 自分の投稿取得
router.get("/myposts", getMyPosts);

// 通常投稿検索
router.post("/search", searchPosts);

export default router;