import express from "express";
import { 
        getTransitTimetable
    }  from "../controllers/transitTimeController.js";

const router = express.Router();

// これから実装
router.get("/", getTransitTimetable);

export default router;