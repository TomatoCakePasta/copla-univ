<script setup>
    import { ref, inject } from "vue";
    import { mdiAccount, mdiLock, mdiEyeOff } from '@mdi/js';
    import axios from 'axios';
    import { useRouter } from "vue-router";

    const name = ref("");
    const pass = ref("");
    const router = useRouter();
    const loginName = inject("loginName");
    const loginID = inject("loginID");

    const onLogin = () => {
        if (isNull(name.value) || isNull(pass.value)) {
            alert("未入力項目があります");
            return;
        }

        const data = {
            name: name.value,
            pass: pass.value,
        };

        console.log(data);

        // APIリクエスト
        axios.post("http://localhost:3000/login", data, {withCredentials: true})
            .then((res) => {
                // console.log(res);
                if (res.data.flag) {
                    loginName.value = res.data.loginName;
                    loginID.value = res.data.loginID;

                    console.log(loginName.value, loginID.value);

                    console.log("SUCCESS TO LOGIN");
                    formClear();
                    router.push({ name: "home" });
                }
                else {
                    console.log("NO USERS");
                    alert("入力が間違っています");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const onSessionTest = () => {
        axios.get("http://localhost:3000/test/session", { withCredentials: true})
            .then((res) => {
                if (res) {

                }
                else {
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const isNull = (value) => {
        console.log(value);
        return value === "";
    }

    const formClear = () => {
        name.value = "";
        pass.value = "";
    }
</script>

<template>
    <!-- <div class="top"> -->
    <v-app>
        <!-- <v-btn @click="onSessionTest">session</v-btn> -->
        <v-main class="body-color">
            <div class="center mt-5 flex">
                <img src="../assets/logo.png" alt="">
                <h1 class="title mt-auto mb-auto">Copla</h1>
            </div>
            <v-card max-width="600px" class="mx-auto mt-5 pa-10 pt-0 form-size">
                <v-card-text>
                    <v-card-title>ログイン</v-card-title>
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
                            <v-btn class="w-100 text-none text-white" color="blue-darken-4" variant="flat" @click="onLogin">ログイン</v-btn>
                            <v-btn class="w-100 mt-5" color="blue-darken-4" variant="outlined" to="/signup">新規登録</v-btn>
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