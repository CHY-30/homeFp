import { Link } from "react-router-dom";
import "../../css/board.css";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
  
export default function List() {

  interface Board {
    id: number;
    title: string;
    content: string;
    created_at: Date;
  };
  
  const [posts, setPosts] = useState<Board[]>([]);
  
  // 목록 조회
  const fetchPosts = async () => {
    try{
      const res = await api.get("/api/board");
      setPosts(res.data);
    }
    catch(err: any){
      if (err.response) {
        alert(`서버 오류: ${err.response.status}`);
      } else if (err.request) {
        alert('서버에 연결하지 못했습니다.');
      } else {
        alert(err.message);
      }
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
    
  return (
    <div className="board-list-wrap">
      <div className="board-list-header">
        <div>
          <h1 className="board-title">게시판</h1>
        </div>

        <Link to="/BoardWrite">
          <button className="write-button">등록하기</button>
        </Link>
      </div>

      <div className="board-table">
        <div className="board-table-head">
          <div>제목</div>
          <div className="board-row-date-title">작성일</div>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="board-row">
            <Link to={`/BoardView/${post.id}`}>
              <div className="board-row-title">{post.title}</div>
            </Link>
            <div className="board-row-date">{post.created_at.toString().slice(0,10)}</div>
          </div>
        ))}
      </div>
      
      {/*
      <div className="pagination">
        <button className="page-button">&lt;</button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">4</button>
        <button className="page-button">&gt;</button>
      </div>
      */
      }
    </div>
  );
}