import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/board.css";
import { api } from "../../utils/api.ts"; //db경로


export default function Write() {

  const navigate = useNavigate();

  interface from {
    title: string
    content: string
  }

  const [form, setForm] = useState<from>({
    title: '',
    content: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  // 글 작성
  const addPost = async () => {
    if (form.title.trim() === '') {
      alert('제목을 입력하세요.');
      return;
    }
    if (form.content.trim() === '') {
      alert('내용을 입력하세요.');
      return;
    }
    try{
      await api.post('/api/board', form);
      alert('등록 완료');
      navigate('/boardList');
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

  //여기에 프로그래밍
  return (
    <div className="board-write-wrap">

      {/* 헤더 */}
      <div className="board-write-header">
        <div>
          <h1 className="board-write-title">글쓰기</h1>
        </div>

        <Link to="/BoardList">
        <button className="write-button">목록으로</button>
        </Link>
      </div>

      {/* 폼 */}
      <div className="board-form">

        <div className="board-form-row">
          <label>제목</label>
          <input 
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="board-form-row">
          <label>내용</label>
          <textarea 
            name="content"
            placeholder="내용을 입력하세요"
            value={form.content}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* 버튼 */}
      <div className="board-form-footer">
        <button className="board-submit-button" onClick={addPost}>등록하기</button>
      </div>

    </div>
  );
}
