'use client'
import React, { useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = '200px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const isUpdatingRef = useRef(false);

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
    { type: 'separator' },
    { command: 'removeFormat', icon: '✕', title: t('richEditor.clearFormat', '清除格式') },
  ];

  // 插入链接
  const handleInsertLink = useCallback(() => {
    const url = prompt(t('richEditor.enterUrl', '请输入链接地址:'));
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand, t]);

  // 改变字体大小
  const handleFontSize = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    executeCommand('fontSize', e.target.value);
  }, [executeCommand]);

  // 改变标题级别
  const handleHeading = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    executeCommand('formatBlock', e.target.value);
  }, [executeCommand]);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        {/* 标题选择 */}
        <select
          onChange={handleHeading}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          defaultValue=""
        >
          <option value="">{t('richEditor.paragraph', '正文')}</option>
          <option value="h1">{t('richEditor.heading1', '标题1')}</option>
          <option value="h2">{t('richEditor.heading2', '标题2')}</option>
          <option value="h3">{t('richEditor.heading3', '标题3')}</option>
        </select>

        {/* 字体大小 */}
        <select
          onChange={handleFontSize}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          defaultValue="3"
        >
          <option value="1">{t('richEditor.small', '小')}</option>
          <option value="3">{t('richEditor.normal', '正常')}</option>
          <option value="5">{t('richEditor.large', '大')}</option>
          <option value="7">{t('richEditor.extraLarge', '特大')}</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

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

        {/* 插入链接 */}
        <button
          type="button"
          onClick={handleInsertLink}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          title={t('richEditor.insertLink', '插入链接')}
        >
          🔗
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
      `}</style>
    </div>
  );
}

