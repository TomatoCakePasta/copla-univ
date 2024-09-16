import con from "../etc/db.js";

export const fetchAllMenu = (callback) => {
    const query = `SELECT * 
                    FROM menus 
                    ORDER BY genre ASC
                    `;
    
    con.query(query, callback);
};

export const fetchTopLunchMenu = (callback) => {
    const query = `SELECT * 
                    FROM menus 
                    ORDER BY fav DESC 
                    LIMIT 3
                    `;

    con.query(query, callback);
};

export const addVoteMenu = (userID, menuID, callback) => {
    const insertQuery = `INSERT INTO votes(userID, menuID, voteDate) VALUES(?, ?, curdate())`;
    const updateQuery = `UPDATE menus SET fav = fav + 1 WHERE menuID = ?`;
    const values = [ userID, menuID ];

    con.query(insertQuery, values, (err) => {
            if (err) {
                return callback(err);
            }
            else {
                // いいねを追加
                con.query(updateQuery, [ menuID ], (err) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null);
                        }
                    }
                )
            }
        }
    );
};

export const fetchVotedMenuIdByUser = (userID, callback) => {
    const query = `SELECT menuID FROM votes WHERE userID = ? AND voteDate = curdate();`;

    con.query(query, [ userID ], callback);
};