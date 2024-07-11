import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@views/home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '@views/home/index.vue'),
      },
      {
        path: '/permission/user_mangae',
        name: 'userManage',
        meta: {
          title: '用户管理',
        },
        component: () => import(/* webpackChunkName: "user" */ '@views/permission/user/index.vue'),
      },
      {
        path: '/goods/goods_list',
        name: 'goods',
        meta: {
          title: '商品列表',
        },
        component: () => import(/* webpackChunkName: "import" */ '@views/goods/index.vue'),
      },
      {
        path: '/goods/add',
        name: 'addGoods',
        meta: {
          title: '添加商品',
        },
        component: () => import(/* webpackChunkName: "import" */ '@views/goods/add.vue'),
      },
      {
        path: '/order/list',
        name: 'orderList',
        meta: {
          title: '订单列表',
        },
        component: () => import('@views/order/order_list.vue'),
      },
      {
        path: '/order/return',
        name: 'orderReturn',
        meta: {
          title: '退货列表',
        },
        component: () => import('@views/order/order_return_goods.vue'),
      },
      {
        path: '/category',
        name: 'category',
        meta: {
          title: '分类管理',
        },
        component: () => import('@views/category/index.vue'),
      },
      {
        path: '/adv',
        name: 'adv',
        meta: {
          title: '广告位管理',
        },
        component: () => import('@views/adv/index.vue'),
      },
      {
        path: '/user',
        name: 'userManagement',
        meta: {
          title: '后台用户管理',
        },
        component: () => import('@views/user/index.vue'),
      },
      {
        path: '/basic',
        name: 'basic',
        meta: {
          title: '基础设置',
        },
        component: () => import('@views/basic/index.vue'),
      },
    ],
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
