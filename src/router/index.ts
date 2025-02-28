import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@views/home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth',
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import(/* webpackChunkName: "login" */ '@views/login/login.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限',
    },
    component: () => import(/* webpackChunkName: "403" */ '@views/403.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {
      title: '授权码管理',
    },
    component: () => import('@views/auth/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
