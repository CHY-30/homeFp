import { useState } from "react";
import { apiGongsil } from "../utils/apiGongsil"

interface uLIType{
    id: string;
    bucket: string;
    url: string;
    middleUrl: string;
    smallUrl: string;
    largeUrl: string;
}

export function gbImagesUpload(){
    const [upLoadedImages, setUpLoadedImages] = useState<uLIType[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const gbUploadImages = async(files: File[]) => {
        if(files.length === 0) return;
        setIsUploading(true);

        const formData = new FormData();
        files.forEach((file) => formData.append('images', file, file.name));

        try{
            const response = await apiGongsil.post('/api/images/communities', formData, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.data.code === 200){
                setUpLoadedImages((prev) => [...prev, ...response.data.result]);
            }
        } catch(err){
            console.error('업로드 실패:', err);
            alert('업로드 실패');
        } finally {
            setIsUploading(false);
        }
    };

    //수정시 목록체우기
    const gbSetImages = (images: uLIType[]) =>{
        setUpLoadedImages(images);
    }

    // 개별삭제하기
    const gbRemoveImage = (indexToRemove:number) =>{
        setUpLoadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return { upLoadedImages, isUploading, gbUploadImages, gbRemoveImage, gbSetImages }
}