import { Outlet, Link } from "react-router-dom";

export default function Layout() {
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
            <div><Link to="/Login">로그인하기</Link></div>
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