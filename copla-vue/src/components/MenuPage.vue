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
                    <v-card link>
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
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
</style>