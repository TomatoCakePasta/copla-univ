<script setup>
  import { inject } from 'vue';
  const isMobile = inject("isMobile");
</script>

<template>
    <div>
        <v-navigation-drawer 
          location="right" 
          :width="400"
          v-if="!isMobile"
        >
          <v-list>
            <v-list-item title="">
              <h1>Copla News</h1>
              <!-- <h2>忘れ物掲示とか, UNIPAで見逃されそうな掲示情報とか</h2> -->
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
    </div>
</template>

<style scoped>
</style>