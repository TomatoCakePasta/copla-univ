import { 
        getTimeTableByUserId,
        updateTimetableByUsreId
    } from "../models/scheduleModel.js";

// 時間割取得
export const getUserTimetable = (req, res) => {
    const userID = req.session.user.userID;

    console.log("get /schedule getUserTimetable");

    getTimeTableByUserId(userID, (err, timetable) => {
        if (err) {
            console.error("Failed to get timetable by userID", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, timetable: timetable });
        }
    });
};

// 時間割更新
export const updateUserTimetable = (req, res) => {
    const userID = req.session.user.userID;
    const timetable = req.body.classes;
    
    console.log("post /schedule updateUserTimetable");

    updateTimetableByUsreId(userID, timetable, (err) => {
        if (err) {
            console.error("Failed to update timetable by userID", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true });
        }
    });
};