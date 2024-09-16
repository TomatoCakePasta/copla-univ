<script setup>
  import { inject, ref } from 'vue';
  import PostContent from './PostContent.vue';

  const isMobile = inject("isMobile");
  const datas = ref([
    {"title": "Coplaへようこそ", "body": "Coplaは在学生限定SNSとして企画開発されました。\n授業の意見収集や学生生活の相談など自由に呟ける場所を提供します。", "datetime": "2024-09-07", "genre": "公式" },
    {"title": "就職相談会の開催", "body": "日時:\n9月20日（水） 15:00 ～ 17:00\n\n場所:\nキャリアセンター会議室\n\n内容:\n・エントリーシートの書き方\n・面接対策\n・業界研究\n\n参加申込:\n学内ポータルサイトから事前に申し込みを行ってください。", "datetime": "2024-09-04", "genre": "催事" },
    {"title": "授業休講について", "body": "本日予定されていた「国際経済論」の授業は、担当教員の体調不良により休講となります。\n休講日:\n9月5日（火） 13:00 ～ 14:30\n", "datetime": "2024-09-04", "genre": "緊急" },
    {"title": "食堂の営業時間変更について", "body": "新しい営業時間：\n月曜日～金曜日: 8:00 ～ 18:30\n土曜日: 9:00 ～ 14:00\n日曜日・祝日: 休業\nお問い合わせ: 学生食堂運営課", "datetime": "2024-09-04", "genre": "施設" },
    {"title": "図書館休館日について", "body": "図書館では、秋季のメンテナンスのため、以下の日程で休館いたします。\nこの期間中は、館内の閲覧や書籍の貸出・返却ができませんので、予めご了承ください。\n\n休館日:\n9月25日（月） ～ 9月29日（金）\n\n休館中に返却期限が来る書籍については、10月2日（月）まで延長いたします。\nご不便をおかけしますが、よろしくお願いいたします。", "datetime": "2024-09-04", "genre": "施設" }
  ])
  
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
              <div>
                <v-card v-for="(data, index) in datas" :key="index" class="ma-5" link>
                  <!-- <p>{{ data.datetime }}</p>
                  <h1>{{ data.title }}</h1>
                  <p>{{ data.body }}</p> -->
                  <div>
                      <!-- ユーザ情報 -->
                      <v-card-item>
                          <!-- ユーザのカラーコードまたはアイコン画像パスとか -->
                          <div class="flex">
                              <p class="icon"></p>
                              <p class="mt-2 font-weight-bold">
                                  Copla公式
                              </p>
                              <p class="mt-2 ml-2 sub-info">
                                  <!-- M-D h:m -->
                                  {{ data.datetime }}
                              </p>
                              <!-- <p class="mt-2 ml-auto sub-info">{{ post.postGenre }}</p> -->
                              <v-chip class="mt-2 ml-auto sub-info">{{ data.genre }}</v-chip>
                          </div>
                      </v-card-item>

                      <!-- 投稿本文 -->
                      <v-card-item class="pt-0">
                        <h3 class="mr-5 ml-4">{{ data.title }}</h3>
                        <v-card-text class="pt-0" style="white-space: pre-wrap;">
                            {{ data.body }}
                        </v-card-text>
                      </v-card-item>
                  </div>           

                </v-card>
              </div>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
    </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 10px;
  flex-shrink: 0;
  background: #68d684;
}

.sub-info {
    color: rgb(161, 161, 161);
}
</style>