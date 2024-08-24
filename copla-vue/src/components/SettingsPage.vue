<script setup>
    import { ref } from "vue";
    // ユーザ情報を取得

    const setName = ref("現在の名前");
    // 初期値は現在のアイコンカラー
    const profile_pict = ref("#7CB342");
    const currentPass = ref("");
    const renewPass = ref("");
    const checkPass = ref("");

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
                <v-text-field variant="outlined" placeholder="名前" v-model.trim="setName"></v-text-field>

                <h3>アイコンカラー</h3>
                <v-color-picker hide-canvas hide-inputs show-swatches class="mb-5" v-model="profile_pict"></v-color-picker>

                <h3>パスワード</h3>
                <v-text-field type="password" variant="outlined" placeholder="現在のパスワード" v-model.trim="currentPass"></v-text-field>

                <v-text-field type="password" variant="outlined" placeholder="新しいパスワード" v-model.trim="renewPass"></v-text-field>
                <v-text-field type="password" variant="outlined" placeholder="新しいパスワード(再確認)" v-model.trim="checkPass"></v-text-field>

                <div class="flex">
                    <v-btn class="ml-auto" color="green-darken-4">更新</v-btn>
                </div>
            </v-card-text>
        </v-card>

    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
</style>