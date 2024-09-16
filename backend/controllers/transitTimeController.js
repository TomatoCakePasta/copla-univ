import { 
        fetchTransitTimetable
    } from "../models/transitTimeModel.js";

// 時刻表を取得
export const getTransitTimetable = (req, res) => {
    console.log("/transit getTransitTimetable");
    
    fetchTransitTimetable((err, timetable) => {
        if (err) {
            console.error("Failed to fetch timetable", err);
            res.send({ flag: false });
        }
        else {
            res.status(200).send({ flag: true, timetable: timetable });
        }
    });
};