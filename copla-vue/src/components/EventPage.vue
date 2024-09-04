<script setup>
    import { onMounted, provide, ref } from "vue";
    import { RouterView, useRouter } from 'vue-router';
    import { mdiMagnify } from '@mdi/js';
    import MenuPage from "./MenuPage.vue";
    import AnalysisPage from "./AnalysisPage.vue";
    import axios from "axios";

    const trend = ref(["カレー", "日替わり", "自炊"]);

    // 本来はDB
    // genre(number)でmenus[genre]に突っ込んでいくイメージ?
    const menus = ref([]);
    /*
    ref([
        // 学食
        [
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
            ["カレー", "やさしい味", "250"], 
            ["日替わり", "今日は〇〇", "500"],
        ],
        // 学内カフェ
        [
            ["たらこパスタ", "安定のおいしさ", "400"], 
            ["ミートソースパスタ", "安定のおいしさ", "400"], 
            ["カレー", "絶品の中辛!", "360"],
            ["たらこパスタ", "安定のおいしさ", "400"], 
            ["ミートソースパスタ", "安定のおいしさ", "400"], 
            ["カレー", "絶品の中辛!", "360"],
            ["たらこパスタ", "安定のおいしさ", "400"], 
            ["ミートソースパスタ", "安定のおいしさ", "400"], 
            ["カレー", "絶品の中辛!", "360"],
            ["たらこパスタ", "安定のおいしさ", "400"], 
            ["ミートソースパスタ", "安定のおいしさ", "400"], 
            ["カレー", "絶品の中辛!", "360"],
            ["たらこパスタ", "安定のおいしさ", "400"], 
            ["ミートソースパスタ", "安定のおいしさ", "400"], 
            ["カレー", "絶品の中辛!", "360"],
        ],
        // キッチンカー
        [
            ["ケバブ", "4種のソースが最高", "500-700"], 
            ["からあげ", "驚きのボリューム", "400-600"]
        ],
        // 周辺
        [
            ["コンビニ", "忙しいあなたに", "100-1000"], 
            ["自炊", "節約上手!", "0-500"], 
            ["昼抜き", "せめて水だけでも...", "?"]
        ]
    ]);
    */

    const topMenus = ref([
        {"menuName": 0},
        {"menuName": 0},
        {"menuName": 0}
    ]);

    const router = useRouter();
    const menuID = ref(-1);
    const isVotedID = ref(-1);

    const keyContent = ref("");
    const loading = ref(false);

    onMounted(() => {
        console.log("EventPage読み込み");
        getMenus();
        isVoteRecorded();
        nowRank();
    })

    const onMenu = (id) => {

        menuID.value = id;
        nowRank();

        // getMenus();

        return;
    }

    const getMenus = () => {
        let datas;
        console.log("メニュー取得");

        axios.get("/api/menus", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    datas = res.data.menus;
                    console.log(datas);
                    console.log(datas.length);
                    console.log(datas[0].genre);

                    // データを整理して格納
                    openDatas(datas);
                    console.log("取得結果");
                    console.log(menus);

                    onMenu(0);
                }
                else {
                    console.log("Failed to get menus");
                }
            })
            .catch((err) => {
                console.error("Failed to get menus", err);
                return;
            })
    }

    // 現在の上位3メニュー
    const nowRank = () => {
        axios
            .get("/api/lunch-top", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    // 上位3件を格納
                    topMenus.value = res.data.rank;

                    console.log("トップ3", topMenus.value[0]);
                }
            })
            .catch((err) => {
                
            });
    }

    // DBから取得したデータを整理
    const openDatas = (datas) => {
        // console.log("データ展開", datas);
        const initMenus = [];
        for (let idx in datas) {
            // console.log(datas[idx].genre);
            if (!initMenus[datas[idx].genre]) {
                initMenus[datas[idx].genre] = [];
            }

            initMenus[datas[idx].genre].push(datas[idx]);
            // console.log(menus);
        }

        console.log(initMenus);
        console.log("展開後");
        menus.value = initMenus;
        console.log(menus);
    }

    // 投票済み確認
    // 投票したメニューIDを取得 or -1
    const isVoteRecorded = () => {
        axios.get("/api/isVoted", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    console.log(res.data.menuID[0].menuID);
                    isVotedID.value = res.data.menuID[0].menuID;
                    console.log(`${isVotedID.value}に投票済み`);
                }
                else {
                    console.log("新規ユーザです")
                }
            })
            .catch((err) => {
                console.error("Failed to check voted user", err);
            })
    }

    provide("isVotedID", isVotedID);
</script>

<template>
    <div>
        <!-- <h1>イベントページ (具体的な実装は未定)</h1>
        <h1>昼どうする?</h1>
        <h1>例:毎日10時-13時の間に学食ランキング投票するとか?</h1> -->

        <!-- {{ menus }}<br><hr>
        {{ menus[0] }}<br><hr>
        {{ menus[0][0] }}<br><hr>
        {{ menus[0][0][0] }}, {{ menus[0][0][1] }}<br> -->
        <div>
            <v-card-text
                class="flex"
            >
                <!-- 余裕があればランチ検索フォームにしたいけど、バナーもあり -->
                <!-- <v-text-field
                    :loading="loading"
                    density="compact"
                    label="検索 + Enter"
                    variant="solo"
                    hide-details
                    single-line
                >
                </v-text-field> -->
                <v-card height="40px" class="w-100 flex banner">
                    <h1 class="mr-auto ml-auto">メニュー</h1>
                </v-card>
                <!-- <v-btn color="primary" height="40" width="100"><v-icon color="white" size="30">{{ mdiMagnify }}</v-icon></v-btn> -->
            </v-card-text>

            <div class="trend flex ml-5 mt-3 mb-3">
                <h4 class="mt-auto mb-auto">TOP3</h4>
                <p class="ml-5 tag top mt-auto mb-auto" @click="onMenu(topMenus[0].genre)">1位 {{ topMenus[0].menuName }}</p>
                <p class="ml-5 tag second mt-auto mb-auto" @click="onMenu(topMenus[1].genre)">2位 {{ topMenus[1].menuName }}</p>
                <p class="ml-5 tag mt-auto mb-auto" @click="onMenu(topMenus[2].genre)">3位 {{ topMenus[2].menuName }}</p>
            </div>

            <!-- <v-card> -->
            <v-tabs
                bg-color="deep-purple-darken-4"
                center-active
            >
                <v-tab @click="onMenu(0)">学食</v-tab>
                <v-tab @click="onMenu(1)">カフェ</v-tab>
                <v-tab @click="onMenu(2)">キッチンカー</v-tab>
                <v-tab @click="onMenu(3)">大学周辺</v-tab>
                <v-tab @click="onMenu(-1)">投票状況</v-tab>
            </v-tabs>
            <!-- </v-card> -->
        </div>
        <!-- 一度投票確定したら、そのカードを縁取ったり、手ごたえを演出 -->

        <!-- 学食, カフェ, 大学周辺, その他 -->
        <!-- メニューカードをクリックしたら、[コレにする! のダイアログでボタン表示] (小文字で※投票は1日1回です.と書いておく) -->
        <!-- propsで全ジャンルの全メニューと選択中のジャンルを渡す -->
        <!-- {{ menus.length ? menus[0][0] : "" }}
        {{ isVotedID ? isVotedID : ""}} -->
        <MenuPage
            v-if="menuID >= 0"
            :key="menuID"
            :menuID = "menuID"
            :menus = "menus"
            :isVotedID="isVotedID"
        />

        <AnalysisPage 
            v-else
            :menus = "menus"
        />
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.w-100 {
    width: 100%;
}

.trend {
    height: 24px;
}

.tag {
    color: blue;
    cursor: pointer;
}

.top {
    /* font-size: 1.3rem; */
}

.second {
    /* font-size: 1.1rem; */
}

.banner {
    /* background-color:#ffac3f; */
    background-color:#311B92;
    color: rgb(255, 255, 255);
}

</style>