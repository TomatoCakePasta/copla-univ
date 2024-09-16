import { 
    getLikedPostsIdByUser,
    getLikedRepliesIdByUser,
    addPostFav,
    addReplyFav
 } from "../models/likeModel.js";

// いいねした通常投稿ID
export const getUserLikedPostIds = (req ,res) => {
    const userID = req.session.user.userID;

    getLikedPostsIdByUser(userID, (err, results) => {
        if (err) {
            console.error("Failed to get liked posts by user", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, postIDs: results, favs: results.length });
        }
    });
};

// いいねした返信ID
export const getUserLikedReplyIds = (req, res) => {
    const userID = req.session.user.userID;

    getLikedRepliesIdByUser(userID, (err, results) => {
        if (err) {
            console.error("Failed to get liked replies by user", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, repIDs: results, favs: results.length });
        }
    });
};

// 通常投稿いいね押下
export const likePost = (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;

    addPostFav(postID, userID, (err) => {
        if (err) {
            console.error("Failed to add post fav", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true });
        }
    });
};

// 返信いいね押下
export const likeReply = (req, res) => {
    const repID = req.body.repID;
    const userID = req.session.user.userID;

    addReplyFav(repID, userID, (err) => {
        if (err) {
            console.error("Failed to add reply fav", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true });
        }
    });
};