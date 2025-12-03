
import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { userStore } from '../stores/user'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const _userStore = userStore();
  const { authToken } = storeToRefs(_userStore);
  if (authToken.value && (to.path === '/' || to.path === '/login')) {
    return next({ path: '/home' });
  }
  if (!authToken.value && to.path !== '/login') {
    return next({
      path: '/login',
      query: { return_url: encodeURIComponent(to.fullPath) }
    });
  }
  return next();
})

export default router