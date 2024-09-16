import express from "express";
import { 
        getUserTimetable,
        updateUserTimetable
    }  from "../controllers/scheduleController.js";

const router = express.Router();

// これから実装

// 時間割取得
router.get("/", getUserTimetable);

// 時間割更新
router.post("/", updateUserTimetable);

export default router;