<script setup>
    import { ref, onMounted, inject, onUnmounted } from "vue";
    import PostContent from './PostContent.vue';
    import ArticlesContent from "./ArticlesContent.vue";
    import axios from "axios";

    // definePropsはマクロなので未宣言で使用可
    const props = defineProps({
        socket: Object
    });

    const socket = props.socket;

    const postsImageData = ref();

    const loading = ref(false);
    const getLoading = ref(false);
    const bookmarkNums = ref(0);

    // propsで渡す
    const postFavs = ref({});
    const repFavs = ref({});
    const bookmarks = ref({});

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

    const getDatas = (genre = 0) => {
        getLoading.value = true;
        // 以下のURLに投稿取得リクエストをします
        axios.get(`/api/posts/myposts`, {withCredentials: true})
            .then((res) => {
                getLoading.value = false;
                postsImageData.value = nestPostsAndReplies(res.data.posts);
                // console.log(postsImageData);
                // console.log("GET DATA");

                bookmarkNums.value = postsImageData.value.length;

                // 以下はソケットが動けば不要?
                getPostsFaved();
                getRepFaved();
            })
            .catch((err) => {
                console.error(err);
            });
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
</script>

<template>
    <div>
        <div class="flex">
            <p class="ml-auto pb-0 pr-5 pt-2">{{ bookmarkNums }}件</p>
        </div>
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
                :bookmarks="bookmarks"
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

            <!-- 記事の場合 -->
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
</style>