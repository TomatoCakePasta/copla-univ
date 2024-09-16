import con from "../etc/db.js";

export const fetchTimeTableByUserId = (userID, callback) => {
    const query = `SELECT 
                        className,
                        dayID,
                        periodID
                    FROM timetable
                    WHERE userID = ?
                    ORDER BY dayID DESC, periodID DESC
                    `;

    con.query(query, [ userID ], callback);
};

export const updateTimetableByUsreId = (userID, timetable, callback) => {
    const query = `UPDATE timetable 
                        SET className = ?
                    WHERE 
                        userID = ? AND 
                        dayID = ? AND 
                        periodID = ?
                    `;

    let count = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const values = [ timetable[i][j], userID, i, j];
            con.query(query, values, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            else if (++count === 25) {
                                return callback(null);
                            }
                        }

            );
        }
    }
};