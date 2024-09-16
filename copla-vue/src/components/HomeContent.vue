<script setup>
    import { ref, onMounted, inject, onUnmounted } from "vue";
    import PostContent from './PostContent.vue';
    import ArticlesContent from "./ArticlesContent.vue";
    import axios from "axios";
    import io from "socket.io-client";
    import { mdiMagnify } from "@mdi/js";

    // definePropsはマクロなので未宣言で使用可
    const props = defineProps({
        socket: Object
    });

    const socket = props.socket;

    const selectedGenre = inject("selectedGenre");

    // const loginName = inject("loginName");
    // const loginID = inject("loginID");

    // 画面読み込み時
    onMounted(() => {
        // 投稿を取得
        getDatas();

        // いいねを取得
        getPostsFaved();
        getRepFaved();

        // ブックマーク取得
        getBookmarks();
    });

    // 投稿をaxiosで送ります
    // https://axios-http.com/ja/docs/example

    // Proxyとかでデータが受け取りたいです
    // username, content, titleとか

    const chatContent = ref("");
    const keyContent = ref("");
    const getMsg = ref();

    const postsImageData = ref();

    const loading = ref(false);
    const getLoading = ref(false);

    // propsで渡す
    const postFavs = ref({});
    const repFavs = ref({});
    const bookmarks = ref({});

    // 投稿を取得
    // 画面読み込み時, 一定間隔, ソケットイベント検知などのタイミングで呼出
    const getDatas = (genre = 0) => {
        getLoading.value = true;
        // 以下のURLに投稿取得リクエストをします
        axios.get(`/api/posts/genre/${genre}`, {withCredentials: true})
            .then((res) => {
                getLoading.value = false;
                postsImageData.value = nestPostsAndReplies(res.data.posts);
                // console.log(postsImageData);
                // console.log("GET DATA");
                console.log("投稿取得");
                console.log(postsImageData.value);

                // 以下はソケットが動けば不要?
                getPostsFaved();
                getRepFaved();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // ジャンル選択
    const onSearch = (genre) => {
        console.log(`${ genre }の投稿を表示`);
        selectedGenre.value = genre;

        getDatas(genre);
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
                    postUserIcon: item.postUserIcon,
                    postContent: item.postContent,
                    postPicUrl: item.picUrl,
                    // ,で結合されたタグ文字列を,区切りで配列にする
                    // 空の要素[""]は除外する
                    postTags: item.postTags.split(",").filter(item => item !== ""),
                    // postUserIcon: 0,
                    postFav: item.postFav,
                    postTime: item.postTime,
                    postGenre: item.genre,
                    postTitle: item.title,

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
                    repUserIcon: item.repUserIcon,
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

    socket.on("getPosts", () => {
        console.log("投稿表示を更新");
        getDatas(selectedGenre.value);

        getPostsFaved();
        getRepFaved();
    });

    // いいね済み投稿取得
    const getPostsFaved = () => {
        axios.get("/api/likes/user/posts", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.favs > 0) {
                    // console.log(res.data.postIDs);
                    res.data.postIDs.forEach(postID => {
                        // console.log("いいね投稿ID", postID.postID);
                        postFavs.value[postID.postID] = 1;
                    });
                    // console.log("いいねした投稿ID");
                    // console.log(postFavs);
                }
            })
            .catch((err) => {
                console.error("Failed to get posts faved", err);
                // alert("Failed to get posts faved", err);
            });
    }

    // いいね済み返信取得
    const getRepFaved = () => {
        axios.get("/api/likes/user/replies", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.favs > 0) {
                    // console.log(res.data.postIDs);
                    res.data.repIDs.forEach(repID => {
                        // console.log("いいね投稿ID", postID.postID);
                        repFavs.value[repID.repID] = 1;
                    });
                    console.log("いいねした返信ID");
                    console.log(repFavs);
                }
            })
            .catch((err) => {
                console.error("Failed to get posts faved", err);
                // alert("Failed to get posts faved", err);
            });
    }

    // ブックマーク投稿取得
    const getBookmarks = () => {
        axios.get("/api/bookmarks", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.bookmarks > 0) {
                    // console.log(res.data.postIDs);
                    res.data.postIDs.forEach(postID => {
                        // console.log("いいね投稿ID", postID.postID);
                        bookmarks.value[postID.postID] = true;
                    });
                    console.log("ブックマークした投稿ID");
                    console.log(bookmarks);
                }
            })
            .catch((err) => {
                console.error("Failed to get bookmark posts", err);
                // alert("Failed to get posts faved", err);
            });
    }

    const onKeySearch = () => {
        if (keyContent.value === "") {
            alert("検索ワードを入力してください");
            return;
        }

        // console.log(keyContent.value);

        // 検索単語を1文字以上の半角または全角スペースで区切って配列にする
        // /正規表現/, spaceを1文字以上+
        // 区切った単語の文字が1文字以上残る場合、単語として配列に格納
        const words = keyContent.value.replaceAll("　", " ").split(/\s+/).filter(Boolean);
        // console.log(words);

        // console.log(keyContent.value);

        // 配列を渡す

        loading.value = true;

        // もしジャンルが入力されていたら
        // サーバー側でジャンルをキーに対応する番号に変換する
        // 就活 ES みたいな検索イメージ
        axios.post("/api/posts/search", { words: words}, { withCredentials: true})
            .then((res) => {
                // もし0件なら投稿が見つかりませんでしたを表示したい
                if (res.data.flag) {
                    postsImageData.value = nestPostsAndReplies(res.data.posts);
                    console.log("検索結果");
                    console.log(postsImageData.value);
                    keyContent.value = "";
                }
                else {
                    // 0件
                }
                loading.value = false;
            })
            .catch((err) => {
                if (err) {
                    console.error("Failed to search post", err);
                }
                loading.value = false;
            })
    }

    const trendSearch = (key) => {
        keyContent.value = key;
        onKeySearch();
    }
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
                <v-btn color="primary" @click="onKeySearch()" height="40" width="100"><v-icon color="white" size="30">{{ mdiMagnify }}</v-icon></v-btn>
            </v-card-text>

            <div class="trend flex ml-5 mt-3 mb-3">
                <h4>今のトレンド</h4>
                <!-- 本来は {{  }} でtrendSearchの引数と#{{  }}で動的に -->
                <p class="ml-5 tag" @click="trendSearch('研究室')">#研究室</p>
                <p class="ml-5 tag" @click="trendSearch('ランチ')">#ランチ</p>
                <p class="ml-5 tag" @click="trendSearch('期末')">#期末</p>
            </div>

            <!-- <v-card> -->
            <v-tabs
                bg-color="deep-purple-darken-4"
                center-active
            >
                <v-tab @click="onSearch('0')">ALL</v-tab>
                <v-tab @click="onSearch('1')">授業</v-tab>
                <v-tab @click="onSearch('2')">サークル</v-tab>
                <v-tab @click="onSearch('3')">研究室</v-tab>
                <v-tab @click="onSearch('4')">就活</v-tab>
                <v-tab @click="onSearch('5')">その他</v-tab>
                <v-tab @click="onSearch('6')">イベント</v-tab>
                <v-tab @click="onSearch('7')">記事</v-tab>
            </v-tabs>
            <!-- </v-card> -->
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
        <!-- {{ getLoading ? "Now Loading ..." : "" }} -->
        <div v-for="post in postsImageData" :key="post.postID">
            <!-- Flagで投稿コンポーネントと記事コンポーネントを区別する? -->

            <!-- 投稿の場合 -->
            <!-- 
                propという変数でコンポーネントに値を渡します
                左辺に任意の変数名を指定し、右辺に今回のfor文で取得したpostを渡します
            -->
            <!-- <p v-if="post.postGenre === 7">記事投稿です{{ post.postTitle }}</p> -->
            <!-- 記事 -->
            <ArticlesContent 
                v-if="post.postGenre === 7"
                :key="'article-' + post.postID"
                :post="post"
                :socket="props.socket"
                :postFavs="postFavs"
                :repFavs="repFavs"
                :bookmarks = "bookmarks"
            />

            <!-- 通常投稿 -->
            <PostContent
                v-else
                :key="'post-' + post.postID"
                :post="post"
                :socket="props.socket"
                :postFavs="postFavs"
                :repFavs="repFavs"
                :bookmarks="bookmarks"
            />
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