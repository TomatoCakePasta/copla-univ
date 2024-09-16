<script setup>
    import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    const props = defineProps({
        menuID: {
            type: Number,
            required: true
        },
        menus: {
            type: Array,
            required: true
        },
        isVotedID: {
            type: Number,
            required: true 
        },
    });

    const genre = ref(+props.menuID);

    const menus = ref();
    const menuDialog = ref(false);
    const selectedMenu = ref(0);
    const singleMenu = ref([]);
    // const isVotedID = ref();
    const isVotedID = inject("isVotedID");

    onMounted(() => {
        console.log("全メニュー");
        menus.value = props.menus;
        console.log(menus);
        genre.value = +props.menuID;

        // isVotedID.value = props.isVotedID;
        console.log(isVotedID.value, "に投票");
    })

    onUnmounted(() => {
        console.log("さよなら");
    })

    // watch(() => props.menus, (newMenus) => {
    //     menus.value = newMenus;
    //     console.log("メニュー更新");
    //     console.log(menus);
    // })

    // watch(() => props.menuID, (newID) => {
    //     console.log(+newID);
    //     // 念のためキャスト
    //     genre.value = +newID;
    // });

    // watch(() => props.isVotedID, (newID) => {
    //     console.log(newID, "に投票済み menuPage");
    //     isVotedID.value = newID;
    // })

    const openDialog = (idx) => {
        // console.log(id, "番目のメニュー");
        menuDialog.value = true;
        selectedMenu.value = idx;
        console.log(menus.value[genre.value][idx]);
        singleMenu.value = menus.value[genre.value][idx];
    }

    const onVote = (id) => {
        // 投票済みならメソッド実行ボタン自体が秘匿だから大丈夫なはず
        // console.log("いいね", menus.value[genre.value][selectedMenu.value].fav);

        console.log("新規投票");
        // 新規投票
        axios.post("/api/menu/vote", { menuID: id }, { withCredentials: true })
            .then((res) => {
                isVotedID.value = id;

                console.log(isVotedID.value, "に投票");
                menus.value[genre.value][selectedMenu.value].fav += 1;
                menuDialog.value = false;
            })
            .catch((err) => {
                console.error("Failed to vote", err);
            })
    }

    // 未投票の場合trueｓ
    const isNotVoted = () => {
        return isVotedID.value < 0;
    }

</script>

<template>
    <div>
        <!-- {{ props.menus[genre.value] }} -->
        <!-- <h1>メニュー {{  genre }} {{ menus[genre] }}</h1> -->
        <!-- {{ genre }} {{ menus ? menus[genre] : "" }} -->
        <v-container v-if="menus">
            <v-row>
                <!-- そのジャンルのメニューの料理を取得 -->
                <!-- <v-col v-for="(menu, index) in menus[genre]" :key="index" cols="6" sm="3"> -->
                <v-col v-for="(menu, index) in menus[genre]" :key="index" cols="6" sm="4">
                    <!-- 各料理でカードを作成 -->
                    <!-- {{ isVotedID }}
                    {{ menu.menuID }} -->

                    <v-card 
                        link
                        @click="openDialog(index)"
                    >
                        <!-- 画像 -->
                        <v-img
                            :src="`/menus/${menu.image}`"
                            class="align-end"
                        >
                            <p class="vote pl-1 pr-1 yourself" v-if="menu.menuID === isVotedID">{{ menu.fav }} 票</p>
                            <p class="vote pl-1 pr-1" v-else>{{ menu.fav }} 票</p>
                        </v-img>

                        <div class="ml-2">
                            <div class="flex">
                                <p>{{ menu.menuName }}</p>
                                <p class="ml-auto mr-2">{{ menu.price }}円</p>
                            </div>
                            <p>{{ menu.comment }}</p>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog
            v-model="menuDialog"
        >
            <div class="flex" style="justify-content: center;">
                <v-card
                    max-width="400px"
                    class="w-100p"
                >
                    <!-- {{ singleMenu.menuID }} -->
                    <v-img
                            :src="`/menus/${singleMenu.image}`"
                            class="align-end"
                        >
                        <p class="vote pl-1 pr-1" :class="{ 'yourself' : singleMenu.menuID === isVotedID }">{{ singleMenu.fav }} 票</p>
                    </v-img>

                    <div class="ma-2">
                        <div class="flex">
                            <p>{{ singleMenu.menuName }}</p>
                            <!-- <p class="ml-auto mr-2">{{ singleMenu.price }}円</p> -->
                        </div>
                        <p>{{ singleMenu.comment }}</p>

                        <div class="flex">
                            <p>{{ singleMenu.detail }}</p>
                            <p class="ml-auto mr-2">{{ singleMenu.price }}円</p>
                        </div>
                    </div>
                    <!-- <hr> -->

                    <div class="flex end ma-2">
                        <p class="mt-auto sub-info" v-if="isVotedID < 0">投票は1日1回</p>
                        <p class="mt-auto" v-if="singleMenu.menuID === isVotedID">今日はコレ!</p>
                        <v-btn
                            text="閉じる"
                            color="grey-lighten-4"
                            class="ml-auto"
                            @click="menuDialog = false"
                        ></v-btn>
    
                        <v-btn
                            text="投票!"
                            class="ml-5"
                            color="light-blue-accent-4"
                            @click="onVote(singleMenu.menuID)"
                            v-if="isVotedID < 0"
                        ></v-btn>
                        <!-- @click="onPost(); postDialog = false; " -->
                    </div>
                </v-card>
            </div>
        </v-dialog>

    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.w-100p {
    width: 80%;
}

.vote {
    position: absolute;
    top: 0px;
    right: 0px;
    background: rgba(255, 255, 255, 0.521);
    /* background: rgba(255, 246, 73, 0.648); */
}

.yourself {
   background: rgba(255, 246, 73, 0.648);
}

.sub-info {
    color:rgb(140, 140, 140);
}
</style>