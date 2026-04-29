import { create } from 'zustand' ;
import { persist } from 'zustand/middleware'

interface AuthState{
    isLoggedIn: number; //0.비로그인, 1.로그인
    userId:string;
    userName: string;
    login:(
        userName: string, 
        userId: string
    ) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          isLoggedIn: 0,
          userName: '',
          userId: '', // 초기값

          //로그인시 값 저장
          login: (userName, userId) => set({ 
            isLoggedIn: 1, 
            userName: userName, 
            userId: userId 
          }),
    
          // 로그아웃 초기화
          logout: () => set({ 
            isLoggedIn: 0, 
            userName: '', 
            userId: '' 
          }),
        }),
        { name: 'auth-storage' } // 저장이름
      )
);

export default useAuthStore;