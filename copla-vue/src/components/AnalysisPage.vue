<script setup>
    import { Chart, registerables } from 'chart.js';
    import { onMounted, ref } from 'vue';

    // Chart.jsの全てのコンポーネントを登録
    // バージョンv3以降は以下のように明示的にインポートする必要がある
    Chart.register(...registerables);

    let ctx;
    const menuNames = ref([]);
    const menuFavs = ref([]);
    const topFavs = ref(5);

    // let menuNames = [];
    // let menuFavs = [];

    const props = defineProps({
        menus: {
            type: Array,
            required: true
        }
    });

    onMounted(() => {
        const canvas = document.getElementById('myChart');
        ctx = canvas.getContext("2d");

        drawChart();
    })

    const drawChart = () => {
        // メニューデータを取得
        openDatas();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: menuNames.value,
                datasets: [{
                    label: '投票数',
                    data: menuFavs.value,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: topFavs.value,
                        ticks: {
                            // 整数のみ表示する
                            callback: function(value) {
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                            },
                            stepSize: 1, // Y軸の目盛りの間隔を1に設定
                        }
                    }
                }
            }
        });
    }

    // データ展開
    const openDatas = () => {
        let idx = 0;
        for (let datas of props.menus) {
            for (let data of datas) {
                menuNames.value[idx] = data.menuName;
                menuFavs.value[idx] = data.fav;
                idx++;

                // 5間隔で広げる
                // 1-4 -> 5, 5-9 -> 10, みたいな
                if (data.fav >= topFavs.value) {
                    topFavs.value += Math.floor(data.fav / 5) * 5;
                    console.log("高さ: ", Math.floor(data.fav / 5) * 5);
                }
            }
        }

        // console.log(menuNames);
        // console.log(menuFavs);
    }

</script>

<template>
    <div>
        <v-card class="ma-5">
            <h1 class="ma-5">投票状況</h1>
            <canvas id="myChart" class="ma-5"></canvas>
        </v-card>
    </div>
</template>

<style scoped>
</style>