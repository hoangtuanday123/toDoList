import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/bare-layout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/index.vue')
      },
      {
        path: '/login',
        component: () => import('pages/login.vue')
      },
      {
        path: '/home',
        component: () => import('pages/home.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
];

export default routes;
