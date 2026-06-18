import React, { useEffect } from "react";
import "../../css/gongLayout.css"
import { apiGongsil } from "../../utils/apiGongsil"
import { useForm } from "react-hook-form";
import { gbImagesUpload } from "../../hooks/gbImagesUpload";

interface ListViewType{
    onClickBoardModeIdx: (nextMode: string, nextIdx: number | null) => void;
    boardIdx: number | null;    
}

export default function ListView({onClickBoardModeIdx, boardIdx}: ListViewType) {

    interface gongsilEdit{
        id: number; // 고유번호
        title: string; // 제목
        content: string; // 상세내용
        communityCategoryType: string; //타입
    }

    //업로드 커스텀훅
    const { upLoadedImages, isUploading, gbUploadImages, gbRemoveImage, gbSetImages } = gbImagesUpload();

    const communityCategoryTypeWrite = ['일반', '익명', '구인_구직', '중개사무소']

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

            if (modData.images){
                gbSetImages(modData.images);
            }

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;
        const files = Array.from(e.target.files);
        if(files.length === 0) return;
        await gbUploadImages(files);
        e.target.value = '';
    }

    const onsubmit = async (data: gongsilEdit) =>{

        const gbImagesIds = upLoadedImages? upLoadedImages.map((imgid) => imgid.id) : []; //이미지 아이디 추출
        const submitData = {
            ...data,
            imageIds: gbImagesIds,
        }        

        //console.log(submitData);
        
        if(boardIdx === null){

            const confirmLeave = window.confirm(
                "등록하시겠습니까?"
            );
            if (!confirmLeave) {
                return; 
            }

            try {
                await apiGongsil.post('/api/community/posts', submitData);
                //alert('글쓰기 완료');
                onClickBoardModeIdx('RESET', null);
            } catch (err: any) {
                alert(err.response.data.message);
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
                await apiGongsil.patch(`/api/community/posts/${boardIdx}`, submitData);
                //alert('수정 완료');
                onClickBoardModeIdx('RESET', boardIdx);
            } catch (err: any) {
                alert(err.response.data.message);
            }

        }
    }
    
    return(
        <div>
            <form onSubmit={handleSubmit(onsubmit)}>
            <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>

                {communityCategoryTypeWrite.map((category) =>{
                    const isCheckCCT = currentCategory === category;
                    
                    if(boardIdx){
                        if (currentCategory === '익명'){
                            if(category !== '익명') return null;
                        }
                        else{
                            if(category === '익명') return null;
                        }
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
            {<div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={isUploading}></input>
                {isUploading && <span className="upload-loader">사진 업로드 중...</span>}
            </div>}
            {upLoadedImages.length > 0 && (
                <div style={{padding:'20px',borderBottom:'1px solid #000000'}}>
                    {upLoadedImages.map((imgUrl, index) => (
                        <span key={index}>
                            {/* 문자열 배열이므로 imgUrl 자체를 src에 바인딩합니다 */}
                            <img src={imgUrl.smallUrl} alt="미리보기" className="preview-img" />
                            <button 
                                type="button" 
                                className="preview-delete-btn" 
                                onClick={() => gbRemoveImage(index)} // 정확한 삭제 함수명 매칭
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div style={{padding:'20px',borderBottom:'1px solid #000000',whiteSpace: 'pre-wrap'}}>
                <button type="button" onClick={() => {onClickBoardModeIdx("VIEW", boardIdx);}}>뒤로가기</button>
                {'   '}
                <button type="submit">
                    {boardIdx ? '수정하기' : '등록하기'}
                </button>
            </div>
            </form>
        </div>
    );
}