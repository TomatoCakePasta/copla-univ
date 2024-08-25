<script setup>
    import { onMounted, ref, watch } from 'vue';
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

    // 一度だけ全ジャンルの全メニューを取得
    const menus = ref(props.menus);

    onMounted(() => {
        genre.value = +props.menuID;
    })

    watch(() => props.menuID, (newID) => {
        console.log(+newID);
        // 念のためキャスト
        genre.value = +newID;
    });
</script>

<template>
    <div>
        <!-- {{ props.menus[genre.value] }} -->
        <!-- <h1>メニュー {{  genre }} {{ menus[genre] }}</h1> -->

        <v-container>
            <v-row>
                <!-- そのジャンルのメニューの料理を取得 -->
                <v-col v-for="(menu, index) in menus[genre]" :key="index" cols="6" sm="3">
                    <!-- 各料理でカードを作成 -->
                    <!-- {{ menu }} -->
                    <v-card link>
                        <!-- 画像 -->
                        <p v-for="(detail, index2) in menu" :key="index2">
                            {{ detail }}{{ index2 === 2 ? "円" : ""}}
                        </p>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
</style>