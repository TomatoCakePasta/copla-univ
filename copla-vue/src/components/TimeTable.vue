<script setup>
    import { onMounted, ref, watch } from "vue";
    import { mdiAutorenew, mdiClockEditOutline } from "@mdi/js";
    import axios from "axios";

    const week = ["月", "火", "水", "木", "金"];
    const timetable = ref([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]);

    const editFlag = ref(false);

    onMounted(() => {
        getClasses();
    })

    // 時間割取得
    const getClasses = () => {
        axios.get("/api/timetable", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    // 取得した時間割を整理して格納
                    openClasses(res.data.timetable);
                    console.log("timeTable");
                    console.log(timetable);
                }
            })
            .catch((err) => {
                if (err) {
                    console.error("Failed to get timetable", err);
                }
            })
    }

    // 予定更新
    const onSetClasses = () => {

        const data = { classes: timetable.value }

        // 編集完了
        if (editFlag.value) {
            // 時間割更新
            axios.post("/api/set/timetable", data, { withCredentials: true })
                .then((res) => {
                    if (!res.data.flag) {
                        console.error("Something error");
                    }
                    else {
                        editFlag.value = !editFlag.value;
                    }
                })
                .catch((err) => {
                    if (err) {
                        console.error("Failed to set new timetable", err);
                    }
                })
        }
        else {
            // 編集モードにする
            editFlag.value = !editFlag.value;
        }
    }

    const openClasses = (classes) => {
        console.log("GET classes");
        for (let key in classes) {
            const classData = classes[key];
            // console.log(classData);
            timetable.value[classData.dayID][classData.periodID] = classData.className;
        }
    }
</script>

<template>
    <div>
        <!-- {{ editFlag }} -->
        <v-card class="ma-5 pa-1 plan-bg">
            <!-- <v-btn class="ml-auto edit-form rounded-circle" @click="editFlag = !editFlag">
                <v-icon size="30" class="">{{ editFlag ? mdiTableSync : mdiTablePlus }}</v-icon>
            </v-btn> -->
            <v-icon size="40" class="edit-form rounded-circle" color="white" @click="onSetClasses()">{{ editFlag ? mdiAutorenew : mdiClockEditOutline }}</v-icon>

            <v-container>
                <!-- <v-row v-for="m in 5" :key="m">
                    <h3>{{ m }}限</h3>
                    <v-col v-for="n in 5" :key="n">
                        <h3 v-if="m === 1">{{ week[n - 1] }}</h3>
                        <v-card class="pa-5">
                            {{ classes[n - 1][m - 1] }}
                        </v-card>
                    </v-col>
                </v-row> -->
                <v-row>
                    <v-col v-for="m in 5" :key="m" style="width: 20%">
                        <v-row><h3 class="ml-auto mr-auto pa-1">{{ week[m - 1] }}</h3></v-row>
                        <v-row v-for="n in 5" :key="n">
                            <v-card class="pa-1 w-100 ma-1 mb-2 plan-card" link v-if="editFlag">
                                <p class="period" v-if="m === 1">{{ n }}</p>
                                <v-textarea rows="2" no-resize v-model="timetable[m - 1][n - 1]"></v-textarea>
                            </v-card>
                            <v-card class="pa-1 w-100 ma-1 mb-2 plan-card" link v-else>
                                <p class="period" v-if="m === 1">{{ n }}</p>
                                {{ timetable[m - 1][n - 1] }}
                            </v-card>                        
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
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

h3 {
    color:aliceblue;
}

.plan-bg {
    background-color: rgb(121, 151, 118);
    overflow: visible;
}

.period {
    /* background-color: rgb(24, 83, 55); */
    background-color: rgb(147, 81, 54);
    color: white;
    position: absolute;
    top: -8px;
    left: -8px;
    width: 20px;
    height: 20px;
    text-align: center;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.edit-form {
    position: absolute;
    right: -15px;
    top: -15px;
    background-color:rgb(9, 98, 15);
}

.plan-card {
    background-color: rgb(253, 253, 253);
    white-space: pre-wrap;
    overflow: visible;
}
</style>