import { useState } from "react";
import '../../css/gongLayout.css';
import ListMain from "./listMain";
import ListView from "./listView";

export default function List() {

    const [boardIdx, setBoardIdx] = useState<number | null>(null);

    return(
        <div className="list-container">
            <div className="list-listManin">
                <ListMain
                    boardIdx={boardIdx}//클릭한 고유번호
                    onClickBoardIdx={setBoardIdx}//클릭시
                ></ListMain>
            </div>
            <div className="list-listView">
                {/* 상단 바 (100px 고정) */}
                <div className="header-section">
                    <h2>위</h2>
                </div>
                <ListView
                    boardIdx={boardIdx}//클릭한 고유번호
                ></ListView>
            </div>
        </div>
    );
}