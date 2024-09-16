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

const executeGetPostsQuery  = (query, params, callback) => {
    con.query(query, params, (err, results) => {
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

export const fetchPostsByGenre = (genre, callback) => {
    let query = baseQuery;

    // 全投稿
    if (genre === 0) {
        query += " ORDER BY p.datetime DESC";
    }
    // 特定ジャンル
    else {
        query += ` WHERE p.genre = ${ genre } ORDER BY p.datetime DESC`;
    }

    executeGetPostsQuery(query, [], callback);
};

export const fetchPostById = (postId, callback) => {
    const query = `${baseQuery} 
                WHERE p.postID = ? 
                ORDER BY p.datetime DESC`;

    executeGetPostsQuery(query, [ postId ], callback);
};

export const fetchPostsByUserId = (userID, callback) => {
    const query = `${baseQuery} 
                    WHERE p.userID = ? 
                    ORDER BY p.postID DESC
                    `;
    
    executeGetPostsQuery(query, [ userID ], callback);
};

export const fetchPostsByKeyword = (rowWords, callback) => {
    const queryWords = rowWords.map(word => `%${word}%`);
    const genreWords = { "授業": 1, "サークル": 2, "研究室": 3, "就活": 4, "その他": 5, "イベント": 6, "記事": 7 };
    let genreIDs = [];
    let genre = 0;

    let query = baseQuery;

    if (rowWords.length > 0) {
        query += " WHERE";
    }

    query += queryWords.map((word) => ` p.body LIKE '${ word }' OR p.title LIKE '${ word }' OR u.userName LIKE '${ word }'`).join(" OR ");
    // OR p.genre = ?

    // 記事タイトルも

    // もしタグ名が含まれていたら
    rowWords.some((word) => {
        if (genreWords[word]) {
            genreIDs.push(genreWords[word]);
        }
        // Allタグの場合 
        // スマートではない 本来はWHERE無しでgetPostsByGenre(0)を呼びたい
        else if (word === "All") {
            for (let i = 0; i <= Object.keys(genreWords).length; i++) {
                genreIDs.push(i);
            }
        }
    });

    if (genreIDs.length > 0) {
        query += ` OR p.genre IN (${ genreIDs }) ORDER BY p.datetime DESC`;
    }
    else {
        query += ` ORDER BY p.datetime DESC`;
    }

    executeGetPostsQuery(query, [], callback);
}