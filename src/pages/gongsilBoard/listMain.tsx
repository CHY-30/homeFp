import { useEffect, useState } from "react";
import "../../css/gongLayout.css"
import { apiGongsil } from "../../utils/apiGongsil"

interface ListMainType{
    onClickBoardIdx: (id: number) => void;    
    boardIdx: number | null;
    
}

export default function ListMain({onClickBoardIdx, boardIdx}:ListMainType) {
    
    interface searchDate{
        page: number;
        count: number;
        keyword: string;
        categoryType: string;
        popularType: string;
        authorId: number;    
    }

    interface board{
        id: number;
        title: string;
        communityCategoryType: string;
    }
    
    const [lists, setLists] = useState<board[]>([]); // 리스트

    const listGongsil = async () => {
        try{
            const rs = await apiGongsil.get(`/api/community/posts/search/list`, {
                    params:{
                        dto:{
                            page: 0,
                            count: 20,
                            keyword: "",
                            categoryType: "NONE",
                            popularType: "NONE",
                            authorId: 0
                        }
                    }
                }
            );

            console.log("서버 응답 데이터:", rs.data);

            setLists(rs.data.result.items);
        }
        catch(err: any){
            alert("오류");
        }
    }

    useEffect(() => {
        listGongsil();
    },[]);

    return(
        <div style={{width:'100%', padding:'0px'}}>
            <div>
                검색공간입니다.
            </div>
            {lists.map((list) => {
                const isSelected = boardIdx === list.id;

                return(
                    <div 
                        key={list.id} 
                        onClick={() => onClickBoardIdx(list.id)}
                        className={`list-Div ${isSelected ? 'selected' : ''}`}
                    >
                        <div>({list.communityCategoryType}) {list.title}</div>
                    </div>
                )
            })}
        </div>
    );
}