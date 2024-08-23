<script setup>
    import { onMounted, ref, watch } from "vue";
    import { useRouter } from 'vue-router';
    import { 
            mdiChatOutline,
            mdiHeartOutline,
            mdiHeart
            } from "@mdi/js";
    import axios from "axios";
    // const props = defineProps({
    //     post: {
    //         type: Object,
    //         required: true
    //     }
    // });

    // propsを取得します
    // postという名前で渡されたので、それを指定しています
    const props = defineProps(["post", "socket", "postFavs", "repFavs"]);

    // 以下の記述だとpostは静的なので、新規投稿が反映されない
    // const post = props.post;

    // console.log(typeof(post));

    const socket = props.socket;
    
    const router = useRouter();

    const dispNum = ref(1);

    const repContent = ref("");

    const openFlag = ref(false);

    const genre = ["All", "授業", "サークル", "研究室", "就活", "その他", "イベント", "記事"]

    const post_favs = ref({});

    onMounted(() => {
        // getPostsFaved();
        // console.log(props.postFavs);
    });

    const openReplies = (rep) => {
        console.log(rep.length);
        dispNum.value = rep.length;
        openFlag.value = true;
    }

    watch(() => props.post.replies, () => {
        if (openFlag.value) {
            openReplies(props.post.replies);
        }
    })

    // シングルポストのページに遷移
    const onFocus = () => {
        // router.push({ path: `/post/${ post.id }`, state: { postData: post }});
        router.push({ path: `/post/${ props.post.postID }`, params: { id: props.post.postID }});
    }

    const onReply = (id) => {
        console.log("onReply", id);
        const repTime = getTime();

        if (repContent.value === "") {
            alert("返信内容を入力してください");
            return;
        }

        const data = {
            postID: id,
            repContent: repContent.value,
            datetime: repTime
        };

        axios.post("http://localhost:3000/reply", data, { withCredentials: true})
            .then((res) => {
                if (res.data.flag) {
                    repContent.value = "";

                    socket.emit("makePost");
                }
                else {
                    alert("Failed to reply");
                }
            })
            .catch((err) => {

            });
    }

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
        axios.post("http://localhost:3000/post/add-fav", { postID: postID }, { withCredentials: true })
            .then((res) => {
                // 取得した自分がいいねした投稿のIDをpost_favsに格納
                addPostFav(postID); 
            })
            .catch((err) => {

            });
    };

    const onRepFav = (repID) => {
        console.log(repID, "いいねを押下");

        if (everRepFaved(repID)) {
            alert("既にいいねを押しています");
            return;
        }

        axios.post("http://localhost:3000/reply/add-fav", { repID: repID }, { withCredentials: true })
            .then((res) => {
                // 取得した自分がいいねした投稿のIDをpost_favsに格納
                addRepFav(repID); 
            })
            .catch((err) => {

            }); 
    }

    // textareaでEnterが押された時の処理
    // (他の動作と干渉しないように用意しただけです)
    const handleEnterKey = (event) => {
        event.target.value += "\n";
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

    // ログイン後にいいねを押したか
    const getPostFavStatus = (postID) => {
        const ret = props.postFavs[postID] > 1 ? 1 : 0;
        return ret;
    }

    const getRepFavStatus = (repID) => {
        const ret = props.repFavs[repID] > 1 ? 1 : 0;
        return ret;
    }

    // いいね押下済み確認
    // ログイン前に押下済み,ログイン後に押下済みを含む
    const everPostFaved = (postID) => {
        const ret = props.postFavs[postID] > 0 ? true : false;
        return ret;
    }

    const everRepFaved = (repID) => {
        const ret = props.repFavs[repID] > 0 ? true : false;
        return ret;
    }

    // ローカルで投稿いいね押下の見た目処理
    const addPostFav = (postID) => {
        props.postFavs[postID] = 2;
        // console.log(props.postFavs);
    };

    const addRepFav = (repID) => {
        props.repFavs[repID] = 2;
        console.log(props.repFavs);
    }

    // いいね済み投稿取得
    /*
    const getPostsFaved = () => {
        axios.get("http://localhost:3000/posts/faved", { withCredentials: true} )
            .then((res) => {
                if (res.data.flag && res.data.favs > 0) {
                    console.log(res.data.postIDs);
                    // res.data.postIDs.forEach(postID => {
                    //     post_favs.value[postID] = 1;
                    // });
                }
            })
            .catch((err) => {
                console.error("Failed to get posts faved", err);
                // alert("Failed to get posts faved", err);
            })
    }
            */

    // いいね済み返信取得

    // post_likesからログインユーザがいいねしたpotsIDを取得
    // keyにpostID, valueに真偽値をセットしてアイコンの色を変えるとか

    // reply_likesも同様
</script>

<!--
    無限スクロールもVuetifyで実装できそうです
    https://vuetifyjs.com/ja/components/infinite-scroller/#section-4f7f304465b9 
-->

<template>
    <div>
        <!-- {{ repContent }} -->
        <!-- {{ props.post }} -->
        <v-card
            class="ma-5 my-5"
            elevation="2"
            @click.stop="onFocus"
            v-ripple.stop
            :ripple="false"
        >
            <!-- 通常投稿 記事とはデザインを変える? タイトル有無とか -->  
            <div>
                <!-- ユーザ情報 -->
                <v-card-item>
                    <!-- ユーザのカラーコードまたはアイコン画像パスとか -->
                    <div class="flex">
                        <p class="icon" :style="{  }"></p>
                        <p class="mt-2 font-weight-bold">
                            {{ props.post.postName }}
                        </p>
                        <p class="mt-2 ml-2 sub-info">
                            <!-- M-D h:m -->
                             {{ props.post.postTime }}
                        </p>
                        <!-- <p class="mt-2 ml-auto sub-info">{{ post.postGenre }}</p> -->
                        <v-chip class="mt-2 ml-auto sub-info">{{ genre[props.post.postGenre] }}</v-chip>
                    </div>
                </v-card-item>

                <!-- 投稿本文 -->
                <v-card-item class="pt-0">
                    <v-card-text class="pt-0" style="white-space: pre-wrap;">
                        {{ props.post.postContent }}
                    </v-card-text>
                </v-card-item>

                <!-- リアクション いいねとか -->
                <v-card-item 
                    class="pt-0"
                >
                    <div class="ml-3 flex">
                        <v-icon size="30" @click.stop="onPostFav(props.post.postID)" :ripple="false" color="red" class="on-good rounded-circle pa-1">{{ everPostFaved(props.post.postID) ? mdiHeart : mdiHeartOutline }}</v-icon>
                        <p>{{ props.post.postFav + getPostFavStatus(props.post.postID) }}, postID = </p>
                        {{ props.post.postID }}
                    </div>
                </v-card-item>

                <!-- 返信フォーム -->
                <v-card-item>
                    <div class="flex">
                        <v-textarea 
                            placeholder="返信"
                            @click.stop="" 
                            @keydown.enter.stop.prevent="handleEnterKey"
                            rows="1"
                            auto-grow
                            class="ml-2"
                            v-model.trim="repContent"
                        ></v-textarea>
                        <v-btn @click.stop="onReply(props.post.postID)" class="rounded-xl ml-2" color="blue">Reply</v-btn>
                    </div>
                </v-card-item>
            </div>           

            <!-- 
                v-ifは条件を満たすときだけ表示します 
                falseの時はブラウザから要素ごと削除します
                cssでdisplay:noneで非表示を使う場合は、開発者ツールで見えてしまいますが
                v-ifは要素が無いので見えません
            -->
            <hr v-if="props.post.replies.length - dispNum > 0">

            <!-- 返信 -->
            <div v-for="(rep, index) in props.post.replies" :key="rep.repID">
                <!-- 
                    表示件数を指定します
                    初期値は1件で
                    「さらに表示」を押すと、全て表示します
                -->
                <div v-if="index < dispNum">
                    <v-card-item>
                        <div class="flex">
                            <p class="icon" :style="{  }"></p>
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
                            <p>{{ rep.repFav + getRepFavStatus(rep.repID) }}, postID = </p>
                            {{ rep.repID }}
                        </div>
                    </v-card-item>
                </div>
            </div>

            <hr v-if="dispNum <= 1 && props.post.replies.length - dispNum > 0">
            <!-- .stopで親カードのonFocusを作動させずに返信を開ける -->
            <p link v-if="dispNum <= 1 && props.post.replies.length && props.post.replies.length - dispNum > 0" @click.stop="openReplies(props.post.replies)" class="top-layer mouse">さらに{{ props.post.replies.length - dispNum }}件の返信</p>
        </v-card>
    </div>
</template>

<style scoped>
.mouse:hover {
    background-color: rgb(238, 255, 162);
}

.on-good:hover {
    background-color: rgb(249, 181, 181);
}

.good-icon {
    width: 30px;
    height: 30px;
    background-color: rgb(249, 181, 181);
}

.over {
    z-index: 10;
}

textarea {
    width: 100%;
    margin: 0px 5px;
}

.flex {
    display: flex;
}

.rep-area {
    margin: 2px 0px 10px 0px;
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