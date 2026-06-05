import { useState } from "react";
import '../../css/gongLayout.css';
import ListMain from "./listMain";
import ListView from "./listView";
import ListWrite from "./listWrite";

export default function List() {

    const [boardIdx, setBoardIdx] = useState<number | null>(null);
    const [boardMode, setBoardMode] = useState<string | null>(null);

    const onClickBoardIdx = (nextMode: string, bId: number | null = null) => {
        if(boardMode === "WRITE"){
            const confirmLeave = window.confirm(
                "작성 중인 내용이 저장되지 않을 수 있습니다. 다른 페이지로 이동하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }
        }
        setBoardMode(nextMode);
        if(bId) setBoardIdx(bId)

    }

    return(
        <div className="list-container">
            <div className="list-listManin">
                <ListMain
                    boardIdx={boardIdx}//클릭한 고유번호
                    onClickBoardIdx={onClickBoardIdx}//클릭시
                ></ListMain>
            </div>
            <div className="list-listView">
                {/* 상단 바 (100px 고정) */}
                <div className="header-section">
                    <h2>위</h2>
                </div>
                { (boardMode === "VIEW" || !boardMode) && (
                    <ListView
                        boardIdx={boardIdx}//클릭한 고유번호
                    ></ListView>
                )
                }
                {boardMode === "WRITE" && (
                    <ListWrite
                        boardIdx={null}//클릭한 고유번호
                    ></ListWrite>
                )}
            </div>
        </div>
    );
}