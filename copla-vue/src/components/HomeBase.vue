<script setup>
  /*
    シングルファイルコンポーネントなので、
    1つのVueファイル内でそれぞれ独立して
    <script>(JavaScript), <template>(HTML要素), <style>(CSS)
    を記述します
  */
  import { ref, provide, watch, onMounted, inject, onUnmounted } from "vue";
  import { RouterLink, RouterView } from 'vue-router'

  // コンポーネントを読み込みます
  import SideBar from './SideBar.vue';
  import TrendMenu from "./TrendMenu.vue";

  import io from "socket.io-client"

  const PORT = 3000;

  // const socket = io.connect(`http://localhost:${PORT}`);
  const socket = io();

  socket.on("connect", () => {
    console.log("connected to server.");
  });

  const loginName = inject("loginName");
  const loginID = inject("loginID");

  onUnmounted(() => {
    socket.disconnect();
  })
</script>

<!-- 以下の内容がHTMLに挿入されます -->
<template>
  <v-layout class="rounded rounded-md">
    <!-- <v-app-bar color="surface-variant" title="Application bar"></v-app-bar> -->

    <!-- 
      App.vueが以前のファイル構成でいうindex.htmlで
      SideBar, TrendMenu, RouterViewがそれぞれ
      left.html, right.html, center.htmlみたいなイメージ? 
    -->

    <!-- 左部ナビゲーションバー -->
    <!-- PC版 -->
    <!-- SideBarコンポーネントの内容が挿入されます -->
    <!-- 直接書く事も出来ますが分割することでスッキリさせています -->
    <SideBar :socket="socket"/>

    <!-- TrendMenuコンポーネントの内容が挿入されます -->
    <TrendMenu :socket="socket"/>

    <v-main class="align-center justify-center" style="min-height: 300px;">
      <div>
        <!-- 
            アクセスするURLによって読み込まれるものが変わります
            投稿, マイページ, 設定など...
            詳しいルーティングはrouter/index.jsを見てください
        -->
        <RouterView :socket="socket"/>
      </div>
    </v-main>
  </v-layout>
</template>

<!-- CSSを記述 -->
<style scoped>

</style>