import { 
        insertNewPost,
        insertNewReply,
        getPostsByGenre,
        getPostById
     } from "../models/postModel.js";

// 新規投稿
export const createNewPost = (req, res) => {
    // セッションからuserIDを取得
    const userID = req.session.user.userID;
    const data = JSON.parse(req.body.data)
    let { content, genre, datetime, title, tags } = data;

    let pic = "";

    console.log("/posts createNewPost");

    if (req.file) {
        pic = req.file.filename;
        // console.log("pic: ", pic);
    }

    insertNewPost(userID, genre, content, pic, datetime, title, tags, (err) => {
        if (err) {
            console.error("Failed to post", err);
            res.status(200).send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    });
};

// 新規返信
export const createNewReply = (req, res) => {
    console.log("/posts/reply createNewReply");

    const userID = req.session.user.userID;
    const { postID, repContent, datetime } = req.body;

    insertNewReply(postID, userID, repContent, datetime, (err) => {
        if (err) {
            console.error("Failed to post reply", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, });
        }
    });
};

// 投稿取得
export const getPosts = (req, res) => {
    console.log("/posts/genre/:id, get all posts");
    let genre = +req.params.id;

    getPostsByGenre(genre, (err, posts) => {
        if (err) {
            console.error("Failed to get posts by genre", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, posts: posts });
        }
    });
};

// シングルポスト取得
export const getSinglePost = (req, res) => {
    const id = +req.params.id;
    console.log("/posts/single/:id, getSinglePost id = ", id);

    getPostById(id, (err, posts) => {
        if (err) {
            console.error("Failed to get posts by postId", err);
            res.send({ flag: false });
        }
        else {
            res.send({ flag: true, posts: posts });
        }
    });
};

// 自分の投稿取得
export const getMyPosts = (req, res) => {
    const userID = req.session.user.userID;

};

// 
export const searchPosts = (req, res) => {

};