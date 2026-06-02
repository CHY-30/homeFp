import { useEffect, useState } from "react";
import "../../css/gongLayout.css"
import { apiGongsil } from "../../utils/apiGongsil"

interface ListViewType{
    boardIdx: number | null;    
}

export default function ListView({boardIdx}: ListViewType) {

    interface gongsilView{
        id: number; // 고유번호
        title: string; // 제목
        content: string; // 상세내용
        images?: {url: string}[]; // 이미지
        createdAt: string; // 작성일
        communityCategoryType: string; //타입
        authorName: string; //작성명
        agencyName: string; //업체명
        authorNickName: string; //익명닉네임
    }

    const [viewData, setViewData] = useState<gongsilView>(); //내용

    useEffect(() => {

        if(boardIdx === null){return}// 없으면 부르지마

        const fetchData = async () => {
          try {
            const res = await apiGongsil.get(`/api/community/posts/${boardIdx}`);
            console.log(res.data);
            setViewData(res.data.result);
          } catch (err) {
            alert("데이터 불러오기 실패");
          }
        };
        
        fetchData();
      }, [boardIdx]);



    if(boardIdx === null){
        return(
            <div className="view-Null">좌측에 글을 선택해주세요.</div>
        )
    }

    return(
        <div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
                [{viewData?.communityCategoryType}]{' '}{viewData?.title}
            </div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
                {viewData?.communityCategoryType === '익명' ? (
                    <>
                    {viewData?.authorNickName}<br/>
                    {viewData?.createdAt?.substring(0,10)}
                    </>
                ) : (
                    <>
                    {viewData?.authorName}({viewData?.agencyName})<br/>
                    {viewData?.createdAt?.substring(0,10)}
                    </>
                )}
            </div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000',whiteSpace: 'pre-wrap'}}>
                {viewData?.content})<br/>
                {viewData?.images?.map((imgUrl, index) => {
                    return(
                        <img
                            key={index}
                            src={imgUrl.url}
                            style={{ width: 'auto', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
                        />
                    );
                })}
            </div>
        </div>
    );
}