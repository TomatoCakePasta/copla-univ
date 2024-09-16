import con from "../etc/db.js";

export const fetchTransitTimetable = (callback) => {
    const query = `SELECT 
                        station,
                        dest,
                        depTime,
                        endTime,
                        schedule
                    FROM bustime
                    ORDER BY
                        station,
                        dest,
                        depTime
                    ASC
                    `;
    
    con.query(query, callback);
}