import { useState } from "react";
import '../../css/gongLayout.css';
import ListMain from "./listMain";
import ListView from "./listView";
import ListWrite from "./listWrite";
import { useQueryClient } from "@tanstack/react-query";

export default function List() {

    const [boardIdx, setBoardIdx] = useState<number | null>(null);
    const [boardMode, setBoardMode] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const onClickBoardMode = (nextMode: string) => {  
        if(boardMode === "WRITE" && nextMode !== "RESET" && nextMode !== "WRITE"){
            const confirmLeave = window.confirm(
                "작성 중인 내용이 저장되지 않을 수 있습니다. 다른 페이지로 이동하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }
        }
        if(boardMode === "EDIT" && nextMode !== "RESET" && nextMode !== "EDIT"){
            const confirmLeave = window.confirm(
                "수정 중인 내용이 저장되지 않을 수 있습니다. 다른 페이지로 이동하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }
        }
        if(nextMode === "RESET"){
            nextMode = "";
            queryClient.invalidateQueries({ queryKey: ['gongsilList'] });  
        }
        setBoardMode(nextMode);
    }
    const onClickBoardIdx = (bId: number | null = null) => {
       setBoardIdx(bId)
    }

    return(
        <div className="list-container">
            <div className="list-listManin">
                <ListMain
                    boardIdx={boardIdx}//클릭한 고유번호
                    onClickBoardIdx={onClickBoardIdx} 
                    onClickBoardMode={onClickBoardMode}
                ></ListMain>
            </div>
            <div className="list-listView">
                {/* 상단 바 (100px 고정) */}
                <div className="header-section">
                    <h2>위</h2>
                </div>
                {(boardMode === "VIEW" || !boardMode) && (
                    <ListView
                        boardIdx={boardIdx}//클릭한 고유번호
                        onClickBoardIdx={onClickBoardIdx} 
                        onClickBoardMode={onClickBoardMode}
                    ></ListView>
                )}
                {boardMode === "WRITE" && (
                    <ListWrite
                        boardIdx={null}//클릭한 고유번호
                        onClickBoardIdx={onClickBoardIdx}
                        onClickBoardMode={onClickBoardMode}
                    ></ListWrite>
                )}
                {boardMode === "EDIT" && (
                    <ListWrite
                        boardIdx={boardIdx}//클릭한 고유번호
                        onClickBoardIdx={onClickBoardIdx}
                        onClickBoardMode={onClickBoardMode}
                    ></ListWrite>
                )}
            </div>
        </div>
    );
}