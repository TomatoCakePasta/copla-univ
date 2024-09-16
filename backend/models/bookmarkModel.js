import con from "../etc/db.js";

export const getBookmarkPostsIdByUser = (userID, callback) => {
    const query = `SELECT 
                        postID
                    FROM bookmarks
                    WHERE userID = ?
                    ORDER BY bookmarkID ASC
                    `;

    con.query(query, [ userID ], callback);
};

export const getBookmarkPostsByUser = (userID, callback) => {
    const query = `SELECT 
                        book.postID, 
                        p.genre, 
                        p.title,
                        u.userName AS postName, 
                        u.icon AS postUserIcon,
                        p.body AS postContent, 
                        p.pic AS postPic,
                        p.tags AS postTags,
                        p.datetime AS postTime, 
                        p.fav AS postFav,
                        r.repID,
                        u2.userName AS repName,
                        u2.icon AS repUserIcon,
                        r.body AS repContent,
                        r.datetime AS repTime,
                        r.fav AS repFav
                    FROM bookmarks book
                    LEFT JOIN posts p ON book.postID = p.postID
                    LEFT JOIN users u ON book.userID = u.userID 
                    LEFT JOIN replies r ON book.postID = r.postID
                    LEFT JOIN users u2 ON r.userID = u2.userID
                    WHERE book.userID = ?
                    ORDER BY book.postID DESC
                    `;

    con.query(query, [ userID ], (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            const postsWithImageUrls = results.map(post => ({
                ...post,
                picUrl: post.postPic ? `/images/${post.postPic}` : null
            }));

            return callback(null, postsWithImageUrls);
        }
    });
};

export const addPostBookmark = (postID, userID, callback) => {
    const query = `INSERT INTO 
                    bookmarks (
                        postID, 
                        userID
                    ) 
                    VALUES(?, ?)
                    `;

    const values = [ postID, userID ];
    
    con.query(query, values, callback);
};

export const delPostBookmark = (postID, userID, callback) => {
    const query = `DELETE FROM bookmarks 
                        WHERE postID = ? AND userID = ?
                    `;
    
    const values = [ postID, userID ];

    con.query(query, values, callback);
};