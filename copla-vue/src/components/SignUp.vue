<script setup>
    import { mdiAccount, mdiLock, mdiEyeOff } from '@mdi/js';
</script>

<template>
    <!-- <div class="top"> -->
    <v-app>
        <v-main class="body-color">
            <div class="center mt-5 flex">
                <img src="../assets/logo.png" alt="">
                <h1 class="title mt-auto mb-auto">Copla</h1>
            </div>
            <v-card max-width="600px" class="mx-auto mt-5 pa-10 pt-0 form-size">
                <v-card-text>
                    <v-card-title>Sign Up</v-card-title>
                    <v-form>
                        <v-text-field label="ユーザ名">
                            <!-- <template v-slot:prepend>
                                <v-icon>{{ mdiAccount }}</v-icon>
                            </template> -->
                        </v-text-field>
        
                        <v-text-field type="password" label="パスワード">
                            <!-- <template v-slot:prepend>
                                <v-icon>{{ mdiLock }}</v-icon>
                            </template> -->
                        </v-text-field>
                        <v-card-action>
                            <v-btn class="w-100 text-none text-white" color="orange-darken-4" variant="flat">新規登録</v-btn>
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