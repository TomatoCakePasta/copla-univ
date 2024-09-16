import express from "express";
import { 
        getUserInfo,
        updateUserInfo
    }  from "../controllers/settingsController.js";

const router = express.Router();

router.get("/user", getUserInfo);

router.post("/user", updateUserInfo);

export default router;