import express from "express";
// import bcrypt from "bcrypt";
// import con from "../etc/db.js";
import { signup, login, logout }  from "../controllers/authController.js";

const router = express.Router();

// 新規登録
router.post("/signup", signup);

// ログイン
router.post("/login", login);

// ログアウト
router.post("/logout", logout);

export default router;