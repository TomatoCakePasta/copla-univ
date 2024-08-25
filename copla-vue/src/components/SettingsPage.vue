<script setup>
    import { onMounted, ref } from "vue";
    import axios from "axios";

    // ユーザ情報を取得

    const currentName = ref("");
    const setName = ref("");
    // 初期値は現在のアイコンカラー
    const profilePict = ref("#7CB342");
    const currentPass = ref("");
    const renewPass = ref("");
    const checkPass = ref("");

    const isShow = ref(false);

    onMounted(() => {
        getUser();
    })

    const getUser = () => {
        axios.get("/api/get/user", { withCredentials: true })
            .then((res) => {
                if (res.data.flag) {
                    console.log(res.data.userInfo);
                    setName.value = res.data.userInfo[0].userName;
                    profilePict.value = res.data.userInfo[0].icon;
                }
            })
            .catch((err) => {
                if (err) {
                    console.error("Failed to get user informatiln", err);
                }
            });
    }

    const renewUser = () => {
        // ユーザ名入力チェック
        if (setName.value === "") {
            alert("ユーザ名を入力してください");
            return;
        }

        // もしパスワード変更欄が入力されていた場合
        if (isAnyFieldFilled()) {
            let flag = false;

            console.log(isAllFieldFilled());

            if (!isAllFieldFilled()) {
                alert("パスワード変更の全項目を入力してください");
                flag = true;
            }
            else if (currentPass.value === renewPass.value) {
                alert("パスワードを変更してください");
                flag = true;
            }
            // パスワードが一致しない場合
            else if (renewPass.value !== checkPass.value) {
                alert("変更パスワードが不一致です");
                flag = true;
            }
            
            if (flag) {
                return;
            }
        }

        const data = {
            userName: setName.value,
            profilePict: profilePict.value,
            currentPass: currentPass.value,
            renewPass: renewPass.value
        };

        console.log("変更リクエスト送信");
        axios.post("/api/set/user", data, { withCredentials: true })
            .then((res) => {
                switch(res.data.flag) {
                    case 0:
                        alert("現在のパスワードが違います");
                        break;

                    case 1:
                        alert("そのユーザ名は既に使用されています");
                        break;

                    // 正常終了
                    case 2:
                        isShow.value = true;

                        setTimeout(() => {
                            isShow.value = false;
                        }, 2 * 1000);
                        break;

                    default:
                        alert("サーバーエラー");
                        break;
                }
            })
            .catch((err) => {
                if (err) {
                    console.error("Failed to set new data", err);
                }
            })
    }

    const isAnyFieldFilled = () => {
        return currentPass.value || renewPass.value || checkPass.value;
    }

    const isAllFieldFilled = () => {
        return currentPass.value && renewPass.value && checkPass.value;
    }

</script>

<template>
    <div>
        <v-card
                    class="ma-5"
                    height="100%"
                    title="設定"
                >
            <!-- focusでダイアログ開いたらフォームにカーソル当てた方がいいかも -->
            <v-card-text>
                <h3>ニックネーム</h3>
                <v-text-field variant="outlined" placeholder="あたらしい名前" v-model.trim="setName"></v-text-field>

                <h3>アイコンカラー</h3>
                <v-color-picker hide-canvas hide-inputs show-swatches class="mb-5" v-model="profilePict"></v-color-picker>

                <h3>パスワード</h3>
                <v-text-field type="password" variant="outlined" placeholder="現在のパスワード" v-model.trim="currentPass"></v-text-field>

                <v-text-field type="password" variant="outlined" placeholder="新しいパスワード" v-model.trim="renewPass"></v-text-field>
                <v-text-field type="password" variant="outlined" placeholder="新しいパスワード(再確認)" v-model.trim="checkPass"></v-text-field>

                <div class="flex" name="fade">
                    <p class="ml-auto success mt-auto mb-auto" v-if="isShow">正常に更新しました</p>
                    <v-btn class="ml-auto" color="green-darken-4" @click="renewUser">更新</v-btn>
                </div>
            </v-card-text>
        </v-card>

    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.success {
    color: rgb(78, 175, 227);
    font-size: 1.2rem;
    font-weight: bold;
}
</style>