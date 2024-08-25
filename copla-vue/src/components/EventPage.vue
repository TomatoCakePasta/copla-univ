<script setup>
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from 'vue-router';
import { mdiMagnify } from '@mdi/js';
import MenuPage from "./MenuPage.vue";
import AnalysisPage from "./AnalysisPage.vue";

const trend = ref(["カレー", "日替わり", "自炊"]);

// 本来はDB
// genre(number)でmenus[genre]に突っ込んでいくイメージ?
const menus = ref([
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

const router = useRouter();
const menuID = ref(0);

const keyContent = ref("");
const loading = ref(false);

const onMenu = (id) => {

    menuID.value = id;

    return;
}
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
                <v-text-field
                    :loading="loading"
                    density="compact"
                    label="検索 + Enter"
                    variant="solo"
                    hide-details
                    single-line
                    v-model="keyContent"
                    id="searchForm"
                    @keydown.enter="onKeySearch()"
                >
                </v-text-field>
                <v-btn color="primary" height="40" width="100"><v-icon color="white" size="30">{{ mdiMagnify }}</v-icon></v-btn>
            </v-card-text>

            <div class="trend flex ml-5 mt-3 mb-3">
                <h4 class="mt-auto mb-auto">TOP3</h4>
                <p class="ml-5 tag top mt-auto mb-auto">1位 {{ trend[0] }}</p>
                <p class="ml-5 tag second mt-auto mb-auto">2位 {{ trend[1] }}</p>
                <p class="ml-5 tag mt-auto mb-auto">3位 {{ trend[2] }}</p>
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
        一度投票確定したら、そのカードを縁取ったり、手ごたえを演出

        <!-- 学食, カフェ, 大学周辺, その他 -->
        <!-- メニューカードをクリックしたら、[コレにする! のダイアログでボタン表示] (小文字で※投票は1日1回です.と書いておく) -->
        <!-- propsで全ジャンルの全メニューと選択中のジャンルを渡す -->
        <MenuPage
            v-if="menuID >= 0"
            :menuID = "menuID"
            :menus = "menus"
        />

        <AnalysisPage v-else/>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
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
</style>