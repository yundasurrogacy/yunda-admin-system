'use client'
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const UPLOAD_API = '/api/upload/form';

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = '200px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');
  const isUpdatingRef = useRef(false);
  const [uploading, setUploading] = useState(false);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // 执行格式化命令
  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  // 处理内容变化
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [onChange]);

  // 工具栏按钮配置
  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: t('richEditor.bold', '粗体'), className: 'font-bold' },
    { command: 'italic', icon: 'I', title: t('richEditor.italic', '斜体'), className: 'italic' },
    { command: 'underline', icon: 'U', title: t('richEditor.underline', '下划线'), className: 'underline' },
    { command: 'strikeThrough', icon: 'S', title: t('richEditor.strikethrough', '删除线'), className: 'line-through' },
    { type: 'separator' },
    { command: 'insertUnorderedList', icon: '•', title: t('richEditor.bulletList', '无序列表') },
    { command: 'insertOrderedList', icon: '1.', title: t('richEditor.numberList', '有序列表') },
    { type: 'separator' },
    { command: 'justifyLeft', icon: '⊏', title: t('richEditor.alignLeft', '左对齐') },
    { command: 'justifyCenter', icon: '⊐', title: t('richEditor.alignCenter', '居中') },
    { command: 'justifyRight', icon: '⊐', title: t('richEditor.alignRight', '右对齐') },
  ];

  // 插入图片
  const handleInsertImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert(t('richEditor.invalidImageType', '请选择有效的图片文件'));
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert(t('richEditor.imageTooLarge', '图片大小不能超过5MB'));
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch(UPLOAD_API, {
        method: 'POST',
        body: fd,
      });
      
      const data = await res.json();
      
      if (data.success) {
        const imageUrl = data.data.url || data.data;
        // 插入图片到编辑器
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '10px 0';
        
        if (editorRef.current) {
          editorRef.current.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            range.collapse(false);
          } else {
            editorRef.current.appendChild(img);
          }
          handleInput();
        }
      } else {
        alert(t('richEditor.uploadFailed', '上传失败，请重试'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('richEditor.uploadError', '上传出错，请重试'));
    } finally {
      setUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  }, [handleInput, t]);

  // 插入视频
  const handleInsertVideo = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      alert(t('richEditor.invalidVideoType', '请选择有效的视频文件'));
      return;
    }

    // 验证文件大小（50MB）
    if (file.size > 50 * 1024 * 1024) {
      alert(t('richEditor.videoTooLarge', '视频大小不能超过50MB'));
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch(UPLOAD_API, {
        method: 'POST',
        body: fd,
      });
      
      const data = await res.json();
      
      if (data.success) {
        const videoUrl = data.data.url || data.data;
        // 插入视频到编辑器
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.margin = '10px 0';
        
        if (editorRef.current) {
          editorRef.current.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(video);
            range.collapse(false);
          } else {
            editorRef.current.appendChild(video);
          }
          handleInput();
        }
      } else {
        alert(t('richEditor.uploadFailed', '上传失败，请重试'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('richEditor.uploadError', '上传出错，请重试'));
    } finally {
      setUploading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  }, [handleInput, t]);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        {/* 格式化按钮 */}
        {toolbarButtons.map((btn, idx) => 
          btn.type === 'separator' ? (
            <div key={idx} className="w-px h-6 bg-gray-300 mx-1"></div>
          ) : (
            <button
              key={btn.command}
              type="button"
              onClick={() => executeCommand(btn.command!)}
              className={`px-2 py-1 min-w-[28px] border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer ${btn.className || ''}`}
              title={btn.title}
            >
              {btn.icon}
            </button>
          )
        )}

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 上传图片 */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('richEditor.uploadImage', '上传图片')}
          disabled={uploading}
        >
          {uploading ? '⏳' : '🖼️'}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleInsertImage}
          className="hidden"
        />

        {/* 上传视频 */}
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('richEditor.uploadVideo', '上传视频')}
          disabled={uploading}
        >
          {uploading ? '⏳' : '🎬'}
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleInsertVideo}
          className="hidden"
        />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 清除格式 */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          title={t('richEditor.clearFormat', '清除格式')}
        >
          ✕
        </button>
      </div>

      {/* 编辑区域 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="px-4 py-3 outline-none overflow-y-auto focus:ring-2 focus:ring-[#C2A87A] focus:ring-inset"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contentEditable] {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        [contentEditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contentEditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contentEditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contentEditable] ul, [contentEditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contentEditable] li {
          margin: 0.5em 0;
        }
        [contentEditable] a {
          color: #C2A87A;
          text-decoration: underline;
        }
        [contentEditable] img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 8px;
          display: block;
          cursor: pointer;
        }
        [contentEditable] img:hover {
          opacity: 0.9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        [contentEditable] video {
          max-width: 100%;
          margin: 10px 0;
          border-radius: 8px;
          display: block;
        }
      `}</style>
    </div>
  );
}

