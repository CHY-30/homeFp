import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../css/board.css";
import { api } from "../../utils/api.ts";

export default function Detail() {

  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const Viewid = Number(id);

  type Board = {
    title: string;
    content: string;
    created_at: string;
  };

  const [data, setData] = useState<Board>({
    title: "",
    content: "",
    created_at: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/board/${id}`);
        setData(res.data);
      } catch (err) {
        alert("데이터 불러오기 실패");
      }
    };

    fetchData();
  }, [id]);

  const deletePost = async (id: number) => {
    const ok = confirm('정말 삭제할까요?');
    if (!ok) return;
  
    try {
      await api.delete(`/api/board/${id}`);
      alert('삭제되었습니다.');
      //리스트이동
      navigate(`/boardList?${searchParams.toString()}`);
  
      // 또는 화면에서 바로 제거하고 싶으면:
      // setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err: any) {
      if (err.response) {
        alert(`삭제 실패: ${err.response.status}`);
      } else {
        alert('서버 연결 실패');
      }
    }
  };

  return (
    <div className="board-view-wrap">

      {/* 헤더 */}
      <div className="board-view-header">
        <h1 className="board-view-title">게시글</h1>

        <Link to={`/boardList?${searchParams.toString()}`}>
        <button className="view-button">목록으로</button>
        </Link>
      </div>

      {/* 메타 정보 */}
      <div className="board-meta">
        <div className="board-title">{data.title}</div>
        <div className="board-date">
          {data.created_at && new Date(data.created_at).toLocaleString()}
        </div>
      </div>

      {/* 본문 */}
      <div className="board-content">
        {data.content}
      </div>

      <div className="board-view-footer">

        <Link to={`/boardEdit/${id}?${searchParams.toString()}`}>
        <button className="view-button">수정하기</button>
        </Link>

        <button className="view-button danger" onClick={() => deletePost(Viewid)}>삭제하기</button>

      </div>

    </div>
  );
}
