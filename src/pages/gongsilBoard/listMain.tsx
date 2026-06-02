import { useEffect, useRef, useState } from "react";
import "../../css/gongLayout.css"
import { apiGongsil } from "../../utils/apiGongsil"
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ListMainType{
    onClickBoardIdx: (id: number) => void;    
    boardIdx: number | null;
    
}

export default function ListMain({onClickBoardIdx, boardIdx}:ListMainType) {

    interface board{
        id: number;
        title: string;
        communityCategoryType: string;
        images?: {smallUrl: string}[];
    }

    interface PostListResponse {
        items: board[];
        currentPageIndex: number;
        hasNext: boolean; // 마지막 페이지 여부
    }

    const {ref, inView} = useInView(); //하단 스크롤 감지용
    const keywordRef = useRef<HTMLInputElement>(null);
    const [keyword, setKeyword] = useState("");
    const [categoryType, setCategoryType] = useState("NONE");
    const [popularType, setPopularType] = useState("NONE");
    const [authorId, setAuthorId] = useState(0);

    const {
        data,
        fetchNextPage, // 다음페이지 트리거
        hasNextPage, // 다음페이지 여부
        isFetchingNextPage, // 다음페이지 로딩 중 상태
        status,
    } = useInfiniteQuery<PostListResponse>({
        queryKey: ['gongsilList', keyword, categoryType, popularType, authorId],
        queryFn: async ({ pageParam = 0 }) =>{
            const rs = await apiGongsil.get('/api/community/posts/search/list',{
                params: {
                    page: pageParam,
                    count: 20,
                    ...(keyword && keyword !=='' && { keyword }),
                    ...(categoryType && categoryType !=='NONE' && { categoryType }),
                    ...(popularType && popularType !=='NONE' && { popularType }),
                    ...(authorId && authorId !==0 && { authorId })
                }
            });
            return rs.data.result;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.hasNext ? lastPage.currentPageIndex + 1 : undefined;
        },
    });

    useEffect(() => {
       if (inView && hasNextPage && !isFetchingNextPage){
           fetchNextPage();
       }
    },[inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === 'pending') return <div></div>; //로딩 중...
    if (status === 'error') return <div>에러 발생</div>;

    const handleClear = () => {
        if (keywordRef.current) {
            keywordRef.current.value = ''; 
        }
        setKeyword('');
        keywordRef.current?.focus(); 
    };


    return(
        <div className="total-container"> 
            <div className="search-area">
                <div style={{position: 'relative', padding:'10px'}}>
                <input 
                    type="text"
                    ref={keywordRef}
                    defaultValue={keyword}
                    placeholder="검색어를 입력하세요" 
                    style={{width:'100%', padding:'8px 35px 8px 12px', boxSizing: 'border-box'}}
                    onKeyDown={(e) => e.key === 'Enter' && setKeyword(keywordRef.current?.value || '')}
                />
                <button
                    type="button"
                    onClick={handleClear}
                    className="search-btn"
                >
                ✕
                </button>
                </div>
                <div style={{borderTop:'1px solid #000000', padding:'10px'}}>
                    <button onClick={() => { setPopularType("NONE"); setAuthorId(0);} } style={{backgroundColor: popularType === "NONE" && authorId === 0  ? "#cdc5ff" : ""}}>전체</button>
                    <button onClick={() => { setPopularType("일간"); setAuthorId(0); setCategoryType("NONE");} } style={{backgroundColor: popularType !== "NONE" && authorId === 0 ? "#cdc5ff" : ""}}>인기순</button>
                    <button onClick={() => { setPopularType("NONE"); setAuthorId(84); setCategoryType("NONE");} } style={{backgroundColor: authorId !== 0 ? "#cdc5ff" : ""}}>내가 쓴 글</button>
                </div>
                {popularType === "NONE" && authorId === 0 && (
                <div style={{borderTop:'1px solid #000000',padding:'10px'}}>
                    <button onClick={() => setCategoryType("NONE")} style={{backgroundColor: categoryType === "NONE" ? "#cdc5ff" : ""}}>전체</button>
                    <button onClick={() => setCategoryType("일반")} style={{backgroundColor: categoryType === "일반" ? "#cdc5ff" : ""}}>일반</button>
                    <button onClick={() => setCategoryType("익명")} style={{backgroundColor: categoryType === "익명" ? "#cdc5ff" : ""}}>익명</button>
                    <button onClick={() => setCategoryType("구인_구직")} style={{backgroundColor: categoryType === "구인_구직" ? "#cdc5ff" : ""}}>구인구직</button>
                    <button onClick={() => setCategoryType("중개사무소")} style={{backgroundColor: categoryType === "중개사무소" ? "#cdc5ff" : ""}}>중개사무소 양도양수</button>
                </div>
                )}
                {popularType !== "NONE" && authorId === 0 && (
                <div style={{borderTop:'1px solid #000000',padding:'10px'}}>
                    <button onClick={() => setPopularType("일간")} style={{backgroundColor: popularType === "일간" ? "#cdc5ff" : ""}}>오늘</button>
                    <button onClick={() => setPopularType("주간")} style={{backgroundColor: popularType === "주간" ? "#cdc5ff" : ""}}>주간</button>
                    <button onClick={() => setPopularType("월간")} style={{backgroundColor: popularType === "월간" ? "#cdc5ff" : ""}}>월간</button>
                    <button onClick={() => setPopularType("전체")} style={{backgroundColor: popularType === "전체" ? "#cdc5ff" : ""}}>전체</button>
                </div>
                )}
            </div>

            <div className="list-area">
                {!isFetchingNextPage && data?.pages[0].items.length === 0 && (
                    <div style={{padding:'100px 70px',borderTop:'1px solid #000000'}}>등록된 게시물이 없어요.</div>
                )}
                {data?.pages.map((lists) => (
                    lists.items.map((list) => {
                        const isSelected = boardIdx === list.id;
                        const isSmallImage = list.images && list.images.length > 0 ? list.images[0].smallUrl : null;
                        return(
                            <div 
                                key={list.id} 
                                onClick={() => onClickBoardIdx(list.id)}
                                className={`list-Div ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="list-Div2">
                                    ({list.communityCategoryType})  
                                    {" "}
                                    {list.title} 
                                    {isSmallImage && <img src={isSmallImage} style={{width:'80px',height:'80px'}}></img>}
                                </div>
                            </div>
                        );
                    })
                ))}

                <div ref={ref} style={{ height: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa', borderBottom:'1px solid #000000'}}>
                    {isFetchingNextPage 
                        ? '' 
                        : hasNextPage 
                            ? '스크롤하면 더 보기' 
                            : ''}
                </div>
            </div>

        </div>
    );
}