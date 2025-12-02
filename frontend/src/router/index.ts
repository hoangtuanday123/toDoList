
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
  if (to.path === '/') next()
  if (to.path !== '/login' && !authToken.value) next({ path: '/login', query: { return_url: encodeURIComponent(to.fullPath) } })
  else next()
  next()
})

export default router