<script setup>
    import { onMounted, ref } from "vue";
    import TimeTable from "./TimeTable.vue";
    import { useRouter } from "vue-router";

    const week = ["月", "火", "水", "木", "金"];
    const classes = ref([
        ["", "生命科学概論", "基礎物理学実験", "基礎物理学実験", ""],
        ["基礎微積文学A", "", "基礎線形代数学A", "英語2A", ""],
        ["科学A", "", "コンピュータ設計論", "ビジネス心理学", ""],
        ["経済論", "ドイツ語", "", "", ""],
        ["", "C言語", "", "英語1A(再履修)", ""]
    ]);
    
    const editFlag = ref(false);

    const router = useRouter();

    onMounted(() => {
        router.push({ name: "timetable" });
    });
</script>

<template>
    <div>
        <div>
            <v-card-text
                class="flex"
            >
                <v-card height="40px" class="w-100 flex banner">
                    <h1 class="mr-auto ml-auto">マイページ</h1>
                </v-card>
                <!-- <v-btn color="primary" height="40" width="100"><v-icon color="white" size="30">{{ mdiMagnify }}</v-icon></v-btn> -->
            </v-card-text>
            Copla Newsを自分のメモに変えたり

            <!-- <v-card> -->
            <v-tabs
                bg-color="deep-purple-darken-4"
                center-active
            >
                <v-tab to="/mypage/timetable">予定表</v-tab>
                <v-tab to="/mypage/myfavorite">お気に入り</v-tab>
                <v-tab to="/mypage/myposts">自分の投稿</v-tab>
                <v-tab to="/mypage/settings">設定</v-tab>
            </v-tabs>
            <!-- </v-card> -->
        </div>

        <!-- あとでRouterViewにする -->
        <!-- <TimeTable 
            :editFlag = "editFlag"
        /> -->

        <RouterView />
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

.plan-bg {
    background-color: rgb(121, 151, 118);
}

.plan-card {
    background-color: rgb(253, 253, 253);
}
</style>