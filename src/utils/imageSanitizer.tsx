export const getSecureFileName = (fileName: string, index: number): string => {
    const idx = fileName.lastIndexOf(".");
    const ext = idx !== -1 ? fileName.substring(idx).toLowerCase() : '.jpg';
    return `img_${Date.now()}_${index}${ext}`;
  };
  
  // 단일 이미지 캔버스 세탁 함수
  export const sanitizeImageFile = (file: File, mimeType: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          const img = new Image();
          img.src = result;
          img.onerror = () => reject(new Error('이미지 객체 생성 실패'));
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('캔버스 컨텍스트 생성 실패'));
  
            if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Blob 변환 실패')), mimeType);
          };
        } else {
          reject(new Error('결과값 string 변환 실패'));
        }
      };
    });
  };
  
  // 복수 파일 배열 전체를 일괄 세탁하는 마스터 함수
  export const sanitizeImageFiles = async (files: File[]): Promise<{ blob: Blob | File; name: string }[]> => {
    return Promise.all(
      files.map(async (file, index) => {
        if (file.type.startsWith('image/')) {
          try {
            const cleanBlob = await sanitizeImageFile(file, file.type);
            return { blob: cleanBlob, name: getSecureFileName(file.name, index) };
          } catch (err) {
            console.error(`세탁 실패 (${file.name}):`, err);
            return { blob: file, name: `img_safe_${Date.now()}_${index}_${file.name}` };
          }
        }
        return { blob: file, name: file.name };
      })
    );
  };