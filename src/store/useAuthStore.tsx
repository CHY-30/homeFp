import { create } from 'zustand' ;
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState{
    isLoggedIn: number; //0.비로그인, 1.로그인
    userMidx: number; // 멤버 고유번호
    userId:string;
    userName: string;
    accessToken: string;
    refreshToken: string;
    login:(
        userMidx: number,
        userName: string, 
        userId: string,
        accessToken: string,
        refreshToken: string
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
          refreshToken: '',

          //로그인시 값 저장
          login: (userMidx, userName, userId, accessToken, refreshToken) => {
            
            if (refreshToken){
              sessionStorage.setItem('refreshToken', refreshToken); //추후에 자동로그인 시스템시 로컬로저장
            }

            set({ 
              isLoggedIn: 1, 
              userMidx: userMidx,
              userName: userName, 
              userId: userId,
              accessToken: accessToken,
              refreshToken: refreshToken
            })
          },
    
          // 로그아웃 초기화
          logout: () => {
            sessionStorage.removeItem('refreshToken');
            set({ 
              isLoggedIn: 0, 
              userMidx: 0,
              userName: '', 
              userId: '',
              accessToken: '',
              refreshToken: ''
            })
          },
        }),
        { 
          name: 'auth-storage', 
          storage: createJSONStorage(() => sessionStorage),
        } // 저장이름
      )
);

export default useAuthStore;