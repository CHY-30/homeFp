import { Outlet, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useAuthLogOut } from "../store/useAuthLogOut";

const getRemainingTime = () => {
  const expireTime = sessionStorage.getItem('tokenExpireTime');
  if (!expireTime) return "로그인 필요";

  // 만료 시간에서 현재 시간을 뺌 (밀리초 단위 계산)
  const remainMs = parseInt(expireTime) - Date.now();

  if (remainMs <= 0) {
    return "만료됨";
  }

  // 분과 초로 환산
  const totalSeconds = Math.floor(remainMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}분 ${seconds}초 남음`;
};


export default function Layout() {

  const { userId, userName, isLoggedIn } = useAuthStore();
  const pageLogOut = useAuthLogOut();

  return (
    <div className="wrap">

      <header className="header">
        <div>
          <Link to="/">메인으로</Link>
        </div>
      </header>

      <div className="middle">
        <aside className="sidebar">
          <div> 
            {isLoggedIn === 1 ? (
              <>
              <div>{userName}({userId})</div>
              <div>{getRemainingTime()}</div>
              <div onClick={pageLogOut} style={{ cursor: 'pointer' }}>로그아웃하기</div>
              </>
            ) : (
              <div><Link to="/Login">로그인하기</Link></div>
            )}
            <div><Link to="/BoardList">게시판으로</Link></div>
            <div><Link to="/Props">Props</Link></div>
            <div><Link to="/GongsilList">공실게시판</Link></div>
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>

      <footer className="footer">밑</footer>

    </div>
  );
}