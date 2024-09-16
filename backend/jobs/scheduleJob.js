import schedule from "node-schedule";
import { recordVotes } from "./recordVotes";

// 投票リセット
// second, minute, hour, day of month, month, day of weekの順に指定
// 毎日23:00にその日の投票結果を記録する
export const job = schedule.scheduleJob('0 0 23 * * *', function(){
    console.log("本日の投票をリセットします");

    recordVotes();
});

// 直書きでサーバ起動時に実行される
// recordVotes();