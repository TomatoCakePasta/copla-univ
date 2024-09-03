<script setup>
    import { ref } from "vue";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    const time = ref({
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    });
</script>

<template>
    <div>
        <div>
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
                <v-tab @click="onMenu(0)">A駅</v-tab>
                <v-tab @click="onMenu(1)">B駅</v-tab>
                <v-tab @click="onMenu(2)">C駅</v-tab>
            </v-tabs>
        </div>

        <div class="">
            <div class="date-select ml-auto">
                <VueDatePicker v-model="time" time-picker class="time-picker" />
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
                <v-card v-for="i in 6" :key="i" class="ml-5 mr-2 mb-5 pa-5">
                    9:50発 - 10:00着
                </v-card>
            </div>
            <div class="from-uni">
                <div class="flex">
                    <h1 class="ml-auto mr-auto">--駅行</h1>
                </div>
                <v-card v-for="i in 6" :key="i" class="ml-2 mr-5 mb-5 pa-5">
                    hello
                </v-card>
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

.to-uni {
    width: 50%;
    /* background-color: aliceblue; */
}

.from-uni {
    width: 50%;
    /* background-color: aliceblue; */
}
</style>