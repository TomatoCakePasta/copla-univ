import { createRouter, createWebHistory } from 'vue-router'
import { ref, inject } from "vue";
import axios from 'axios';

// コンポーネントの読み込み
import HomeContent from '@/components/HomeContent.vue'
import EventPage from '@/components/EventPage.vue'
import ArticlesContent from '@/components/ArticlesContent.vue'
import MyPage from '@/components/MyPage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import FocusPost from '@/components/FocusPost.vue'
import NotFound from '@/components/NotFound.vue'
import BusPage from '@/components/BusPage.vue'
import HomeBase from '@/components/HomeBase.vue'
import LoginPage from '@/components/LoginPage.vue'
import SignUp from '@/components/SignUp.vue';
import MyFavorite from '@/components/MyFavorite.vue';
import AnalysisPage from '@/components/AnalysisPage.vue';
import MenuPage from '@/components/MenuPage.vue';
import TimeTable from '@/components/TimeTable.vue';

// ルーティング制御のファイルです
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // トップページにアクセスした場合
      path: '/',
      // 以下はvueで名前を指定してアクセスするための別名です
      // hrefとかでURLを書かなくても homeを指定すれば飛べます
      // name: 'home',

      // HomeContentコンポーネントを読み込みます
      // HomeContentはimportしたHomeContent.vueのことです
      // component: HomeContent

      component: HomeBase,
      meta: { requiresAuth: true },

      children: [
        {
          path: "/",
          name: "home",
          component: HomeContent,
        },
        {
          path: "/event",
          name: "event",
          component: EventPage,

          // children: [
          //   {
          //     path:"analysis",
          //     name: "analysis",
          //     component: AnalysisPage,
          //   },
          //   {
          //     path: "menu",

          //     name: "menu",
          //     component: MenuPage,

          //     // FocusPostコンポーネントにクエリの値を渡します
          //     // まだ上手く使いきれてないのでもう少し勉強します
          //     props: (route) => ({
          //       id: route.params.id
          //     }),
          //   }
          // ],
        },
        {
          // trafficやaccessの方がいい?
          path: "/bus",
          name: "bus",
          component: BusPage,
        },
        {
          path: "/myfavorite",
          name: "myfavorite",
          component: MyFavorite,
        },
        {
          path: "/mypage",
          name: "mypage",
          component: MyPage,
          children: [
            {
              path: "timetable",
              name: "timetable",
              component: TimeTable,
            },
            {
              path: "settings",
              name: "settings",
              component: SettingsPage,
            }
          ],
        },
        // {
        //   path: "/settings",
        //   name: "settings",
        //   component: SettingsPage,
        // },
        {
          // シングルポストのルートです
          path: "/post/:id",

          // path: "/post",
          name: "focusPost",
          component: FocusPost,

          // FocusPostコンポーネントにクエリの値を渡します
          // まだ上手く使いきれてないのでもう少し勉強します
          props: (route) => ({
            post: String(route.query.post)
          }),
        },
      ],

      // ログインページに飛ばす
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
      meta: { requiresAuth: true },
    },
    {
      // 上記以外のURLにアクセスした場合はNot Foundページに遷移します
      path: `/:pathMatch(.*)*`,
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && to.meta.requiresAuth) {
    if (to.name === "signup") {
      next();
    }
    else {
      try {
        axios.get("/api/session", { withCredentials: true })
          .then((res) => {
            if (res.data.flag) {
              // 認証済みの場合はアクセス許可
              console.log("Pass");
              next();
            }
            else {
              console.log("Please Login");
              // ログイン要求
              next("/login");
            }
          });
      }
      catch (err) {
        console.error("Authentication check failed", err);
        next("/login");
      }
    }
  }
  else {
    next();
  }
});

export default router
