import multer from "multer";

const storage = multer.diskStorage({
    // cbはcall backの略
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        // console.log("画像格納");
        // console.log(req.session.user.userID);
        // 先頭にユーザID, 時刻を追加
        // 別の形式に変換されたものを元に戻す(デコード)
        const decodeName = req.session.user.userID + "_" + Date.now() + "_" + decodeURIComponent(file.originalname);
        cb(null, decodeName);
    },
});

// multerインスタンス
const upload = multer({ storage: storage });

export default upload;