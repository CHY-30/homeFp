import "../../css/gongLayout.css"

interface ListViewType{
    boardIdx: number | null;    
}

export default function ListView({boardIdx}: ListViewType) {

    if(boardIdx === null){
        return(
            <div className="view-Null">좌측에 글을 선택해주세요.</div>
        )
    }

    return(
        <div>오른쪽</div>
    );
}