import { Link, Outlet } from 'react-router-dom';
import '../css/gongLayout.css'; // 작성한 CSS 파일 불러오기


export default function GongLayout() {

  return (
    // 최외곽 전체 틀
    <div className="layout-container">
      
      {/* 상단 바 (100px 고정) */}
      <div className="header-section">
        <h2>위</h2>
      </div>

      {/* 하단 본문 영역 (좌우 분할) */}
      <div className="body-container">
        
        {/* 좌측 메뉴 (100px 고정) */}
        <div className="sidebar-section">
          <div><Link to="/">홈으로</Link></div>
          <div>메뉴 2</div>
          <div>메뉴 3</div>
        </div>

        {/* 우측 메인 콘텐츠 (나머지 100% 자동 채움) */}
        <div className="main-section">
          <Outlet />
        </div>

      </div>

    </div>
  );
}