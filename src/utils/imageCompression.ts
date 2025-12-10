/**
 * 压缩 base64 图片
 * @param base64Str - base64 格式的图片字符串
 * @param maxWidth - 最大宽度（默认 800px）
 * @param quality - 压缩质量 0-1（默认 0.7）
 * @returns 压缩后的 base64 字符串
 */
export async function compressBase64Image(
  base64Str: string,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> {
  console.log(`🔧 Compressing image: ${base64Str.substring(0, 50)}...`);
  
  return new Promise((resolve, reject) => {
    try {
      // 创建图片元素
      const img = new Image();
      
      img.onload = () => {
        console.log(`📐 Image loaded: ${img.width}x${img.height}`);
        try {
          // 计算压缩后的尺寸
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          // 创建 canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // 绘制图片
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // 转换为压缩后的 base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // 计算压缩比例
          const originalSize = base64Str.length;
          const compressedSize = compressedBase64.length;
          const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
          
          console.log(`Image compressed: ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB (${ratio}% reduction)`);
          
          resolve(compressedBase64);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // 加载图片
      img.src = base64Str;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 批量压缩图片
 */
export async function compressImages(
  base64Images: string[],
  maxWidth?: number,
  quality?: number
): Promise<string[]> {
  const compressed: string[] = [];
  
  for (const base64 of base64Images) {
    try {
      const compressedImage = await compressBase64Image(base64, maxWidth, quality);
      compressed.push(compressedImage);
    } catch (error) {
      console.error('Failed to compress image:', error);
      // 如果压缩失败，使用原图
      compressed.push(base64);
    }
  }
  
  return compressed;
}

