import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; //zustAnd

const baseURL = import.meta.env.VITE_API_URL;

//비로그인접속
export const freeApi = axios.create({
  baseURL,
});

//로그인접속
export const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
        
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('로그인이 만료되었습니다.');
      useAuthStore.getState().logout();
      window.location.href = '/login'; 
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
    }
    return Promise.reject(error);
  }
);