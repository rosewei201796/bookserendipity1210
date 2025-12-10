import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, caption: string) => Promise<void>;
  channelName: string;
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  channelName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // 检查文件大小（限制为 50MB）
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile, caption);
      // 重置状态
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[90%] bg-white border-t-4 border-black animate-slide-in flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 bg-[#0000FF] border-b-4 border-black flex items-center justify-between px-6 shrink-0 text-white">
          <div className="flex items-center gap-3">
            <Upload size={24} strokeWidth={3} />
            <h3 className="text-2xl font-black uppercase tracking-tight">UPLOAD MEDIA</h3>
          </div>
          <button 
            onClick={handleClose}
            disabled={isUploading}
            className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-transparent hover:bg-gray-800 disabled:opacity-50"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Channel Info */}
          <div className="border-4 border-black p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-black" />
              <span className="font-bold text-xs uppercase text-gray-600">UPLOAD TO</span>
            </div>
            <h4 className="font-black text-lg uppercase">{channelName}</h4>
          </div>

          {/* File Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-black" />
              <span className="font-bold text-xs uppercase text-gray-600">SELECT FILE</span>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full p-8 border-4 border-dashed border-black bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-[#FFD700] border-4 border-black flex items-center justify-center">
                <Upload size={32} strokeWidth={3} />
              </div>
              <div className="text-center">
                <p className="font-black text-sm uppercase mb-1">Click to Select</p>
                <p className="text-xs font-bold text-gray-600">Images or Videos (Max 50MB)</p>
              </div>
            </button>
          </div>

          {/* Preview */}
          {previewUrl && selectedFile && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-black" />
                <span className="font-bold text-xs uppercase text-gray-600">PREVIEW</span>
              </div>
              
              <div className="border-4 border-black bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon size={24} strokeWidth={2.5} />
                  ) : (
                    <Video size={24} strokeWidth={2.5} />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="border-2 border-black bg-gray-100 flex items-center justify-center overflow-hidden max-h-64">
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-64 object-contain" />
                  ) : (
                    <video src={previewUrl} controls className="max-w-full max-h-64" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Caption */}
          {selectedFile && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-black" />
                <span className="font-bold text-xs uppercase text-gray-600">CAPTION (OPTIONAL)</span>
              </div>
              
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this media..."
                maxLength={200}
                disabled={isUploading}
                className="w-full p-3 border-4 border-black font-bold text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#FFD700] disabled:opacity-50"
              />
              <div className="text-right mt-1">
                <span className="text-xs font-bold text-gray-600">{caption.length}/200</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="h-20 border-t-4 border-black bg-gray-50 flex items-center justify-between px-6 shrink-0">
          <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
            CANCEL
          </Button>
          <Button 
            variant="accent" 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            loading={isUploading}
          >
            UPLOAD
          </Button>
        </div>
      </div>
    </div>
  );
};

