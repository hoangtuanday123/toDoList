
import { Api } from '../services/api'
import { userStore } from '../stores/user'
import { storeToRefs } from 'pinia'
const _userStore = userStore();
  const { authToken } = storeToRefs(_userStore);
export const api = new Api({
  securityWorker: () => {
    const token = authToken.value; 
  
    return token ? { 
      headers: { 
        Authorization: `Bearer ${String(token)}` 
      } 
    } : {};
  },
  baseURL: `${import.meta.env.VITE_API_HOST}`,
})
