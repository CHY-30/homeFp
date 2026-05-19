import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; //zustAnd

let cntcnt = 0;
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
  async(error) => {

    const originRequest = error.config;

    if (error.response && error.response.status === 401) {

      if (originRequest._retry) {
        console.log("재시도 요청에서도 401 에러 발생. 인증이 완전히 만료되었습니다.");
        useAuthStore.getState().logout();
        alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = '/login'; 
        return Promise.reject(error);
      }

      originRequest._retry = true;

      try{
        const oldRefreshToken = sessionStorage.getItem('refreshToken');
        if(!oldRefreshToken) throw new Error("토큰이 없습니다.");
        
        const res = await axios.post(`${baseURL}/api/member/refresh`, {oldRefreshToken});
        const { userMidx, userId, userName, newaccessToken, newrefreshToken } = res.data;

        useAuthStore.getState().login(userMidx, userId, userName, newaccessToken, newrefreshToken);

        originRequest.headers.Authorization = `Bearer ${newaccessToken}`;

        return api(originRequest);

      } catch{

        console.log('로그인이 만료되었습니다.');
        useAuthStore.getState().logout();
        window.location.href = '/login'; 
        alert("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요1.");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);