import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Clipboard } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle global paste events (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (validateFile(file)) {
          e.preventDefault();
          onFileSelect(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      // Only alert if it's a user interaction we want to warn about (optional)
      // For paste, we might silently ignore non-images, but let's be helpful.
      if (file.type) alert('请上传有效的图片文件 (JPEG, PNG, WEBP)');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB');
      return false;
    }
    return true;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">输入图片</h2>
        {selectedFile && (
          <button 
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            清除 / 重新上传
          </button>
        )}
      </div>

      <div 
        className={`
          flex-1 border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden group
          ${isDragging 
            ? 'border-science-500 bg-science-900/10' 
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900/80'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        style={{ cursor: selectedFile ? 'default' : 'pointer' }}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />

        {selectedFile ? (
          <div className="relative w-full h-full p-4 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm group-hover:bg-slate-900/40 transition-colors">
             <img 
               src={URL.createObjectURL(selectedFile)} 
               alt="Preview" 
               className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
             />
             <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700 flex items-center justify-between">
                <span className="text-sm text-slate-300 truncate font-mono max-w-[150px]">{selectedFile.name}</span>
                <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{(selectedFile.size / 1024).toFixed(1)} KB</span>
             </div>
             
             {/* Overlay for replacing image */}
             <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium flex items-center">
                  <Clipboard className="w-5 h-5 mr-2" />
                  粘贴或点击替换
                </p>
             </div>
          </div>
        ) : (
          <div className="text-center p-8 pointer-events-none">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-science-500/20 text-science-400' : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isDragging ? '松开鼠标上传！' : '点击、拖拽 或 Ctrl+V 粘贴'}
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              支持直接粘贴剪贴板中的图片。<br/>
              支持格式: JPEG, PNG, WEBP
            </p>
            <div className="pointer-events-auto">
              <Button 
                variant="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                icon={<ImageIcon className="w-4 h-4" />}
              >
                选择文件
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};