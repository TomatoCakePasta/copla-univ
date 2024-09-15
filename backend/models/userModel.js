import con from "../etc/db.js";

export const findUserByName = (name, callback) => {
    con.query(`SELECT * FROM users WHERE userName = ?`, [name], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        else {
            return callback(err, results);
        }
    });
};

export const getAllUsers = (callback) => {
    con.query(`SELECT * FROM users`, callback);
};

export const insertUser = (userID, hashed_pass, name, nextID, callback) => {
    con.query(
        `INSERT INTO 
            users (
                userID,
                password,
                userName,
                idName
            )
            VALUES (?, ?, ?, ?)
        `,
        [ userID, hashed_pass, name, nextID ],
        callback
    );
};

export const createTimetableForUser = (userID, callback) => {
    let count = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            con.query(
                `INSERT INTO 
                    timetable (
                        userID,
                        dayID,
                        periodID
                    )
                    VALUES (?, ?, ?)
                `,
                [ userID, i, j ],
                (err) => {
                    if (err) {
                        callback(err);
                    }
                    else if (++count === 25) {
                        callback(null);
                    }
                }
            );
        }
    }
};