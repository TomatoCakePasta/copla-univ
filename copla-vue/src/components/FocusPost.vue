<script setup>
    import { computed, ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
    import { mdiHeartOutline } from "@mdi/js";
    import axios from "axios";

    const route = useRoute();

    // クエリに渡されたidの値を取得
    console.log(route.params.id + "の投稿を抽出");

    const post = ref();
    const isLoading = ref(false);
    const dispNum = ref(1);
    const id = ref();
    const repContent = ref("");

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

        isLoading.value = true;
    })

    console.log(post);

    const testFlag = ref(true);

    const getSinglePost = (id) => {
        axios.get(`http://localhost:3000/get/${id}`)
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

        // マップから配列に変換
        return Array.from(postsMap.values());
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

        axios.post("http://localhost:3000/reply", data, { withCredentials: true})
            .then((res) => {
                if (res.data.flag) {
                    repContent.value = "";
                    getSinglePost(data.postID);
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
</script>

<template>
    <!-- 
        冗長的です...
        本来はPostContentからこのコンポーネントに該当する投稿をオブジェクトで
        渡したかったのですが、上手くできなかったのでとりあえず投稿のidだけ
        渡して、再度そのデータを取得する形になるかもしれません
    -->
    <div>
        <h1>ID = {{ route.params.id }} の投稿と返信抽出イメージ</h1>

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
                        <p class="icon" :style="{  }"></p>
                        <v-card-title>
                            <!-- Card title {{ post.id }} -->
                        </v-card-title>
            
                        <v-card-subtitle class="mt-2 font-weight-bold">
                            <!-- {{ post.userName }}さん -->
                        </v-card-subtitle>
                        <p class="mt-2 font-weight-bold">
                            {{ post.postName }}さん
                        </p>
                        <p class="mt-2 ml-2 sub-info">
                            {{ post.postTime }}
                        </p>
                    </div>
                </v-card-item>

                <v-card-item class="pt-0">
                    <v-card-text class="pt-0" style="white-space: pre-wrap;">
                        {{ post.postContent }}
                    </v-card-text>
                </v-card-item>

                <v-card-item class="pt-0">
                    <div class="ml-3 flex">
                        <v-icon size="30" @click.stop="" color="red" class="on-good rounded-circle pa-1">{{ mdiHeartOutline }}</v-icon>
                        <p>{{ post.postFav }}</p>
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
                        <p class="icon" :style="{  }"></p>
                        <p class="mt-2 font-weight-bold">
                            {{ rep.repName }}さん
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
                        <v-icon size="30" @click.stop="" color="red" class="on-good rounded-circle pa-1">{{ mdiHeartOutline }}</v-icon>
                        <p>{{ rep.repFav }}</p>
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