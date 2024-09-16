import con from "../etc/db.js";

export const getLikedPostsIdByUser = (userID, callback) => {
    const query = `SELECT 
                        postID
                    FROM post_likes
                    WHERE userID = ?
                    ORDER BY postID ASC
                    `;
    
    con.query(query, [ userID ], callback);
};

export const getLikedRepliesIdByUser = (userID, callback) => {
    const query = `SELECT 
                        repID
                    FROM reply_likes
                    WHERE userID = ?
                    ORDER BY repID ASC
                    `;
    
    con.query(query, [ userID ], callback);
};

export const addPostFav = (postID, userID, callback) => {
    const insertQuery = `INSERT INTO 
                            post_likes (
                                postID, 
                                userID
                            ) 
                            VALUES(?, ?)
                        `;

    const updateQuery = `UPDATE 
                            posts 
                            SET fav = fav + 1 
                            WHERE postID = ?
                        `;

    // post_likesで誰がどの投稿にいいねしたか追加
    con.query(insertQuery, [ postID, userID ], (err) => {
        if (err) {
            return callback(err);
        }
        else {
            // postsで投稿のいいね数を加算
            con.query(updateQuery, [ postID ], (err) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null);
                }
            });
        }
    });
};

export const addReplyFav = (repID, userID, callback) => {
    const insertQuery = `INSERT INTO 
                            reply_likes (
                                repID, 
                                userID
                            ) 
                            VALUES(?, ?)
                        `;

    const updateQuery = `UPDATE 
                            replies
                            SET fav = fav + 1 
                            WHERE repID = ?
                        `;
    // reply_likesで誰がどの投稿にいいねしたか追加
    con.query(insertQuery, [ repID, userID ], (err) => {
        if (err) {
            return callback(err);
        }
        else {
            // repliesで投稿のいいね数を加算
            con.query(updateQuery, [ repID ], (err) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null);
                }
            });
        }
    });
};