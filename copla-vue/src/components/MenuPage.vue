<script setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const props = defineProps({
        menuID: {
            type: Number,
            required: true
        },
        menus: {
            type: Array,
            required: true
        }
    });

    const genre = ref(+props.menuID);

    const menus = ref();
    const menuDialog = ref(false);
    const selectedMenu = ref(0);
    const singleMenu = ref([]);

    onMounted(() => {
        console.log("全メニュー");
        menus.value = props.menus;
        console.log(menus);
        genre.value = +props.menuID;
    })

    onUnmounted(() => {
        console.log("さよなら");
    })

    // watch(() => props.menus, (newMenus) => {
    //     menus.value = newMenus;
    //     console.log("メニュー更新");
    //     console.log(menus);
    // })

    // watch(() => props.menuID, (newID) => {
    //     console.log(+newID);
    //     // 念のためキャスト
    //     genre.value = +newID;
    // });

    const openDialog = (id) => {
        console.log(id, "番目のメニュー");
        menuDialog.value = true;
        selectedMenu.value = id;
        console.log(menus.value[genre.value][id]);
        singleMenu.value = menus.value[genre.value][id];
    }

</script>

<template>
    <div>
        <!-- {{ props.menus[genre.value] }} -->
        <!-- <h1>メニュー {{  genre }} {{ menus[genre] }}</h1> -->
        <!-- {{ genre }} {{ menus ? menus[genre] : "" }} -->
        <v-container v-if="menus">
            <v-row>
                <!-- そのジャンルのメニューの料理を取得 -->
                <v-col v-for="(menu, index) in menus[genre]" :key="index" cols="6" sm="3">
                    <!-- 各料理でカードを作成 -->
                    <v-card 
                        link
                        @click="openDialog(index)"
                    >
                        <!-- 画像 -->
                        <v-img
                            :src="`/menus/${menu.image}`"
                            class="align-end"
                        >
                        </v-img>

                        <div class="ml-2">
                            <div class="flex">
                                <p>{{ menu.menuName }}</p>
                                <p class="ml-auto mr-2">{{ menu.price }}円</p>
                            </div>
                            <p>{{ menu.comment }}</p>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog
            v-model="menuDialog"
        >
            <div class="flex" style="justify-content: center;">
                <v-card
                    max-width="400px"
                    class="w-100p"
                >
                    <!-- {{ singleMenu }} -->
                    <v-img
                            :src="`/menus/${singleMenu.image}`"
                            class="align-end"
                        >
                    </v-img>

                    <div class="ma-2">
                        <div class="flex">
                            <p>{{ singleMenu.menuName }}</p>
                            <!-- <p class="ml-auto mr-2">{{ singleMenu.price }}円</p> -->
                        </div>
                        <p>{{ singleMenu.comment }}</p>

                        <div class="flex">
                            <p>{{ singleMenu.detail }}</p>
                            <p class="ml-auto mr-2">{{ singleMenu.price }}円</p>
                        </div>
                    </div>
                    <!-- <hr> -->

                    <div class="flex end ma-2">
                        <p class="mt-auto sub-info">投票は1日1回</p>

                        <v-btn
                            text="閉じる"
                            color="grey-lighten-4"
                            class="ml-auto"
                            @click="menuDialog = false"
                        ></v-btn>
    
                        <v-btn
                            text="投票!"
                            class="ml-5"
                            color="light-blue-accent-4"
                        ></v-btn>
                        <!-- @click="onPost(); postDialog = false; " -->
                    </div>
                </v-card>
            </div>
        </v-dialog>

    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.w-100p {
    width: 80%;
}

.sub-info {
    color:rgb(140, 140, 140);
}
</style>