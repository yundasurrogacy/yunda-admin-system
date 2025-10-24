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
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showRouteIdModal, setShowRouteIdModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [routeId, setRouteId] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showLinkToolbar, setShowLinkToolbar] = useState(false);
  const [linkToolbarPosition, setLinkToolbarPosition] = useState({ top: 0, left: 0 });
  const [activeFormatting, setActiveFormatting] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

  // 处理内容变化
  const handleInput = useCallback(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      
      // 更新活动格式状态
      updateActiveFormatting();
      
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [onChange]);

  // 更新活动格式状态
  const updateActiveFormatting = useCallback(() => {
    const activeFormats = new Set<string>();
    
    try {
      if (document.queryCommandState('bold')) activeFormats.add('bold');
      if (document.queryCommandState('italic')) activeFormats.add('italic');
      if (document.queryCommandState('underline')) activeFormats.add('underline');
      if (document.queryCommandState('strikeThrough')) activeFormats.add('strikeThrough');
      
      // 检查当前块级元素
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const blockElement = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement 
          : container as Element;
        
        if (blockElement) {
          const tagName = blockElement.tagName?.toLowerCase();
          if (['h1', 'h2', 'h3', 'p'].includes(tagName)) {
            activeFormats.add(`formatBlock-${tagName}`);
          }
        }
      }
    } catch (error) {
      console.warn('Error checking command state:', error);
    }
    
    setActiveFormatting(activeFormats);
  }, []);

  // 处理文本选择
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      
      // 检查是否选择了链接
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const linkElement = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('a')
        : (container as Element).closest('a');
      
      if (linkElement) {
        // 选择了链接，显示链接工具栏
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect();
        if (editorRect) {
          setLinkToolbarPosition({
            top: rect.top - editorRect.top - 50,
            left: rect.left - editorRect.left
          });
          setShowLinkToolbar(true);
          setLinkUrl(linkElement.getAttribute('href') || '');
        }
      } else {
        // 选择了普通文本，可以创建链接
        setShowLinkToolbar(false);
      }
    } else {
      setShowLinkToolbar(false);
      setSelectedText('');
    }
    
    // 更新格式状态
    updateActiveFormatting();
  }, [updateActiveFormatting]);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // 移除链接
  const handleRemoveLink = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        // 查找链接元素
        const linkElement = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement?.closest('a')
          : (container as Element).closest('a');
        
        if (linkElement) {
          // 方法1：使用 execCommand
          const success = document.execCommand('unlink', false);
          if (success) {
            showToastMessage('链接移除成功', 'success');
          } else {
            // 方法2：手动移除链接
            const textContent = linkElement.textContent || '';
            const textNode = document.createTextNode(textContent);
            linkElement.parentNode?.replaceChild(textNode, linkElement);
            showToastMessage('使用备用方法移除链接', 'success');
          }
        } else {
          showToastMessage('未找到链接元素', 'warning');
        }
      }
      
      setShowLinkToolbar(false);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      console.error('Error removing link:', error);
    }
  }, [handleInput]);

  // 执行格式化命令
  const executeCommand = useCallback((command: string, value?: string) => {
    try {
      if (command === 'createLink') {
        // 检查是否有选中的文本
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();
        
        if (selectedText) {
          // 有选中文本，保存并显示链接模态框
          setSelectedText(selectedText);
          setShowLinkModal(true);
        } else {
          // 没有选中文本，提示用户先选择文本
          showToastMessage('请先选择要添加链接的文本', 'warning');
          return;
        }
      } else if (command === 'insertRouteId') {
        setShowRouteIdModal(true);
      } else if (command === 'insertText') {
        // 处理换行
        if (value === '\n') {
          document.execCommand('insertHTML', false, '<br>');
        } else {
          document.execCommand('insertText', false, value);
        }
      } else {
        // 执行其他命令
        const success = document.execCommand(command, false, value);
        if (!success) {
          console.warn(`Command ${command} failed`);
        }
      }
      
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }, [handleInput]);

  // 处理键盘快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    if (isCtrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          executeCommand('createLink');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            executeCommand('redo');
          } else {
            e.preventDefault();
            executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  }, [executeCommand]);

  // 添加事件监听器
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('input', handleInput);
      editor.addEventListener('mouseup', handleSelection);
      editor.addEventListener('keyup', handleSelection);
      editor.addEventListener('keydown', handleKeyDown);
      editor.addEventListener('focus', updateActiveFormatting);
      
      // 点击其他地方时隐藏链接工具栏
      const handleClickOutside = (e: MouseEvent) => {
        if (!editor.contains(e.target as Node)) {
          setShowLinkToolbar(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        editor.removeEventListener('input', handleInput);
        editor.removeEventListener('mouseup', handleSelection);
        editor.removeEventListener('keyup', handleSelection);
        editor.removeEventListener('keydown', handleKeyDown);
        editor.removeEventListener('focus', updateActiveFormatting);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [handleInput, handleSelection, handleKeyDown, updateActiveFormatting]);

  // 处理链接插入
  const handleInsertLink = useCallback(() => {
    if (!linkUrl.trim()) {
      showToastMessage('请输入链接地址', 'warning');
      return;
    }

    if (!selectedText || !selectedText.trim()) {
      showToastMessage('没有选中文本，无法创建链接', 'warning');
      return;
    }

    try {
      const url = linkUrl.trim();
      
      // 验证并格式化URL
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
        finalUrl = `https://${url}`;
      }

      // 使用更可靠的方法创建链接
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // 创建链接元素
        const linkElement = document.createElement('a');
        linkElement.href = finalUrl;
        linkElement.textContent = selectedText;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.style.color = '#C2A87A';
        linkElement.style.textDecoration = 'underline';
        linkElement.style.fontWeight = '500';
        
        // 删除选中的内容并插入链接
        range.deleteContents();
        range.insertNode(linkElement);
        
        // 将光标移到链接后面
        range.setStartAfter(linkElement);
        range.setEndAfter(linkElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        showToastMessage(`已为选中文本创建链接: ${finalUrl}`, 'success');
      } else {
        // 备用方法：使用 execCommand
        const success = document.execCommand('createLink', false, finalUrl);
        if (success) {
          showToastMessage(`已为选中文本创建链接: ${finalUrl}`, 'success');
        } else {
          // 最后的备用方法：直接操作 HTML
          if (editorRef.current) {
            const currentHTML = editorRef.current.innerHTML;
            const newHTML = currentHTML.replace(
              new RegExp(selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="color: #C2A87A; text-decoration: underline; font-weight: 500;">${selectedText}</a>`
            );
            editorRef.current.innerHTML = newHTML;
            showToastMessage(`已使用备用方法为文本创建链接: ${finalUrl}`, 'success');
          }
        }
      }
      
    editorRef.current?.focus();
      handleInput();
    } catch (error) {
      showToastMessage('创建链接时发生错误', 'error');
      console.error('Error creating link:', error);
    }
    
    setShowLinkModal(false);
    setLinkUrl('');
    setSelectedText('');
  }, [linkUrl, selectedText, handleInput]);

  // 处理路由标识插入
  const handleInsertRouteId = useCallback(() => {
    if (routeId.trim()) {
      try {
        const span = document.createElement('span');
        span.setAttribute('data-route-id', routeId.trim());
        span.className = 'route-id-marker';
        span.style.backgroundColor = '#fef3c7';
        span.style.padding = '2px 6px';
        span.style.borderRadius = '4px';
        span.style.fontSize = '12px';
        span.style.fontWeight = 'bold';
        span.style.color = '#92400e';
        span.textContent = `[${routeId.trim()}]`;
        
    if (editorRef.current) {
          editorRef.current.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(span);
            range.collapse(false);
          } else {
            editorRef.current.appendChild(span);
          }
          handleInput();
        }
      } catch (error) {
        console.error('Error inserting route ID:', error);
      }
    }
    setShowRouteIdModal(false);
    setRouteId('');
  }, [routeId, handleInput]);

  // 工具栏按钮配置
  const toolbarButtons = [
    // 撤销/重做
    { command: 'undo', icon: '↶', title: t('richEditor.undo', '撤销') + ' (Ctrl+Z)' },
    { command: 'redo', icon: '↷', title: t('richEditor.redo', '重做') + ' (Ctrl+Y)' },
    { type: 'separator' },
    
    // 基础格式
    { command: 'bold', icon: 'B', title: t('richEditor.bold', '粗体') + ' (Ctrl+B)', className: 'font-bold' },
    { command: 'italic', icon: 'I', title: t('richEditor.italic', '斜体') + ' (Ctrl+I)', className: 'italic' },
    { command: 'underline', icon: 'U', title: t('richEditor.underline', '下划线') + ' (Ctrl+U)', className: 'underline' },
    { command: 'strikeThrough', icon: 'S', title: t('richEditor.strikethrough', '删除线'), className: 'line-through' },
    { type: 'separator' },
    
    // 标题
    { command: 'formatBlock', value: 'h1', icon: 'H1', title: t('richEditor.heading1', '标题1') },
    { command: 'formatBlock', value: 'h2', icon: 'H2', title: t('richEditor.heading2', '标题2') },
    { command: 'formatBlock', value: 'h3', icon: 'H3', title: t('richEditor.heading3', '标题3') },
    { command: 'formatBlock', value: 'p', icon: 'P', title: t('richEditor.paragraph', '段落') },
    { type: 'separator' },
    
    // 列表
    { command: 'insertUnorderedList', icon: '•', title: t('richEditor.bulletList', '无序列表') },
    { command: 'insertOrderedList', icon: '1.', title: t('richEditor.numberList', '有序列表') },
    { type: 'separator' },
    
    // 对齐
    { command: 'justifyLeft', icon: '⊏', title: t('richEditor.alignLeft', '左对齐') },
    { command: 'justifyCenter', icon: '⊐', title: t('richEditor.alignCenter', '居中') },
    { command: 'justifyRight', icon: '⊐', title: t('richEditor.alignRight', '右对齐') },
    { command: 'justifyFull', icon: '⊐', title: t('richEditor.justify', '两端对齐') },
    { type: 'separator' },
    
    // 字体大小
    { command: 'fontSize', value: '1', icon: '12px', title: t('richEditor.fontSize12', '12px') },
    { command: 'fontSize', value: '2', icon: '14px', title: t('richEditor.fontSize14', '14px') },
    { command: 'fontSize', value: '3', icon: '16px', title: t('richEditor.fontSize16', '16px') },
    { command: 'fontSize', value: '4', icon: '18px', title: t('richEditor.fontSize18', '18px') },
    { command: 'fontSize', value: '5', icon: '24px', title: t('richEditor.fontSize24', '24px') },
    { command: 'fontSize', value: '6', icon: '32px', title: t('richEditor.fontSize32', '32px') },
    { command: 'fontSize', value: '7', icon: '48px', title: t('richEditor.fontSize48', '48px') },
    { type: 'separator' },
    
    // 字体颜色
    { command: 'foreColor', value: '#000000', icon: 'A', title: t('richEditor.textColor', '文字颜色'), className: 'text-black' },
    { command: 'foreColor', value: '#C2A87A', icon: 'A', title: t('richEditor.textColorGold', '金色'), className: 'text-[#C2A87A]' },
    { command: 'foreColor', value: '#dc2626', icon: 'A', title: t('richEditor.textColorRed', '红色'), className: 'text-red-600' },
    { command: 'foreColor', value: '#059669', icon: 'A', title: t('richEditor.textColorGreen', '绿色'), className: 'text-green-600' },
    { command: 'foreColor', value: '#2563eb', icon: 'A', title: t('richEditor.textColorBlue', '蓝色'), className: 'text-blue-600' },
    { type: 'separator' },
    
    // 背景颜色
    { command: 'backColor', value: '#ffffff', icon: '🎨', title: t('richEditor.bgColorWhite', '白色背景') },
    { command: 'backColor', value: '#fef3c7', icon: '🎨', title: t('richEditor.bgColorYellow', '黄色背景') },
    { command: 'backColor', value: '#fecaca', icon: '🎨', title: t('richEditor.bgColorRed', '红色背景') },
    { command: 'backColor', value: '#bbf7d0', icon: '🎨', title: t('richEditor.bgColorGreen', '绿色背景') },
    { command: 'backColor', value: '#bfdbfe', icon: '🎨', title: t('richEditor.bgColorBlue', '蓝色背景') },
    { type: 'separator' },
    
    // 超链接
    { command: 'createLink', icon: '🔗', title: t('richEditor.createLink', '插入链接') + ' (Ctrl+K)' },
    { command: 'unlink', icon: '🔓', title: t('richEditor.removeLink', '移除链接') },
    { type: 'separator' },
    
    // 路由标识
    { command: 'insertRouteId', icon: '🆔', title: t('richEditor.insertRouteId', '插入路由标识') },
    { type: 'separator' },
    
    // 其他
    { command: 'insertHorizontalRule', icon: '—', title: t('richEditor.horizontalRule', '分割线') },
    { command: 'insertText', value: '\n', icon: '↵', title: t('richEditor.lineBreak', '换行') },
  ];

  // 插入图片
  const handleInsertImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToastMessage(t('richEditor.invalidImageType', '请选择有效的图片文件'), 'error');
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage(t('richEditor.imageTooLarge', '图片大小不能超过5MB'), 'error');
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
        showToastMessage(t('richEditor.uploadFailed', '上传失败，请重试'), 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToastMessage(t('richEditor.uploadError', '上传出错，请重试'), 'error');
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
      showToastMessage(t('richEditor.invalidVideoType', '请选择有效的视频文件'), 'error');
      return;
    }

    // 验证文件大小（50MB）
    if (file.size > 50 * 1024 * 1024) {
      showToastMessage(t('richEditor.videoTooLarge', '视频大小不能超过50MB'), 'error');
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
        showToastMessage(t('richEditor.uploadFailed', '上传失败，请重试'), 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToastMessage(t('richEditor.uploadError', '上传出错，请重试'), 'error');
    } finally {
      setUploading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  }, [handleInput, t]);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white relative ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        {/* 格式化按钮 */}
        {toolbarButtons.map((btn, idx) => 
          btn.type === 'separator' ? (
            <div key={idx} className="w-px h-6 bg-gray-300 mx-1"></div>
          ) : (
            <button
              key={`${btn.command}-${btn.value || 'default'}`}
              type="button"
              onClick={() => executeCommand(btn.command!, btn.value)}
              className={`px-2 py-1 min-w-[28px] border rounded text-sm transition-colors cursor-pointer ${
                activeFormatting.has(btn.command!) || 
                (btn.value && activeFormatting.has(`${btn.command}-${btn.value}`))
                  ? 'border-[#C2A87A] bg-[#C2A87A] text-white' 
                  : 'border-gray-300 bg-white hover:bg-gray-100'
              } ${btn.className || ''}`}
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
          font-weight: 500;
          border-bottom: 1px solid #C2A87A;
          transition: all 0.2s ease;
        }
        [contentEditable] a:hover {
          color: #a88a5c;
          border-bottom-color: #a88a5c;
          background-color: rgba(194, 168, 122, 0.1);
          padding: 1px 2px;
          border-radius: 2px;
        }
        [contentEditable] a:visited {
          color: #8B7355;
        }
        [contentEditable] a:focus {
          outline: 2px solid #C2A87A;
          outline-offset: 1px;
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
        [contentEditable] .route-id-marker {
          background-color: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: #92400e;
          display: inline-block;
          margin: 0 2px;
          cursor: pointer;
        }
        [contentEditable] .route-id-marker:hover {
          background-color: #fde68a;
        }
      `}</style>

      {/* 链接插入模态框 */}
      {showLinkModal && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-1">
          <h3 className="text-base font-semibold mb-3 text-sage-800">{t('richEditor.createLink', '插入链接')}</h3>
          
          {/* 显示选中的文本 */}
          {selectedText && (
            <div className="mb-3 p-2 bg-gray-50 rounded border">
              <span className="text-sm text-gray-600">选中文本：</span>
              <span className="text-sm font-medium text-gray-800">"{selectedText}"</span>
            </div>
          )}
          
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={t('richEditor.enterUrl', '请输入链接地址')}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 mb-4 text-base"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInsertLink();
              } else if (e.key === 'Escape') {
                setShowLinkModal(false);
                setLinkUrl('');
                setSelectedText('');
              }
            }}
          />
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowLinkModal(false);
                setLinkUrl('');
                setSelectedText('');
              }}
              className="min-w-[80px] px-4 py-2 text-base font-semibold border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer capitalize"
            >
              {t('cancel', '取消')}
            </button>
            <button
              onClick={handleInsertLink}
              disabled={!linkUrl.trim()}
              className={`min-w-[80px] px-4 py-2 text-base font-semibold rounded-lg transition-colors shadow cursor-pointer capitalize ${
                linkUrl.trim() 
                  ? 'bg-[#C2A87A] text-white hover:bg-[#a88a5c]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('submit', '确定')}
            </button>
          </div>
        </div>
      )}

      {/* 链接工具栏 */}
      {showLinkToolbar && (
        <div 
          className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 flex gap-2 items-center"
          style={{
            top: linkToolbarPosition.top,
            left: linkToolbarPosition.left,
            transform: 'translateX(-50%)'
          }}
        >
          <button
            onClick={() => {
              setShowLinkModal(true);
              setShowLinkToolbar(false);
            }}
            className="px-3 py-1 text-sm bg-[#C2A87A] text-white rounded hover:bg-[#a88a5c] transition-colors cursor-pointer"
            title={t('richEditor.createLink', '编辑链接')}
          >
            ✏️ {t('richEditor.createLink', '编辑链接')}
          </button>
          <button
            onClick={handleRemoveLink}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
            title={t('richEditor.removeLink', '移除链接')}
          >
            🔗 {t('richEditor.removeLink', '移除链接')}
          </button>
        </div>
      )}

      {/* 路由标识插入模态框 */}
      {showRouteIdModal && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-1">
          <h3 className="text-base font-semibold mb-3 text-sage-800">{t('richEditor.insertRouteId', '插入路由标识')}</h3>
          <input
            type="text"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            placeholder={t('richEditor.enterRouteId', '请输入路由标识')}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 mb-4 text-base"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowRouteIdModal(false);
                setRouteId('');
              }}
              className="min-w-[80px] px-4 py-2 text-base font-semibold border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer capitalize"
            >
              {t('cancel', '取消')}
            </button>
            <button
              onClick={handleInsertRouteId}
              className="min-w-[80px] px-4 py-2 text-base font-semibold bg-[#C2A87A] text-white rounded-lg hover:bg-[#a88a5c] transition-colors shadow cursor-pointer capitalize"
            >
              {t('submit', '确定')}
            </button>
          </div>
        </div>
      )}

      {/* Toast 提示组件 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
          <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
            toastType === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : toastType === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              toastType === 'success' 
                ? 'bg-green-100' 
                : toastType === 'error'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}>
              {toastType === 'success' && (
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toastType === 'error' && (
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toastType === 'warning' && (
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium flex-1">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                toastType === 'success' 
                  ? 'hover:bg-green-600' 
                  : toastType === 'error'
                  ? 'hover:bg-red-600'
                  : 'hover:bg-yellow-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

