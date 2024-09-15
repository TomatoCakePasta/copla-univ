<script setup>
    import { computed, ref, onMounted, onBeforeMount } from "vue";
    import { useRoute } from "vue-router";
    import { 
            mdiHeart, 
            mdiHeartOutline,
            mdiStarPlusOutline,
            mdiStarPlus
         } from "@mdi/js";
    import axios from "axios";

    const route = useRoute();

    const postFavs = ref({});
    const repFavs = ref({});
    const bookmarks = ref({});

    // クエリに渡されたidの値を取得
    console.log(route.params.id + "の投稿を抽出");

    const post = ref();
    const isLoading = ref(false);
    const dispNum = ref(1);
    const id = ref();
    const repContent = ref("");

    const genre = ["All", "授業", "サークル", "研究室", "就活", "その他", "イベント", "記事", "忘れ物"]

    // const post = route.state.post;
    // console.log("GET state post");
    // console.log(post);

    // const props = defineProps(["post"]);

    // 本来はリンクに投稿オブジェクトを渡したかったけど
    // 上手くできなかったから...再度投稿取得をリクエスト
    onMounted(() => {
        id.value = route.params.id;

        // axiosでそのidの投稿と返信を取得
        getSinglePost(id.value);

        // いいねを取得
        getPostsFaved();
        getRepFaved();

        // ブックマーク取得
        getBookmarks();

        isLoading.value = true;
    })

    console.log(post);

    const testFlag = ref(true);

    const getSinglePost = (id) => {
        axios.get(`/api/posts/single/${id}`)
            .then((res) => {
                post.value = nestPostsAndReplies(res.data.posts);
                post.value = post.value[0];
                console.log(post);
                console.log("GET DATA");
            })
            .catch((err) => {
                console.error(err);
            });
    }

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

        // マップから配列に変換
        return Array.from(postsMap.values());
    }

    // 投稿にいいね押下
    const onPostFav = (postID) => {

        console.log(postID, "にいいねを押す");

        if (everPostFaved(postID)) {
            alert("既にいいねを押しています");
            return;
        }

        // イメージ
        // クライアント側で見た目だけ押した感じにする
        // ブラウザリロードしたらrefプロパティ自体の値は消えるけど
        // 別のページとか閲覧して戻ってきたときに、
        // コンポーネントが再レンダリングされて、DBと紐づいた値になるイメージ
        // addPostFav(postID);

        // サーバのlikesテーブルの追加処理のみする?
        // こちらでlikesテーブルのユーザがいいねした投稿IDを取得しないとか
        axios.post("/api/post/add-fav", { postID: postID }, { withCredentials: true })
            .then((res) => {
                // 取得した自分がいいねした投稿のIDをpost_favsに格納
                addPostFav(postID); 
            })
            .catch((err) => {

            });
    };

    // 返信にいいね押下
    const onRepFav = (repID) => {
        console.log(repID, "にいいねを押す");

        if (everRepFaved(repID)) {
            alert("既にいいねを押しています");
            return;
        }

        axios.post("/api/reply/add-fav", { repID: repID }, { withCredentials: true })
            .then((res) => {
                // 取得した自分がいいねした投稿のIDをpost_favsに格納
                addRepFav(repID); 
            })
            .catch((err) => {

            });
    };

    // ブックマーク押下
    const onBookmark = (postID) => {
        // 取り消し
        if (bookmarks.value[postID]) {
            // deleteリクエスト
            axios.delete("/api/bookmark/del", {
                data: { postID: postID },
                withCredentials: true
                })
            .then((res) => {
                delBookmark(postID);
            })
            .catch((err) => {

            });
        }
        // 追加
        else {
            // postリクエスト
            axios.post("/api/bookmark/add", { postID: postID }, { withCredentials: true })
            .then((res) => {
                addBookmark(postID);
            })
            .catch((err) => {

            });
        }
    }

    // ログイン後にいいねを押したか
    const getPostFavStatus = (postID) => {
        const ret = postFavs.value[postID] > 1 ? 1 : 0;
        return ret;
    }

    const getRepFavStatus = (repID) => {
        const ret = repFavs.value[repID] > 1 ? 1 : 0;
        return ret;
    }

    // いいね押下済み確認
    // ログイン前に押下済み,ログイン後に押下済みを含む
    const everPostFaved = (postID) => {
        const ret = postFavs.value[postID] > 0 ? true : false;
        return ret;
    }

    const everRepFaved = (repID) => {
        const ret = repFavs.value[repID] > 0 ? true : false;
        return ret;
    }

    const everBookmarked = (postID) => {
        const ret = bookmarks.value[postID] === true ? true : false;
        console.log("bookmark post: ", bookmarks.value[postID]);
        return ret;
    }

    // ローカルで投稿いいね押下の見た目処理
    const addPostFav = (postID) => {
        postFavs.value[postID] = 2;
        console.log(postFavs);
    };

    const addRepFav = (repID) => {
        repFavs.value[repID] = 2;
        console.log(repFavs);
    };

    const addBookmark  = (postID) => {
        bookmarks.value[postID] = true;
        console.log("ブックマークに追加: ", postID);
    }

    const delBookmark = (postID) => {
        bookmarks.value[postID] = false;
        console.log("ブックマークを削除: ", postID);
    }

    const onReply = () => {
        console.log("onReply", id.value);
        const repTime = getTime();

        if (repContent.value === "") {
            alert("返信内容を入力してください");
            return;
        }

        const data = {
            postID: id.value,
            repContent: repContent.value,
            datetime: repTime
        };

        axios.post("/api/posts/reply", data, { withCredentials: true})
            .then((res) => {
                if (res.data.flag) {
                    repContent.value = "";
                    getSinglePost(data.postID);
                    getPostsFaved();
                    getRepFaved();
                }
                else {
                    alert("Failed to reply");
                }
            })
            .catch((err) => {

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

    // いいね済み投稿取得
    const getPostsFaved = () => {
        axios.get("/api/posts/faved", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.favs > 0) {
                    // console.log(res.data.postIDs);
                    res.data.postIDs.forEach(postID => {
                        // console.log("いいね投稿ID", postID.postID);
                        postFavs.value[postID.postID] = 1;
                    });
                    console.log("いいねした投稿ID");
                    console.log(postFavs);
                    // console.log(postFavs.value[65]);
                }
            })
            .catch((err) => {
                console.error("Failed to get posts faved", err);
                // alert("Failed to get posts faved", err);
            });
    }

    // いいね済み投稿取得
    const getRepFaved = () => {
        axios.get("/api/replies/faved", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.favs > 0) {
                    // console.log(res.data.postIDs);
                    res.data.repIDs.forEach(repID => {
                        // console.log("いいね投稿ID", postID.postID);
                        repFavs.value[repID.repID] = 1;
                    });
                    console.log("いいねした投稿ID");
                    console.log(repFavs);
                    // console.log(postFavs.value[65]);
                }
            })
            .catch((err) => {
                console.error("Failed to get replies faved", err);
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

    const strongInfo = () => {
        console.log("genre", post.value.postGenre);
        if (post.value.postGenre === 8) {
            return true;
        }
        else {
            return false;
        }
    }
</script>

<template>
    <!-- 
        冗長的です...
        本来はPostContentからこのコンポーネントに該当する投稿をオブジェクトで
        渡したかったのですが、上手くできなかったのでとりあえず投稿のidだけ
        渡して、再度そのデータを取得する形になるかもしれません
    -->
    <div>
        <!-- <h1>ID = {{ route.params.id }} の投稿と返信抽出イメージ</h1> -->

        <!-- {{ post }} -->
        <!-- {{ post.replies }} -->
        <v-card
            class="ma-5 my-2"
            elevation="2"
            v-if="post"
        >
            <div>
                <v-card-item>
                    <!-- ユーザのカラーコードまたはアイコン画像パスとか -->
                    <div class="flex">
                        <p class="icon" :style="{ backgroundColor: post.postUserIcon }"></p>
                        <v-card-title>
                            <!-- Card title {{ post.id }} -->
                        </v-card-title>
            
                        <v-card-subtitle class="mt-2 font-weight-bold">
                            <!-- {{ post.userName }} -->
                        </v-card-subtitle>
                        <p class="mt-2 font-weight-bold">
                            {{ post.postName }}
                        </p>
                        <p class="mt-2 ml-2 sub-info">
                            {{ post.postTime }}
                        </p>
                        <v-chip 
                            class="mt-2 ml-auto sub-info"
                            :color="strongInfo() ? 'red' : ''"
                        >{{ genre[post.postGenre] }}</v-chip>
                    </div>
                </v-card-item>

                <v-card-item class="pt-0">
                    <v-card-text class="pt-0" style="white-space: pre-wrap;">
                        <h1>{{ post.postTitle }}</h1>
                    </v-card-text>
                    <div class="flex">
                        <img :src="post.postPicUrl" alt="" v-if="post.postPicUrl" class="ceter mr-auto ml-auto">
                    </div>
                    <v-card-text class="pt-0" style="white-space: pre-wrap;">
                        {{ post.postContent }}
                    </v-card-text>
                    <div class="flex" v-if="post.postTags.length">
                        <v-chip class="ml-3 " v-for="(tag, index) in post.postTags" :key="index">{{ tag }}</v-chip>
                    </div>
                </v-card-item>

                <v-card-item class="pt-0">
                    <div class="ml-3 flex">
                        <v-icon size="30" @click.stop="onPostFav(post.postID)" :ripple="false" color="red" class="on-good rounded-circle pa-1">{{ everPostFaved(post.postID) ? mdiHeart : mdiHeartOutline }}</v-icon>
                        <!-- postFavで既に自分も押されている場合,getPostFavStatusで自分が重複加算される -->
                        <p>{{ post.postFav + getPostFavStatus(post.postID) }}</p>
                        <v-icon size="30" @click.stop="onBookmark(post.postID)" :ripple="false" color="orange" class="on-bookmark rounded-circle">{{ everBookmarked(post.postID) ? mdiStarPlus : mdiStarPlusOutline }}</v-icon>
                        <!-- , postID = {{ post.postID }} -->
                    </div>
                </v-card-item>

                <v-card-item>
                    <div class="flex">
                        <v-textarea 
                            placeholder="返信"
                            rows="1"
                            auto-grow
                            class="ml-2"
                            v-model="repContent"
                        ></v-textarea>
                        <v-btn @click.stop="onReply" class="rounded-xl ml-2" color="blue">Reply</v-btn>
                    </div>
                </v-card-item>
            </div>           

            <hr v-if="post.replies.length - dispNum > 0">

            <!-- 返信 -->
            <div v-for="(rep) in post.replies" :key="rep.repID">
                <v-card-item>
                    <div class="flex">
                        <p class="icon" :style="{ backgroundColor: rep.repUserIcon }"></p>
                        <p class="mt-2 font-weight-bold">
                            {{ rep.repName }}
                        </p>
                        <p class="mt-2 ml-2 sub-info">
                            {{ rep.repTime }}
                        </p>
                    </div>
                </v-card-item>
    
                <v-card-item class="pt-0">
                    <v-card-text class="pt-0" style="white-space: pre-wrap;">
                        {{ rep.repContent }}
                    </v-card-text>
                </v-card-item>

                <v-card-item class="pt-0">
                    <div class="ml-3 flex">
                        <v-icon size="30" @click.stop="onRepFav(rep.repID)" color="red" class="on-good rounded-circle pa-1">{{ everRepFaved(rep.repID) ? mdiHeart : mdiHeartOutline }}</v-icon>
                        <p>{{ rep.repFav + getRepFavStatus(rep.repID) }}</p>
                        <!-- , postID = {{ rep.repID }} -->
                    </div>
                </v-card-item>
            </div>
        </v-card>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.on-good:hover {
    background-color: rgb(249, 181, 181);
}

.on-bookmark:hover {
    background-color: rgb(249, 228, 181);
}

img {
    position: relative;
    max-width: 60%;
}

.icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 10px;
  flex-shrink: 0;
  background: #ff8888;
}

.sub-info {
    color: rgb(161, 161, 161);
}
</style>