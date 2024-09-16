import con from "../etc/db.js";

export const fetchUserInfoByUserId = (userID, callback) => {
    const query = `SELECT 
                        u.userName,
                        u.icon
                    FROM users u
                    WHERE userID = ?
                    `;
            
    con.query(query, [ userID ], callback);
};

export const isUserByUserId = (userID, callback) => {
    const query = `SELECT * FROM 
                        users 
                        WHERE userID = ?
                    `;
            
    con.query(query, [ userID], callback);
};

export const updateUser = (userName, profilePict, hashedRenewPass, userID, callback) => {
    const values = [ userName, profilePict, hashedRenewPass, userID];

    const query = `UPDATE users SET 
                        userName = COALESCE(?, userName),
                        icon = COALESCE(?, icon),
                        password = COALESCE(?, password)
                    WHERE userID = ?
                    `;

    con.query(query, values, (err) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null);
        }
    });
};