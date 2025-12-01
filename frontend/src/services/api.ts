import axios, { AxiosError, AxiosResponse } from 'axios';
import { userStore } from '../stores/user'
import { storeToRefs } from 'pinia';
import pinia from '../stores/index';

const _userStore = userStore(pinia())

const { authToken } = storeToRefs(_userStore);


export interface Login {
  username: string;
  password: string;

  grant_type?: string | null;

  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

interface invalidTokenRequest {
  token: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface RoleRequest {
  name: string;
}

export interface User {
  id: number;
  username: string;
  permissions: string[];
}
export interface refreshTokenDTO {
  token: string
}


axios.defaults.baseURL = import.meta.env.VITE_API_HOST;
console.log('API Host:', import.meta.env);
axios.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'

  if (authToken.value) {
    config.headers.Authorization = `Bearer ${authToken.value}`;
  }
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const { data, status } = error.response!;
    switch (status) {
      case 400:
        console.error(data);
        break;

      case 401:
        console.error('unauthorised');
        break;

      case 404:
        console.error('/not-found');
        break;

      case 500:
        console.error('/server-error');
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object|string) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const auth = {
  login: (data: Login) => request.post<string>('api/auth/login',data),
  logout: (data: invalidTokenRequest) => request.post<void>('api/auth/logout', data),
  checkToken: (token: string) => request.get<string>(`api/auth/check_token?token=${encodeURIComponent(token)}`),
  refreshToken: (data: refreshTokenDTO) => request.post<string>('api/auth/refresh-token', data),
  getToken: (verification_id: string, token: string) => request.get<string>(`api/auth/get_token?verification_id=${encodeURIComponent(verification_id)}&token=${encodeURIComponent(token)}`),
}

const user = {
  getCurrentUser: () => request.get<User>('/current_user'),
};



const api = {
  auth,
  user
};

export default { api };
