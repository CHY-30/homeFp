import { useEffect, useState } from "react";
import "../../css/gongLayout.css"
import { apiGongsil } from "../../utils/apiGongsil"
import { useForm } from "react-hook-form";

interface ListViewType{
    onClickBoardIdx: (bId?: number | null) => void;  
    onClickBoardMode: (nextMode: string) => void;  
    boardIdx: number | null;    
}

export default function ListView({onClickBoardIdx, onClickBoardMode, boardIdx}: ListViewType) {

    interface gongsilEdit{
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

    const communityCategoryTypeWrite = ['일반', '익명', '구인_구직', '중개사무소']
    //const [editData, setEditData] = useState<gongsilEdit>(); //내용

    useEffect(() => {

        if(boardIdx === null){return}// 없으면 부르지마
        const fetchData = async () => {
          try {
            const res = await apiGongsil.get(`/api/community/posts/${boardIdx}`);
            //setEditData(res.data.result);
            const modData = res.data.result
            setValue("communityCategoryType", modData.communityCategoryType);
            setValue("title", modData.title);
            setValue("content", modData.content);
          } catch (err) {
            alert("데이터 불러오기 실패");
          }
        };
        
        fetchData();
    }, [boardIdx]);

    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        formState: { errors } } = useForm<gongsilEdit>({
            defaultValues: {
            communityCategoryType: '일반', // 초기값 설정
            title: '',
            content: '',
        }
    });

    const currentCategory = watch('communityCategoryType');

    const onsubmit = async (data: gongsilEdit) =>{

        if(boardIdx === null){

            const confirmLeave = window.confirm(
                "등록하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }

            try {
                await apiGongsil.post('/api/community/posts', data);
                //alert('글쓰기 완료');
                onClickBoardMode('RESET');
                onClickBoardIdx(null);
            } catch (err: any) {
                alert(err.response.status+'_'+err.message);
            }

        }
        else{

            const confirmLeave = window.confirm(
                "수정하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }

            try {
                await apiGongsil.patch(`/api/community/posts/${boardIdx}`, data);
                //alert('수정 완료');
                onClickBoardMode('RESET');
                onClickBoardIdx(null);
            } catch (err: any) {
                alert(err.response.status+'_'+err.message);
            }

        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit(onsubmit)}>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>

                <input type='hidden' {...register('communityCategoryType', { required: true })}></input>
                {communityCategoryTypeWrite.map((category) =>{
                    const isCheckCCT = currentCategory === category;

                    if (boardIdx && currentCategory === '익명'){
                        if(category !== '익명') return null;
                    }
                    else{
                        if(category === '익명') return null;
                    }
                    
                    return(
                        <button
                            key={category}
                            type="button"
                            onClick={()=> setValue('communityCategoryType', category)}
                            style={{
                                backgroundColor: isCheckCCT ? '#cdc5ff' : ''
                            }}
                        >
                        {category}
                        </button>
                    ); 
                }
                )}
            </div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
            <input 
                type="text" 
                placeholder="제목을 입력해주세요"
                {...register('title', { required: '제목을 입력해주세요' })}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                {errors.title && <p style={{ color: 'red', fontSize: '12px' }}>{errors.title.message}</p>}
            </div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
                <textarea 
                placeholder="내용을 입력해주세요."
                {...register('content', { required: '내용을 입력해주세요' })}
                style={{ width: '100%', height: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                {errors.content && <p style={{ color: 'red', fontSize: '12px' }}>{errors.content.message}</p>}
            </div>
            <div style={{padding:'20px',borderBottom:'1px solid #000000',whiteSpace: 'pre-wrap'}}>
                <button type="button" onClick={() => {onClickBoardMode("VIEW"); onClickBoardIdx(null);}}>뒤로가기</button>
                {'   '}
                <button type="submit">
                    {boardIdx ? '수정완료' : '등록하기'}
                </button>
            </div>
            </form>
        </div>
    );
}