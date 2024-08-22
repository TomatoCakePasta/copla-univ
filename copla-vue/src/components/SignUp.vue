<script setup>
    import { ref } from "vue";
    import { mdiAccount, mdiLock, mdiEyeOff } from '@mdi/js';
    import axios from "axios";
    import { useRouter } from "vue-router";

    const name = ref("");
    const pass = ref("");

    const router = useRouter();

    const onSignUp = () => {
        if (name === "" || pass === "") {
            alert("全ての項目を入力してください");
            return;
        }

        const data = {
            name: name.value,
            pass: pass.value,
        };

        // postリクエスト
        axios.post("http://localhost:3000/signup", data, { withCredentiala: true })
            .then((res) => {
                if (res.data.flag) {
                    clearForm();
                    router.push({ name: "login" });
                }
                else {
                    alert("そのユーザ名は既に使われています");
                }
            });
    }

    const clearForm = () => {
        name.value = "";
        pass.value = "";
    }
</script>

<template>
    <!-- <div class="top"> -->
    <v-app>
        <v-main class="body-color">
            <div class="center mt-5 flex">
                <img src="../assets/logo.png" alt="">
                <h1 class="title mt-auto mb-auto">Copla</h1>
                <h3>技育博 体験版</h3>
            </div>
            <v-card max-width="600px" class="mx-auto mt-5 pa-10 pt-0 form-size">
                <v-card-text>
                    <v-card-title>新規登録</v-card-title>
                    <v-form>

                        <v-text-field label="学籍番号 技育博のため無し" disabled>
                        </v-text-field>
                        
                        <v-text-field label="ユーザ名" v-model="name">
                            <!-- <template v-slot:prepend>
                                <v-icon>{{ mdiAccount }}</v-icon>
                            </template> -->
                        </v-text-field>
        
                        <v-text-field type="password" label="パスワード" v-model="pass">
                            <!-- <template v-slot:prepend>
                                <v-icon>{{ mdiLock }}</v-icon>
                            </template> -->
                        </v-text-field>
                        <v-card-action>
                            <v-btn class="w-100 text-none text-white" color="orange-darken-4" variant="flat" @click="onSignUp">新規登録</v-btn>
                            <v-btn class="w-100 mt-5" color="orange-darken-4" variant="outlined" to="/login">戻る</v-btn>
                        </v-card-action>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-main>
    </v-app>
    <!-- </div> -->
</template>

<style scoped>
.flex {
    display: flex;
}

.title {
    color: rgb(55, 148, 230);
}

.center {
    /* width: 100%; */
    /* height: 100%; */
    display: flex;
    justify-content: center;
}

.form-size {
    width: 80%;
}

.body-color {
    background-color: rgb(236, 255, 241);
}

img {
    /* width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%; */
    /* width: 200px;
    height: 200px; */
    width: 10%;
    height: 10%;
    min-width: 100px;
    min-height: 100px;
    max-width: 200px;
    max-height: 200px;
}

.w-100 {
    width: 100%;
}
</style>