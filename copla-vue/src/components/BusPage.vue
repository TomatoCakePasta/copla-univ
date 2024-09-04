<script setup>
    import { onMounted, ref } from "vue";
    import axios from "axios";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    const stations = ref(["A", "B", "C"]);
    // const timeTable = ref([
    //     // A駅
    //     [
    //         // 大学行
    //         [
    //             { "departID": 1, "deptime": "08:15", "endtime": "08:23" },
    //             { "departID": 6, "deptime": "08:20", "endtime": "08:28" },
    //             { "departID": 7, "deptime": "08:23", "endtime": "08:31" },
    //         ],
    //         // 駅行
    //         [
    //             { "departID": 2, "deptime": "09:42", "endtime": "09:50" },
    //         ]
    //     ],
    //     // B駅
    //     [
    //         [
    //             { "departID": 3, "deptime": "08:23", "endtime": "08:33" },
    //         ],
    //         [
    //             { "departID": 4, "deptime": "10:26", "endtime": "10:36" },
    //         ]
    //     ],
    //     // C駅
    //     [
    //         [
    //             { "departID": 5, "deptime": "08:05", "endtime": "08:50" },
    //         ],
    //         [
    //             { "departID": 6, "deptime": "11:25", "endtime": "12:10" },
    //         ]
    //     ]
    // ]);

    const timeTable = ref([[]]);

    const INVALID_DATE = new Date("invalid date");

    const defaultTable = ref([[]]);
    // let rawTable;

    const selectedKey = ref(0);

    const time = ref({
        h: new Date().getHours(),
        m: new Date().getMinutes()
    });

    const busOffset = ref(0);
    const busLimit = ref(7);

    // 行先を変更して一覧表示
    const onBus = (key) => {
        selectedKey.value = key;
        return;
    }

    // A,B,C駅ごとに2次配列を作って、それを大元に入れると分かりやすい?

    const toUni = () => {
        // console.log(timeTable);
        return timeTable.value[selectedKey.value][0] ? timeTable.value[selectedKey.value][0] : null;
    }

    const toStation = () => {
        return timeTable.value[selectedKey.value][1] ? timeTable.value[selectedKey.value][1] : null;
    }

    // 指定時刻で早い順
    const timeSort = () => {
        console.log("ソート", time.value);

        let targetTime = getTimeFromRef(time.value);

        // 配列をコピーして編集
        // timeTable.value = JSON.parse(JSON.stringify(defaultTable.value));
        // timeTable.value = openTable(rawTable);

        console.log("timeTable", timeTable.value.length, timeTable);

        // 駅数分ソート
        for (let i = 0; i < timeTable.value.length; i++) {
            // 大学行と駅行
            for (let j = 0; j < 2; j++) {
                // 指定時間より前の要素で降順ソート
                console.log(`${i} ${j}`, timeTable.value[i][j]);
                const beforeTarget = timeTable.value[i][j]
                    .filter((table) => new Date(table.depTime) < targetTime)
                    .sort((a, b) => new Date(a.depTime) - new Date(b.depTime));

                // 指定時間以降の要素で降順ソート
                let afterTarget = timeTable.value[i][j]
                    .filter((table) => new Date(table.depTime) >= targetTime)
                    .sort((a, b) => new Date(a.depTime) - new Date(b.depTime));

                // if (i === 0 && j === 0) {
                //     console.log("afterTarget-", afterTarget);
                // }
                const ret = afterTarget.concat(beforeTarget);

                timeTable.value[i][j] = ret;

                // if (i === 0 && j === 0) {
                //     console.log("beforeTarget", beforeTarget);
                //     console.log("afterTarget", afterTarget);
                //     console.log("timeTable", timeTable.value[i][j]);
                // }
            }
        }

        console.log("指定時間以降", timeTable.value);
    }

    const onNext = () => {
        ++busOffset.value;
        ++busLimit.value;
    }

    const onPrev = () => {
        if (busOffset.value - 1 >= 0) {
            --busOffset.value;
            --busLimit.value;
        }
    }

    const onGetTable = () => {
        axios
            .get("/api/bus-table", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    // デフォルト値を保持
                    // rawTable = res.data.timetable;
                    // console.log("rawTable", rawTable);
                    // console.log("res.data.timetable", res.data.timetable);

                    timeTable.value = openTable(res.data.timetable);

                    // console.log("時刻表");
                    // console.log(timeTable.value);
                    // defaultTable.value = timeTable.value;
                }
            })
            .catch((err) => {

            });
    }

    // データを整理して格納
    const openTable = (tableDatas) => {
        let retArray = [];

        console.log("openTable");
        console.log(tableDatas);

        for (let idx in tableDatas) {
            const data = tableDatas[idx];
            const station = data.station;
            const dest = data.dest;
            // console.log(data);

            if (!retArray[station]) {
                retArray[station] = [];
            }

            if (!retArray[station][dest]) {
                retArray[station][dest] = [];
            }

            // console.log("引数", data.depTime);
            data.depTime = formatDate(data.depTime);
            data.endTime = formatDate(data.endTime);
            // console.log("戻り値", data.depTime);

            retArray[data.station][data.dest].push(data);
        }

        console.log("整理後");
        console.log(retArray);

        return retArray;
    }

    // 文字列のHH:MM:SSをDate型に変える
    const formatDate = (timeString) => {
        // console.log("timeString: ", timeString);

        // "MM:HH:SS"を:で区切って、Number型にする
        const [ h, m ] = String(timeString).split(":").map(Number);

        const date = new Date();

        date.setHours(h);
        date.setMinutes(m);

        // console.log(date);
        
        return date;
    }

    // 時間表示
    const dispTime = (datetime) => {
        // console.log(datetime.getHours());
        // getHours,Minutesは数値なので文字列にしてpadStartを使えるようにする
        const h = String(datetime.getHours()).padStart(2, "0");
        const m = String(datetime.getMinutes()).padStart(2, "0");

        // console.log(datetime);
        // console.log(typeof(datetime));

        return `${h}:${m}`;
        return datetime;
    }

    // 時間をDateオブジェクトに変換
    const getTimeFromRef = (timeRef) => {
        const ret = new Date();
        console.log("timeref", timeRef);
        ret.setHours(timeRef.hours);
        ret.setMinutes(timeRef.minutes);

        console.log(ret);
        return ret;
    }

    onMounted(() => {
        onGetTable();
        // timeSort();
    })
</script>

<template>
    <div>
        <div>
            <!-- {{ busOffset }} {{ busLimit }}
            <v-btn @click="onNext">Next</v-btn>
            <v-btn @click="onPrev">Prev</v-btn> -->
            <v-card-text
                class="flex"
            >
                <v-card height="40px" class="w-100 flex banner">
                    <h1 class="mr-auto ml-auto">大学バス</h1>
                </v-card>
            </v-card-text>

            <div class="trend flex ml-5 mt-3 mb-3">
                <h4 class="mt-auto mb-auto">運行状況 : 授業ダイヤ / 遅延 : 無し</h4>
            </div>
            <v-tabs
                bg-color="deep-purple-darken-4"
                center-active
            >
                <v-tab @click="onBus(0)">A駅</v-tab>
                <v-tab @click="onBus(1)">B駅</v-tab>
                <v-tab @click="onBus(2)">C駅</v-tab>
            </v-tabs>
        </div>

        <div class="">
            <div class="date-select ma-5">
                <VueDatePicker v-model="time" time-picker class="time-picker" @closed="timeSort"/>
            </div>
        </div>
        <!-- 時刻表 -->
        <!-- 
            スマホは1列 
            時間だけなら意外と2列で行けそうかも
         -->
        <div class="flex">
            <!-- 大学行 -->
            <div class="to-uni">
                <div class="flex">
                    <h1 class="ml-auto mr-auto">大学行</h1>
                </div>

                <!-- ノーマルは現在時刻を基準に早い順 -->
                <!-- for文で表示 -->
                <!-- <p v-if="toUni()">運行終了</p> -->
                <div
                    v-for="(uniBus) in toUni()" 
                    :key="uniBus.departID"
                >
                    <!-- limitの件数だけ表示 -->
                    <!-- さらに表示でlimitを増やしたり 次へでoffsetを1つ進めたり -->
                    <!-- <v-card 
                        v-if="busOffset <= index && index < busLimit" -->
                    <v-card
                        class="ml-5 mr-5 mb-5 pa-5" 
                        link>
                        {{ dispTime(uniBus.depTime) }}発 - {{ dispTime(uniBus.endTime) }}着
                    </v-card>
                </div>

                <!-- <v-timeline side="end">
                    <v-timeline-item
                        dot-color="green"
                        size="small"
                        v-for="i in 6"
                        :key="i"
                    >
                        <div class="d-flex">
                            <strong class="me-4">9:05発 - 9:15着</strong>
                        </div>
                        <v-alert
                            :value="true"
                        >
                            9:05発 - 9:15着
                        </v-alert>
                    </v-timeline-item>
                </v-timeline> -->
            </div>
            <div class="from-uni">
                <div class="flex">
                    <h1 class="ml-auto mr-auto">{{ stations[selectedKey] }}駅行</h1>
                </div>
                <v-card v-for="stationBus in toStation()" :key="stationBus.departID" class="ml-5 mr-5 mb-5 pa-5" link>
                    {{ dispTime(stationBus.depTime) }}発 - {{ dispTime(stationBus.endTime) }}着
                </v-card>

                <!-- <v-timeline side="end">
                    <v-timeline-item
                        dot-color="pink"
                        size="small"
                        v-for="i in 6"
                        :key="i"
                    >
                        <div class="d-flex">
                            <strong class="me-4">9:05発 - 9:15着</strong>
                        </div>
                        <v-alert
                            :value="true"
                        >
                            9:05発 - 9:15着
                        </v-alert>
                    </v-timeline-item>
                </v-timeline> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.w-100 {
    width: 100%;
    height: 100px;
}

.trend {
    height: 24px;
}

.tag {
    color: blue;
    cursor: pointer;
}

.banner {
    /* background-color:#ffac3f; */
    background-color:#311B92;
    color: rgb(255, 255, 255);
}

h3 {
    color:aliceblue;
}

.date-select {
    /* position: relative; */
    /* width:150px; */
}

.time-picker {
    /* position: absolute;
    top: -43px;
    right: 10px; */
}

.text-bold {
    font-weight: bold;
}

.to-uni {
    width: 50%;
    /* background-color: aliceblue; */
}

.from-uni {
    width: 50%;
    /* background-color: aliceblue; */
}
</style>