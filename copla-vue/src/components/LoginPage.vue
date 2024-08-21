<script setup>
    import { mdiAccount, mdiLock, mdiEyeOff } from '@mdi/js';
</script>

<template>
    <!-- <div class="top"> -->
    <v-app>
        <v-app-bar :elevation="2">
            <img src="../assets/logo.png" alt="">
            <v-app-bar-title>Copla</v-app-bar-title>
        </v-app-bar>
        <v-main class="body-color">
            <v-card max-width="600px" class="mx-auto mt-10 form-size">
                <v-card-title>
                    <h3>ログイン</h3>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field label="ユーザ名">
                            <template v-slot:prepend>
                                <v-icon>{{ mdiAccount }}</v-icon>
                            </template>
                        </v-text-field>
        
                        <v-text-field type="password" label="パスワード">
                            <template v-slot:prepend>
                                <v-icon>{{ mdiLock }}</v-icon>
                            </template>
                        </v-text-field>
                        <v-card-action>
                            <v-btn>ログイン</v-btn>
                            <v-btn class="ml-10">新規登録</v-btn>
                        </v-card-action>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-main>
    </v-app>
    <!-- </div> -->
</template>

<style scoped>
.top {
    /* width: 100%; */
    height: 100%;
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
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
</style>