import { Outlet, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Layout() {

  const { userId, userName, isLoggedIn } = useAuthStore();

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
              <div><Link to="/Login">로그아웃하기</Link></div>
              </>
            ) : (
              <div><Link to="/Login">로그인하기</Link></div>
            )}
            <div><Link to="/BoardList">게시판으로</Link></div>
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