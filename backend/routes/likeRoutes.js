import express from "express";
import { 
        getUserLikedPostIds,
        getUserLikedReplyIds,
        likePost,
        likeReply
    }  from "../controllers/likesController.js";

const router = express.Router();

// これから実装

// ユーザがいいねしたいいね投稿のid
router.get("/user/posts", getUserLikedPostIds);

// ユーザがいいねした返信のid
router.get("/user/replies", getUserLikedReplyIds);

// 通常投稿いいね押下
router.post("/post", likePost);

// 返信いいね押下
router.post("/reply", likeReply);

export default router;