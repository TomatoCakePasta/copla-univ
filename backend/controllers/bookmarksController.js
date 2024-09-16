import { 
        fetchBookmarkPostsIdByUser,
        fetchBookmarkPostsByUser,
        addPostBookmark,
        delPostBookmark
    } from "../models/bookmarkModel.js";

// ブックマークした投稿ID
export const getUserBookmarkIds = (req, res) => {
    const userID = req.session.user.userID;
    console.log("/bookmarks getUserBookmarkIds");

    fetchBookmarkPostsIdByUser(userID, (err, results) => {
        if (err) {
            console.error("Failed to get bookmark posts id", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({flag: true, postIDs: results, bookmarks: results.length });
        }
    });
};

// ブックマークした投稿本文
export const getUserBookmarkPosts = (req, res) => {
    const userID = req.session.user.userID;
    console.log("/bookmarks/posts getUserBookmarkPosts");

    fetchBookmarkPostsByUser(userID, (err, posts) => {
        if (err) {
            console.error("Failed to get bookmark posts by user", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, posts: posts });
        }
    });
};

// ブックマーク追加
export const addBookmark = (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;

    console.log("post /bookmarks addBookmark");

    addPostBookmark(postID, userID, (err) => {
        if (err) {
            console.error("Failed to add post bookmark", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true });
        }
    });
};

// ブックマーク削除
export const delBookmark = (req, res) => {
    const postID = req.body.postID;
    const userID = req.session.user.userID;

    console.log("delete /bookmarks delBookmark");

    delPostBookmark(postID, userID, (err) => {
        if (err) {
            console.log("Failed to delete post bookmark", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    });
};