import axios from 'axios';

const baseURL = "https://dev.gongsiltoday.com";

export const apiGongsil = axios.create({
  baseURL,
});

apiGongsil.interceptors.request.use(
  (config) => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6IkFDQ0VTU19UT0tFTiIsImxvZ2luSWQiOiJkZXZ0ZXN0MTAiLCJzdWIiOiJkZXZ0ZXN0MTAiLCJpc3MiOiJnb25nc2lsdG9kYXkiLCJpYXQiOjE3NzkzNTEyNjksImV4cCI6MTc4NzEyNzI2OX0.dNK9pytmgke93lhYQDq8OfXBYOteZ0DhnUcR-dj_Huo";
        
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);