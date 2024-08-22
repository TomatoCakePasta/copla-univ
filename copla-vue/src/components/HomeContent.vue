<script setup>
    import { ref, onMounted, inject, onUnmounted } from "vue";
    import PostContent from './PostContent.vue';
    import axios from "axios";
    import io from "socket.io-client";

    // definePropsはマクロなので未宣言で使用可
    const props = defineProps({
        socket: Object
    });

    const socket = props.socket;

    // const loginName = inject("loginName");
    // const loginID = inject("loginID");

    // 画面読み込み時
    onMounted(() => {
        // 投稿を取得
        getDatas();
    });

    // 投稿をaxiosで送ります
    // https://axios-http.com/ja/docs/example

    // Proxyとかでデータが受け取りたいです
    // username, content, titleとか

    const chatContent = ref("");
    const postId = ref(1);
    const repId = ref(1);
    const getMsg = ref();

    const postsImageData = ref();

    const samplePost = ref({ id: postId.value++, userName: "Taro", content: "Hello1", replies: 
            [
                {id: repId.value++, userName: "Taro", content: "返信"}, 
                {id: repId.value++, userName: "Shimizu", content: "返信2"}
            ] 
        });

    // 投稿ボタンが押された場合
    const onSubmit = () => {
        if (chatContent.value !== "") {
            const post = {
                id: postId.value++,
                userName: "Taro Yamada",
                content: chatContent.value,
                replies: null
            }

            console.log(post);

            postsImageData.value.unshift(post);
            console.log(postsImageData);

            chatContent.value = "";
        }
        else {
            alert("Write something");
        }
    };

    // 投稿を取得
    // 画面読み込み時, 一定間隔, ソケットイベント検知などのタイミングで呼出
    const getDatas = () => {
        // 以下のURLに投稿取得リクエストをします
        axios.get("http://localhost:3000/get/all", {withCredentials: true})
            .then((res) => {
                postsImageData.value = nestPostsAndReplies(res.data.posts);
                // console.log(postsImageData);
                // console.log("GET DATA");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // ジャンル選択
    const onSearch = (word) => {
        console.log(`${ word }の投稿を表示`);

        // axiosでリクエスト送る?
    };

    function nestPostsAndReplies(data) {
        // 投稿IDをキーにして、投稿とその返信を格納するマップ
        const postsMap = new Map();

        // 元のデータをループして、投稿とその返信をグループ化する
        data.forEach(item => {
            // 投稿がまだマップにない場合は追加
            if (!postsMap.has(item.postID)) {
                postsMap.set(item.postID, {
                    postID: item.postID,
                    postName: item.postName,
                    postContent: item.postContent,
                    // postUserIcon: 0,
                    postFav: item.postFav,
                    postTime: item.postTime,
                    postGenre: item.genre,

                    // 投稿を送った人のidを追記
                    // postUserId: item.postUserId,

                    // 学系学部学年とか
                    // position: item.position,
                    // department: item.department,
                    // location: item.location,

                    // lastEnterTime: item.lastEnterTime,
                    replies: []  // 返信の配列
                });
            }
            
            // 投稿に対する返信を追加
            if (item.repName) {
                postsMap.get(item.postID).replies.push({
                    repID: item.repID,
                    repName: item.repName,
                    repContent: item.repContent,
                    // repUserIcon: item.repUserIcon,
                    repTime: item.repTime,
                    repFav: item.repFav,
                    // 返信を送った人のidを追記
                    // repUserId: item.repUserId
                });
            }
        });

        postsMap.forEach(post => {
            post.replies.sort((a, b) => new Date(a.repTime) - new Date(b.repTime));
        })

        // マップから配列に変換
        return Array.from(postsMap.values());
    }

    const onRequest = () => {
        socket.emit("hello");
    }

    socket.on("getPosts", () => {
        console.log("投稿表示を更新");
        getDatas();
    });
</script>

<template>
    <div>
        <!-- 
            vから始まるタグはvuetifyのやつです
            あとはv-for, v-ifはvueの記法でJSが記述できるみたいな感じです
            投稿とかは形式が同じなのでfor文を回してコード自体はスッキリさせています
            @clickはv-onディレクティブというVueの属性で要素がクリックされた時に実行する関数などを指定
            します。JSのonClick属性みたいな感じ? addEventListenerを使う事も減ると思います
        -->
        <!-- {{ loginName }} {{ loginID }} -->
        <div>
            <v-btn @click="onRequest">Socket TEST</v-btn>
            <v-card
                class="ma-5 my-2"
                elevation="2"
            >
                <input type="text" v-model="chatContent" placeholder="検索" class="input">
            </v-card>

            <div class="trend flex ml-5 mt-3 mb-3">
                <h4>今のトレンド</h4>
                <p class="ml-5 tag">#研究室</p>
                <p class="ml-5 tag">#ランチ</p>
                <p class="ml-5 tag">#期末</p>
            </div>

            <v-card>
                <v-tabs
                    bg-color="deep-purple-darken-4"
                    center-active
                >
                <v-tab @click="onSearch('ALL')">ALL</v-tab>
                <v-tab @click="onSearch('授業')">授業</v-tab>
                <v-tab @click="onSearch('サークル')">サークル</v-tab>
                <v-tab @click="onSearch('研究室')">研究室</v-tab>
                <v-tab @click="onSearch('就活')">就活</v-tab>
                <v-tab @click="onSearch('その他')">その他</v-tab>
                <v-tab @click="onSearch('イベント')">イベント</v-tab>
                <v-tab @click="onSearch('記事')">記事</v-tab>
                </v-tabs>
            </v-card>
        </div>

        <!-- <router-link to="/articles">これはロード無しで飛べる</router-link><br>
        <router-link to="/post/1">これもいけるID 1　でも他のサイドバーが効かなくなる FocusPostでroute周りをコメントアウトしたら解消</router-link><br>
        <router-link :to="{ path: '/post/1', state: { post : samplePost}}">ID 1 OBJ リロードあり</router-link><br>
        <router-link :to="{ path: `/post/1`, query: { post: samplePost }}">ID 1 query</router-link> -->

        <!-- 
            for文で投稿を1件ずつ表示します
            投稿のデザインの型はPostContentコンポーネントに作っているので
            値を渡しています
        -->
        <div v-for="post in postsImageData" :key="post.postID">
            <!-- Flagで投稿コンポーネントと記事コンポーネントを区別する? -->

            <!-- 投稿の場合 -->
            <!-- 
                propという変数でコンポーネントに値を渡します
                左辺に任意の変数名を指定し、右辺に今回のfor文で取得したpostを渡します
            -->
            <!-- {{ post }} -->
            <PostContent
                :key="post.postID"
                :post="post"
                :socket="props.socket"
            />

            <!-- 記事の場合 -->
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

input {
    width: 100%;
}

.tag {
    color: blue;
    cursor: pointer;
}
</style>