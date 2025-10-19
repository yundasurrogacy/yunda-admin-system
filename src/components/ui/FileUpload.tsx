'use client'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface FileUploadProps {
  fileUrl?: string
  onChange: (file: File) => void
  accept?: string
  className?: string
  showFileName?: boolean
}

export function FileUpload({ 
  fileUrl, 
  onChange, 
  accept,
  className = '',
  showFileName = true
}: FileUploadProps) {
  const { t } = useTranslation('common')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  // 从URL中提取文件名
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const fileName = pathname.split('/').pop() || ''
      // 解码文件名
      return decodeURIComponent(fileName)
    } catch {
      return url.split('/').pop() || 'file'
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleClick}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {fileUrl ? t('ivfClinic.changeFile', '更换文件') : t('ivfClinic.selectFile', '选择文件')}
        </button>
      </div>
      
      {fileUrl && showFileName && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600">✓</span>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#C2A87A] hover:text-[#a88a5c] cursor-pointer transition-colors underline truncate max-w-xs"
            title={getFileNameFromUrl(fileUrl)}
          >
            {getFileNameFromUrl(fileUrl)}
          </a>
        </div>
      )}
    </div>
  )
}

