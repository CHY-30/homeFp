import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/common.css";
import Layout from "./layout/layout";

import Main from "./pages/main";
import BoardList from "./pages/board/list";
import BoardView from "./pages/board/view";
import BoardWrite from "./pages/board/write";
import BoardEdit from "./pages/board/edit";
import Login from "./pages/member/login";
import Join from "./pages/member/join";
import AuthGuard from './store/useAuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 로그인 (레이아웃 없음) */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* 공통 레이아웃 */}
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Main />} />
            <Route path="/BoardList" element={<BoardList />} />
            <Route path="/BoardWrite" element={<BoardWrite />} />
            <Route path="/BoardView/:id" element={<BoardView />} />
            <Route path="/BoardEdit/:id" element={<BoardEdit />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}