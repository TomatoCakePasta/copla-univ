<script setup>
    import { 
            mdiHome
            ,mdiPencilOutline
            ,mdiAlertDecagramOutline
            ,mdiFileDocumentEditOutline
            ,mdiAccountSchoolOutline
            ,mdiCogOutline
            ,mdiLogin
            ,mdiLogout
            ,mdiExitRun
            ,mdiSilverwareForkKnife
            ,mdiBusClock
            } from '@mdi/js';

    import { ref, computed, onMounted, watch, inject } from 'vue';
    import { RouterLink, RouterView, useRouter } from 'vue-router'
    import { useDisplay } from 'vuetify/lib/framework.mjs';
    import axios from 'axios';
    
    const loginFlag = ref(true);

    const props = defineProps({
        socket: Object
    });

    // 画面サイズを監視
    // const device = inject("device");

    // PC画面の半分以下か判定
    const isLessHalf = inject("isLessHalf");
    // スマホ画面か判定
    const isMobile = inject("isMobile");

    const postFormFlag = ref(false);
    const postDialog = ref(false);

    const chatContent = ref("");
    const chatTitle = ref("");

    const imageFile = ref(null);

    const router = useRouter();

    // -1ならAllジャンル
    const selectedKey = ref(0);
    
    const items = ref([
        { key: 0, value: "All" },
        { key: 1, value: "授業" },
        { key: 2, value: "サークル" },
        { key: 3, value: "研究室" },
        { key: 4, value: "就活" },
        { key: 5, value: "その他" },
        { key: 6, value: "イベント" },
        { key: 7, value: "記事" },
        { key: 8, value: "忘れ物" }
    ]);

    const chips = ref([]);

    // ログアウト処理
    const onLogout = () => {
        loginFlag.value = !loginFlag.value;
        
        // ログアウトリクエスト
        // セッションをクリアする
        axios.post("/api/logout", {}, { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    console.log("Success to logout");
                    router.push({ name: "login" });
                }
                else {
                    alert("Failed to logout");
                    return;
                }
            })
            .catch((err) => {
                console.error("Error during logout:", err);
            });
    }

    // リロード時に実行
    onMounted(() => {
        // console.log(device);
    })

    // 画面サイズ監視
    // watch(device.name, () => {
    //     isMobile.value = device.xs.value;
    //     isLessHalf.value = device.smAndDown.value;

    //     console.log("isMobile : " + isMobile.value + "Half : " + isLessHalf.value);
    // })

    const onTest = (beforeImage) => {
        if (true) {
            let formData = new FormData();
            console.log("before ", beforeImage);

            // UTF-8を別の形式に変換,(エンコードする)
            if (beforeImage) {
                formData.append("image", beforeImage, encodeURIComponent(`${beforeImage.name}`));
            }
            console.log(formData);


            const config = {
                header: {
                    "Content-Type": "multipart/form-data",
                },
            }

            axios
                .post("/api/image-post", formData, config)
                .then((res) => {

                })
                .catch((err) => {

                });
        }
        else {
            alert("Input an image");
        }
    }

    const onPostForm = () => {
        console.log("open post form");
        postFormFlag.value = true;
    }

    const onPost = (postImg) => {
        if (chatContent.value === "") {
            alert("投稿内容を入力してください");
            return;
        }

        let formData = new FormData();

        // 画像が添付された場合
        if (postImg) {
            formData.append("image", postImg, encodeURIComponent(`${postImg.name}`));
        }

        const config = {
                header: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            };

        const postTime = getTime();

        const tagString = chips.value.join(",");

        const data = { 
            content: chatContent.value,
            genre: selectedKey.value,
            datetime: postTime,
            title: chatTitle.value,
            tags: tagString
        };

        // 直接オブジェクトを送れないので
        // Jsonに変換して渡す
        formData.append("data", JSON.stringify(data));

        console.log("以下で送信");
        console.log(formData);

        // postリクエスト
        axios.post("/api/post", formData, config)
            .then((res) => {
                if (res.data.flag) {
                    // フォームを閉じる
                    postDialog.value = false; 
    
                    chatContent.value = "";

                    // ソケット
                    props.socket.emit("makePost");
                }
            })
            .catch((err) => {
                console.error("Failed to post", err);
                alert("Failed to post", err);
            });
    }

    const getTime = () => {
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const H = String(date.getHours()).padStart(2, "0");
        const M = String(date.getMinutes()).padStart(2, "0");
        const s = String(date.getSeconds()).padStart(2, "0");

        return `${y}-${m}-${d} ${H}:${M}:${s}`;
    }

    const checkInput = () => {
        const trimmedInput = String(chips.value[chips.value.length - 1]).trim();

        console.log("Enter");

        console.log(chips.value);

        if (trimmedInput === "" || chips.value.length > 5) {
            chips.value.splice(chips.value.length - 1 ,1)
            return;
        }
    }
</script>

<template>
    <div class="back-body">
        <!-- PC版 -->
        <!-- PC画面の半分以下, タブレットなら左部でたたむ -->
        <v-navigation-drawer 
            :width="300" 
            :rail="isLessHalf"
            rail-width="100"
            permanent
            v-if="!isMobile"
        >
            <v-list>
                <v-list-item title="">
                <!-- <v-icon :icon="mdiAccount"></v-icon> -->
                <!-- 
                    to属性で移動するURLを指定します, 
                    router/index.jsでルーティング処理されて必要なコンポーネントが
                    App.vueの<RouterView />に挿入されます
                -->
                    <RouterLink to="/">
                        <div class="flex mouse topLogo">
                            <img src="../assets/logo.png" alt="">
                            <v-list-item title="Copla" subtitle="技育博 体験版">
                            <!-- subtitle="for all students at DU" -->
                                <!-- <img src="../assets/logo.png"> -->
                            </v-list-item>
                        </div>
                    </RouterLink>

                    <v-divider></v-divider>

                    <v-list-item link to="/" exact class="rounded-xl">
                        <div class="flex">
                            <v-icon size="40">{{ mdiHome }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">ホーム</p>
                        </div>
                    </v-list-item>

                    <v-list-item link to="" class="rounded-xl" @click="postDialog = true">
                        <div class="flex">
                            <v-icon size="40">{{ mdiPencilOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">投稿</p>
                        </div>
                    </v-list-item>

                    <v-list-item link to="/event" class="rounded-xl">
                        <div class="flex">
                            <!-- <v-icon size="40">{{ mdiAlertDecagramOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">Event</p> -->
                            <v-icon size="40">{{ mdiSilverwareForkKnife }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">学食</p>
                        </div>
                    </v-list-item>

                    <v-list-item link to="/bus" class="rounded-xl">
                        <div class="flex">
                            <!-- <v-icon size="40">{{ mdiAlertDecagramOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">Event</p> -->
                            <v-icon size="40">{{ mdiBusClock }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">大学バス</p>
                        </div>
                    </v-list-item>

                    <!-- <v-list-item link to="/myfavorite" class="rounded-xl">
                        <div class="flex">
                            <v-icon size="40">{{ mdiFileDocumentEditOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">ブックマーク</p>
                        </div>
                    </v-list-item> -->

                    <v-list-item link to="/mypage" class="rounded-xl">
                        <div class="flex">
                            <v-icon size="40">{{ mdiAccountSchoolOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">マイページ</p>
                        </div>
                    </v-list-item>

                    <!-- <v-list-item link to="settings" class="rounded-xl">
                        <div class="flex">
                            <v-icon size="40">{{ mdiCogOutline }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">設定</p>
                        </div>
                    </v-list-item> -->

                    <v-list-item link to="" class="rounded-xl" @click="onLogout">
                        <div class="flex">
                            <v-icon size="40">{{ mdiLogout }}</v-icon>
                            <p class="ml-5 v-center flex" v-if="!isLessHalf">ログアウト</p>
                        </div>
                    </v-list-item>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- ブラウザでオーバレイで包まれるクラスにpost-formを適用したい -->
        <!-- <div class="text-center pa-4" :width="300" style="position: fixed;">

        </div> -->

        <!-- 投稿フォームのダイアログです.普段は隠しています -->
        <v-dialog
            v-model="postDialog"
        >
            <div class="flex" style="justify-content: center;">
                <v-card
                    max-width="800px"
                    class="w-100p"
                >
                    <!-- focusでダイアログ開いたらフォームにカーソル当てた方がいいかも -->
                    <v-card-text>
                        <v-text-field variant="outlined" v-if="selectedKey === 7" placeholder="タイトル" v-model.trim="chatTitle"></v-text-field>
                        <v-textarea variant="outlined" placeholder="投稿内容" class="area" v-model.trim="chatContent"></v-textarea>

                        <v-combobox
                            v-model="chips"
                            label="オリジナルタグ + Enter 最大5個"
                            variant="solo"
                            chips
                            clearable
                            multiple
                            @blur="checkInput()"
                            @keydown.enter="checkInput()"
                        >
                            <template v-slot:selection="{ attrs, item }">
                                <v-chip
                                    v-bind="attrs"
                                    closable
                                    @click:close="remove(item)"
                                >
                                    <strong>{{ item }}</strong>&nbsp;
                                </v-chip>
                            </template>
                        </v-combobox>
                        <!-- {{ chips }} -->

                        <!-- 画像アップロード -->
                        <v-file-input
                            accept="image/*"
                            label="File"
                            v-model="imageFile"
                        ></v-file-input>

                        <v-select
                            v-model="selectedKey"
                            :items="items"
                            item-value="key"
                            item-title="value"
                            label="Select Genre"
                        ></v-select>
                    </v-card-text>
                    <!-- <select v-model="selectedKey">
                        <option v-for="(item, index) in items" :key="index" :value="item.key">{{ item.value }}</option>
                    </select> -->

                    <!-- {{ selectedKey }} -->

                    <div class="flex end pa-4">
                        <v-btn
                            text="閉じる"
                            @click="postDialog = false"
                        ></v-btn>
    
                        <v-btn
                            text="送信"
                            @click="onPost(imageFile)"
                            class="ml-5"
                        ></v-btn>
                        <!-- @click="onPost(); postDialog = false; " -->
                    </div>
                </v-card>
            </div>
        </v-dialog>

        <!-- スマホ版 -->
        <!-- アイコンは多くて6つまで! -->
        <!-- <v-app-bar height="40" v-if="isMobile">
            <v-list-item link to="mypage" title="" class="pa-0 ma-1 rounded-circle">
                <v-icon size="40">{{ mdiAccountSchoolOutline }}</v-icon>
            </v-list-item>
            Copla for all students at DU
        </v-app-bar> -->
        <v-bottom-navigation
            v-if="isMobile"
            :height="60"
        >
            <div class="flex phoneMenu">
                <v-list-item link to="/" exact title="" class="pa-0 ma-1 pa-1 rounded-circle">
                    <v-icon size="40">{{ mdiHome }}</v-icon>
                </v-list-item>

                <v-list-item link to="" title="" class="pa-0 ma-1 pa-1 rounded-circle" @click="postDialog = true">
                    <v-icon size="40">{{ mdiPencilOutline }}</v-icon>
                </v-list-item>

                <v-list-item link to="/event" title="" class="pa-0 ma-1 pa-1 rounded-circle">
                    <!-- <v-icon size="40">{{ mdiAlertDecagramOutline }}</v-icon> -->
                    <v-icon size="40">{{ mdiSilverwareForkKnife }}</v-icon>
                </v-list-item>

                <!-- <v-list-item link to="/myfavorite" title="" class="pa-0 ma-1 pa-1 rounded-circle">
                    <v-icon size="40">{{ mdiFileDocumentEditOutline }}</v-icon>
                </v-list-item> -->

                <v-list-item link to="/bus" title="" class="pa-0 ma-1 pa-1 rounded-circle">
                    <v-icon size="40">{{ mdiBusClock }}</v-icon>
                </v-list-item>

                <!-- マイページはトップバーとかにする? -->
                <v-list-item link to="mypage" title="" class="pa-0 ma-1 pa-1 rounded-circle">
                    <v-icon size="40">{{ mdiAccountSchoolOutline }}</v-icon>
                </v-list-item>

                <!-- クリック数が増えてしまうけど、マイページから設定に飛べるようにする? -->
                <!-- <v-list-item link to="settings" title="" class="pa-0 ma-1 rounded-circle">
                    <v-icon size="40">{{ mdiCogOutline }}</v-icon>
                </v-list-item> -->
    
                <v-list-item link to="" title="" @click="onLogout" class="pa-0 ma-1 pa-1 rounded-circle">
                    <v-icon size="40">{{ mdiLogout }}</v-icon>
                </v-list-item>
            </div>
        </v-bottom-navigation>
    </div>
</template>

<style scoped>

.flex {
    display: flex;
}

.bottom-nav {
    display: block;
}

.w-100p {
    width: 100%;
}

.end {
    justify-content: end;
}

.post-form {
    display: flex;
    align-items: center;
    width: 100%;
}

.pc-center {
    margin-left: 19.2%;
}

.v-center {
    align-items: center;
}

a {
    color: inherit;
    text-decoration: none;
}

.topLogo {
    margin: 15px;
}

.mouse:hover {
    /* background: rgb(240, 240, 240); */
    background: white;
    cursor: pointer;
    /* transition: 0.2s; */
}

img {
    width: 40px;
    height: 40px;
}

.phoneMenu {
    justify-content: space-around;
}
</style>