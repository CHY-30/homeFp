import { Link, useSearchParams, useNavigate } from "react-router-dom";
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

  const [ searchParams ] = useSearchParams(); // URL파라미터
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); //페이지
  const [totalPages, setTotalPages] = useState(1); //총페이지
  const [posts, setPosts] = useState<Board[]>([]); // 리스트

  const [sType, setSType] = useState('all'); //검색타입
  const [sText, setSText] = useState(''); //검색어

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name === "sType"){setSType(value);}
    if(name === "sText"){setSText(value);}
  };
  
  // 목록 조회
  const fetchPosts = async (searchData: any) => {
    try{
      const res = await api.get(`/api/board`,{
        params: searchData
      });

      setPosts(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
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
    const params = Object.fromEntries(searchParams.entries());
    const searchData = {
      page: params.page || '1',
      sType: params.sType || 'all',
      sText: params.sText || '',
    }

    setSText(searchData.sText);
    setSType(searchData.sType);
    setCurrentPage(Number(searchData.page));

    fetchPosts(searchData);

  }, [searchParams]);

  //검색버튼
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryString = new URLSearchParams({
      page: '1',
      sType: sType,
      sText: sText
    }).toString();
    
    navigate(`/boardList?${queryString}`);
  };

  // 페이징버튼
  const onPageing = (newPage: Number) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("page", newPage.toString());
    navigate(`/boardList?${newParams}`);
  }
    
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
            <Link to={`/BoardView/${post.id}?${searchParams.toString()}`}>
              <div className="board-row-title">{post.title}</div>
            </Link>
            <div className="board-row-date">{post.created_at.toString().slice(0,10)}</div>
          </div>
        ))}
      </div>
      
      
      <div className="pagination">
        <button className="page-button"
          disabled={currentPage === 1}
          onClick={() => onPageing(currentPage - 1 )}
        >&lt;</button>
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i + 1}
            onClick={() => onPageing(i + 1)}
            className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}

          >{i + 1}</button>
        ))}
        <button className="page-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageing(currentPage + 1 )}
        >&gt;</button>
      </div>

      <div>
        {/* 검색 폼 (라이브러리 없이 직접 구현) */}
        <form onSubmit={onSearch} className="search-wrap">
          <select 
            name="sType" 
            value={sType}
            onChange={handleInputChange}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          
          <input 
            type="text"
            name="sText"
            value={sText}
            onChange={handleInputChange}
            placeholder="검색어를 입력하세요" 
          />
          <button type="submit">검색하기</button>
        </form>
      </div>
    </div>
  );
}