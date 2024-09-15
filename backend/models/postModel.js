import con from "../etc/db.js";

const baseQuery = `SELECT 
                    p.postID, 
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
                FROM posts p
                LEFT JOIN users u ON p.userID = u.userID 
                LEFT JOIN replies r ON p.postID = r.postID
                LEFT JOIN users u2 ON r.userID = u2.userID`;

export const insertNewPost = (userID, genre, content, pic, datetime, title, tags, callback) => {
    const query = `
                    INSERT INTO posts (
                        userID, 
                        genre, 
                        body, 
                        pic, 
                        datetime, 
                        title, 
                        tags
                    ) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)
                `;

    const values = [ userID, genre, content, pic, datetime, title, tags ];

    con.query(query, values, callback);
};

export const insertNewReply = (postID, userID, repContent, datetime, callback) => {
    const query = `
                    INSERT INTO replies (
                        postID, 
                        userID, 
                        body, 
                        datetime
                    ) 
                    VALUES(?, ?, ?, ?)
                `;
    const values = [ postID, userID, repContent, datetime ];
    
    con.query(query, values, callback);
};

export const getPostsByGenre = (genre, callback) => {
    let query = baseQuery;

    // 全投稿
    if (genre === 0) {
        query += " ORDER BY p.datetime DESC";
    }
    // 特定ジャンル
    else {
        query += ` WHERE p.genre = ${ genre } ORDER BY p.datetime DESC`;
    }

    con.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }

        // 結果に画像URLを追加
        const postsWithImageUrls = results.map(post => ({
            ...post,
            picUrl: post.postPic ? `/images/${post.postPic}` : null
        }));

        return callback(null, postsWithImageUrls);
    });
};

export const getPostById = (postId, callback) => {
    const query = `${baseQuery} 
                WHERE p.postID = ? 
                ORDER BY p.datetime DESC`;

    con.query(query, [postId], (err, results) => {
        if (err) {
            console.error("DB query error:", err);
            return callback(err);
        }

        const postsWithImageUrls = results.map(post => ({
            ...post,
            picUrl: post.postPic ? `/images/${post.postPic}` : null
        }));

        return callback(null, postsWithImageUrls);
    });

};