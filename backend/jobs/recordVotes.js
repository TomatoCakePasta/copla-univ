import con from "../etc/db.js";

export const recordVotes = () => {
    // 翌日とかに直で更新する場合
    // let query = `INSERT INTO menu_sales(menuID, fav, saleDate)
    //             SELECT menuID, fav, '2024-09-04' FROM menus`;
    
    const query = `INSERT INTO menu_sales(menuID, fav)
                SELECT menuID, fav FROM menus`;

    const clearQuery = `UPDATE menus SET fav = 0`;

    con.query(query, (err) => {
        if (err) {
            console.error("Failed to record day votes", err);
        }
        else {
            con.query(clearQuery, (err) => {
                if (err) {
                    console.error("Failed to clear day votes", err);
                }
                else {
                    console.log("今日の投票結果を記録しました");
                }
            })
        }
    })
}