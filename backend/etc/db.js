import mysql from "mysql";

// db接続
const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    // 外部変数?にした方がいい
    // envファイル, dotenv?
    password: "",
    database : "copla_db",
    // 日本時間
    timezone: "jst"
});

export default con;