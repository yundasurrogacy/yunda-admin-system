'use client'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FileUploadProps {
  value?: string; // 文件URL
  onChange: (url: string) => void;
  accept?: string;
  className?: string;
  uploadFunction: (file: File) => Promise<string>;
}

export function FileUpload({ value, onChange, accept, className = '', uploadFunction }: FileUploadProps) {
  const { t } = useTranslation('common');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    
    try {
      const url = await uploadFunction(file);
      onChange(url);
    } catch (error) {
      console.error('文件上传失败:', error);
      setFileName('');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!value ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#C2A87A]"></div>
              {t('ivfClinic.uploading', '上传中...')}
            </span>
          ) : (
            t('ivfClinic.chooseFile', '选择文件')
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {fileName || t('ivfClinic.viewFile', '查看文件')}
          </a>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 cursor-pointer transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

