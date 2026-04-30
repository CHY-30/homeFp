import { create } from 'zustand' ;
import { persist } from 'zustand/middleware'

interface AuthState{
    isLoggedIn: number; //0.비로그인, 1.로그인
    userMidx: number; // 멤버 고유번호
    userId:string;
    userName: string;
    accessToken: string;
    login:(
        userMidx: number,
        userName: string, 
        userId: string,
        accessToken: string
    ) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          isLoggedIn: 0,
          userMidx: 0,
          userName: '',
          userId: '', // 초기값
          accessToken: '',

          //로그인시 값 저장
          login: (userMidx, userName, userId, accessToken) => set({ 
            isLoggedIn: 1, 
            userMidx: userMidx,
            userName: userName, 
            userId: userId,
            accessToken: accessToken
          }),
    
          // 로그아웃 초기화
          logout: () => set({ 
            isLoggedIn: 0, 
            userMidx: 0,
            userName: '', 
            userId: '',
            accessToken: ''
          }),
        }),
        { name: 'auth-storage' } // 저장이름
      )
);

export default useAuthStore;