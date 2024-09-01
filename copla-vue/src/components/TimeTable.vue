<script setup>
    import { onMounted, ref, watch } from "vue";

    const week = ["月", "火", "水", "木", "金"];
    const classes = ref([
        ["", "生命科学概論", "基礎物理学実験", "基礎物理学実験", ""],
        ["基礎微積文学A", "", "基礎線形代数学A", "英語2A", ""],
        ["科学A", "", "コンピュータ設計論", "ビジネス心理学", ""],
        ["経済論", "ドイツ語", "", "", ""],
        ["", "C言語", "", "英語1A(再履修)", ""]
    ]);

    // propsは読み取り専用のデータだから
    // watchで監視する? refに入れても意味ない
    const props = defineProps(["editFlag"]);

    const editFlag = ref();

    onMounted(() => {
        editFlag.value = props.editFlag;
    })

    watch(() => props.editFlag, (newVal) => {
        editFlag.value = newVal;
    });

</script>

<template>
    <div>
        <!-- {{ editFlag }} -->
        <v-card class="ma-5 plan-bg">
            <v-container>
                <!-- <v-row v-for="m in 5" :key="m">
                    <h3>{{ m }}限</h3>
                    <v-col v-for="n in 5" :key="n">
                        <h3 v-if="m === 1">{{ week[n - 1] }}</h3>
                        <v-card class="pa-5">
                            {{ classes[n - 1][m - 1] }}
                        </v-card>
                    </v-col>
                </v-row> -->
                <v-row>
                    <v-col v-for="m in 5" :key="m" style="width: 20%">
                        <v-row><h3 class="ml-auto mr-auto pa-1">{{ week[m - 1] }}</h3></v-row>
                        <v-row v-for="n in 5" :key="n">
                            <v-card class="pa-1 w-100 ma-1 plan-card" link v-if="editFlag">
                                <p>{{  m === 1 ? n : ""}}</p>
                                <v-text-field v-model="classes[m - 1][n - 1]"></v-text-field>
                            </v-card>
                            <v-card class="pa-1 w-100 ma-1 plan-card" link v-else>
                                <p>{{  m === 1 ? n : "-"}}</p>
                                {{ classes[m - 1][n - 1] }}
                            </v-card>                        
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.w-100 {
    width: 100%;
    height: 100px;
}

h3 {
    color:aliceblue;
}

.plan-bg {
    background-color: rgb(121, 151, 118);
}

.plan-card {
    background-color: rgb(253, 253, 253);
}
</style>