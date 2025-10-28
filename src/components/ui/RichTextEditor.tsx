'use client'
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string | number;
}

const UPLOAD_API = '/api/upload/form';

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = '200px', maxHeight = 'clamp(360px, 60vh, 720px)' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');
  const isUpdatingRef = useRef(false);
  const isInsertingLinkRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [showRouteIdModal, setShowRouteIdModal] = useState(false);
  const [routeId, setRouteId] = useState('');
  
  // 链接相关状态
  const [selectedText, setSelectedText] = useState('');
  // 兼容旧代码的占位（已不再使用自定义链接模态框）
  const showLinkModal = false;
  const setShowLinkModal = (_open: boolean) => {};
  const linkUrl = '';
  const setLinkUrl = (_v: string) => {};
  const linkText = '';
  const setLinkText = (_v: string) => {};
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


  // 处理HTML链接标签转换（清理样式与多余属性，保留安全属性）
  const convertHtmlLinks = useCallback((html: string): string => {
    const linkRegex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    return html.replace(linkRegex, (_match, attrs, inner) => {
      const hrefMatch = /href\s*=\s*(["'])(.*?)\1/i.exec(attrs || '');
      const href = hrefMatch ? hrefMatch[2] : '#';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
    });
  }, []);

  // 处理内容变化
  const handleInput = useCallback(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      
      // 获取当前HTML内容
      let htmlContent = editorRef.current.innerHTML;
      console.log('🔧 handleInput - 原始HTML内容:', htmlContent);
      
      // 转换HTML链接标签
      htmlContent = convertHtmlLinks(htmlContent);
      console.log('🔧 handleInput - 转换后HTML内容:', htmlContent);
      
      // 如果内容有变化，更新编辑器
      if (htmlContent !== editorRef.current.innerHTML) {
        console.log('🔧 handleInput - 内容有变化，更新编辑器');
        console.log('🔧 handleInput - 更新前:', editorRef.current.innerHTML);
        editorRef.current.innerHTML = htmlContent;
        console.log('🔧 handleInput - 更新后:', editorRef.current.innerHTML);
      } else {
        console.log('🔧 handleInput - 内容无变化，跳过更新');
      }
      
      onChange(htmlContent);
      
      // 延迟更新活动格式状态，避免循环依赖
      setTimeout(() => {
        updateActiveFormatting();
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [onChange, convertHtmlLinks]);

  // 应用块级格式的现代方法 - 支持切换功能
  const applyBlockFormat = useCallback((tagName: string) => {
    console.log('🔧 applyBlockFormat called with:', tagName); // 调试日志
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ No selection found');
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    
    console.log('✅ Selected text:', selectedText); // 调试日志
    
    // 检查当前是否已经在相同格式的标题中
    const container = range.commonAncestorContainer;
    const blockElement = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container as Element;
    
    // 如果当前已经在相同格式的标题中，则取消标题格式
    if (blockElement && blockElement.tagName.toLowerCase() === tagName) {
      console.log('✅ 当前已在相同格式中，取消标题格式');
      
      // 创建普通段落元素
      const paragraph = document.createElement('p');
      paragraph.innerHTML = blockElement.innerHTML;
      paragraph.style.fontSize = '16px';
      paragraph.style.margin = '12px 0';
      paragraph.style.lineHeight = '1.6';
      paragraph.style.display = 'block';
      
      // 替换当前元素
      blockElement.parentNode?.replaceChild(paragraph, blockElement);
      
      // 将光标放在新元素内
      const newRange = document.createRange();
      newRange.setStart(paragraph, 0);
      newRange.setEnd(paragraph, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      console.log('✅ 已取消标题格式，转换为段落');
      
      // 触发输入事件
      handleInput();
      return;
    }
    
    // 方法1: 使用现代 Selection API
    if (selectedText) {
      // 有选中文本，直接创建标题元素
      const element = document.createElement(tagName);
      element.textContent = selectedText;
      
      // 添加内联样式确保立即生效 - 使用px单位避免累积
      if (tagName === 'h1') {
        element.style.fontSize = '32px';
        element.style.fontWeight = 'bold';
        element.style.margin = '16px 0';
        element.style.color = '#1f2937';
        element.style.lineHeight = '1.2';
        element.style.display = 'block';
      } else if (tagName === 'h2') {
        element.style.fontSize = '24px';
        element.style.fontWeight = 'bold';
        element.style.margin = '14px 0';
        element.style.color = '#374151';
        element.style.lineHeight = '1.3';
        element.style.display = 'block';
      } else if (tagName === 'h3') {
        element.style.fontSize = '18px';
        element.style.fontWeight = 'bold';
        element.style.margin = '12px 0';
        element.style.color = '#4b5563';
        element.style.lineHeight = '1.4';
        element.style.display = 'block';
      } else if (tagName === 'p') {
        element.style.fontSize = '16px';
        element.style.margin = '12px 0';
        element.style.lineHeight = '1.6';
        element.style.display = 'block';
      }
      
      range.deleteContents();
      range.insertNode(element);
      
      console.log('✅ Created element:', element); // 调试日志
      
      // 选中新创建的元素
      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // 没有选中文本，检查当前段落
      if (blockElement && ['h1', 'h2', 'h3', 'p', 'div'].includes(blockElement.tagName.toLowerCase())) {
        // 当前在块级元素中，替换当前元素
        const newElement = document.createElement(tagName);
        newElement.innerHTML = blockElement.innerHTML;
        
        // 添加内联样式确保立即生效 - 使用px单位避免累积
        if (tagName === 'h1') {
          newElement.style.fontSize = '32px';
          newElement.style.fontWeight = 'bold';
          newElement.style.margin = '16px 0';
          newElement.style.color = '#1f2937';
          newElement.style.lineHeight = '1.2';
          newElement.style.display = 'block';
        } else if (tagName === 'h2') {
          newElement.style.fontSize = '24px';
          newElement.style.fontWeight = 'bold';
          newElement.style.margin = '14px 0';
          newElement.style.color = '#374151';
          newElement.style.lineHeight = '1.3';
          newElement.style.display = 'block';
        } else if (tagName === 'h3') {
          newElement.style.fontSize = '18px';
          newElement.style.fontWeight = 'bold';
          newElement.style.margin = '12px 0';
          newElement.style.color = '#4b5563';
          newElement.style.lineHeight = '1.4';
          newElement.style.display = 'block';
        } else if (tagName === 'p') {
          newElement.style.fontSize = '16px';
          newElement.style.margin = '12px 0';
          newElement.style.lineHeight = '1.6';
          newElement.style.display = 'block';
        }
        
        blockElement.parentNode?.replaceChild(newElement, blockElement);
        
        console.log('✅ Replaced element:', newElement); // 调试日志
        
        // 将光标放在新元素内
        const newRange = document.createRange();
        newRange.setStart(newElement, 0);
        newRange.setEnd(newElement, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // 创建新的块级元素
        const element = document.createElement(tagName);
        element.innerHTML = '&nbsp;';
        
        // 添加内联样式确保立即生效 - 使用px单位避免累积
        if (tagName === 'h1') {
          element.style.fontSize = '32px';
          element.style.fontWeight = 'bold';
          element.style.margin = '16px 0';
          element.style.color = '#1f2937';
          element.style.lineHeight = '1.2';
          element.style.display = 'block';
        } else if (tagName === 'h2') {
          element.style.fontSize = '24px';
          element.style.fontWeight = 'bold';
          element.style.margin = '14px 0';
          element.style.color = '#374151';
          element.style.lineHeight = '1.3';
          element.style.display = 'block';
        } else if (tagName === 'h3') {
          element.style.fontSize = '18px';
          element.style.fontWeight = 'bold';
          element.style.margin = '12px 0';
          element.style.color = '#4b5563';
          element.style.lineHeight = '1.4';
          element.style.display = 'block';
        } else if (tagName === 'p') {
          element.style.fontSize = '16px';
          element.style.margin = '12px 0';
          element.style.lineHeight = '1.6';
          element.style.display = 'block';
        }
        
        range.insertNode(element);
        
        console.log('✅ Created new element:', element); // 调试日志
        
        // 将光标放在新元素内
        const newRange = document.createRange();
        newRange.setStart(element, 0);
        newRange.setEnd(element, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    
    // 触发输入事件
    handleInput();
  }, [handleInput]);

  // 应用列表格式的现代方法
  const applyListFormat = useCallback((command: string) => {
    console.log('🔧 applyListFormat called with:', command); // 调试日志
    console.log('🔧 applyListFormat - 函数开始执行'); // 调试日志
    
    const selection = window.getSelection();
    console.log('🔧 applyListFormat - selection:', selection); // 调试日志
    console.log('🔧 applyListFormat - rangeCount:', selection?.rangeCount); // 调试日志
    
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ No selection found');
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    const container = range.commonAncestorContainer;
    const blockElement = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container as Element;
    
    console.log('🔧 applyListFormat - selectedText:', selectedText); // 调试日志
    console.log('🔧 applyListFormat - container:', container); // 调试日志
    console.log('🔧 applyListFormat - blockElement:', blockElement); // 调试日志
    
    const listTag = command === 'insertUnorderedList' ? 'ul' : 'ol';
    const otherListTag = command === 'insertUnorderedList' ? 'ol' : 'ul';
    
    console.log('✅ List tag:', listTag, 'Other tag:', otherListTag); // 调试日志
    
    // 检查当前是否已经在列表中
    const currentList = blockElement?.closest('ul, ol');
    const currentListItem = blockElement?.closest('li');
    
    if (currentList && currentListItem) {
      // 当前在列表中
      if (currentList.tagName.toLowerCase() === listTag) {
        // 已经在相同类型的列表中，取消列表格式
        console.log('✅ 当前已在相同类型列表中，取消列表格式');
        
        // 将列表项转换为段落
        const paragraph = document.createElement('p');
        paragraph.innerHTML = currentListItem.innerHTML;
        paragraph.style.setProperty('font-size', '16px', 'important');
        paragraph.style.setProperty('margin', '12px 0', 'important');
        paragraph.style.setProperty('line-height', '1.6', 'important');
        paragraph.style.setProperty('display', 'block', 'important');
        
        // 强制触发重绘
        paragraph.offsetHeight;
        
        // 替换列表项
        currentListItem.parentNode?.replaceChild(paragraph, currentListItem);
        
        // 如果列表为空，删除列表
        if (currentList.children.length === 0) {
          currentList.remove();
        }
        
        // 将光标放在新段落内
        const newRange = document.createRange();
        newRange.setStart(paragraph, 0);
        newRange.setEnd(paragraph, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        console.log('✅ 已取消列表格式，转换为段落');
        
        // 强制更新按钮状态 - 确保列表状态被清除
        setTimeout(() => {
          const currentActiveFormats = new Set(activeFormatting);
          currentActiveFormats.delete('insertUnorderedList');
          currentActiveFormats.delete('insertOrderedList');
          setActiveFormatting(currentActiveFormats);
          
          // 然后调用正常的更新函数
          updateActiveFormatting();
        }, 0);
      } else {
        // 在不同类型的列表中，切换列表类型
        console.log('✅ 切换列表类型');
        
        const newList = document.createElement(listTag);
        newList.innerHTML = currentList.innerHTML;
        currentList.parentNode?.replaceChild(newList, currentList);
        
        console.log('✅ 已切换列表类型');
        
        // 强制更新按钮状态 - 确保正确的列表状态
        setTimeout(() => {
          const currentActiveFormats = new Set(activeFormatting);
          // 清除所有列表状态
          currentActiveFormats.delete('insertUnorderedList');
          currentActiveFormats.delete('insertOrderedList');
          // 添加新的列表状态
          if (listTag === 'ul') {
            currentActiveFormats.add('insertUnorderedList');
          } else {
            currentActiveFormats.add('insertOrderedList');
          }
          setActiveFormatting(currentActiveFormats);
          
          // 然后调用正常的更新函数
          updateActiveFormatting();
        }, 0);
      }
    } else if (selectedText) {
      // 有选中文本，创建列表
      console.log('✅ 有选中文本，创建列表');
      
      const list = document.createElement(listTag);
      const listItem = document.createElement('li');
      listItem.textContent = selectedText;
      
      // 添加内联样式确保立即生效
      listItem.style.setProperty('font-size', '16px', 'important');
      listItem.style.setProperty('line-height', '1.6', 'important');
      listItem.style.setProperty('margin', '0.5em 0', 'important');
      listItem.style.setProperty('display', 'list-item', 'important');
      listItem.style.setProperty('list-style-position', 'outside', 'important');
      listItem.style.setProperty('list-style-type', listTag === 'ul' ? 'disc' : 'decimal', 'important');
      
      // 强制触发重绘
      listItem.offsetHeight;
      
      list.appendChild(listItem);
      
      range.deleteContents();
      range.insertNode(list);
      
      // 选中新创建的列表项
      const newRange = document.createRange();
      newRange.selectNodeContents(listItem);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      console.log('✅ Created list:', list); // 调试日志
      
      // 强制更新按钮状态 - 确保列表状态被添加
      setTimeout(() => {
        const currentActiveFormats = new Set(activeFormatting);
        // 清除所有列表状态
        currentActiveFormats.delete('insertUnorderedList');
        currentActiveFormats.delete('insertOrderedList');
        // 添加新的列表状态
        if (listTag === 'ul') {
          currentActiveFormats.add('insertUnorderedList');
        } else {
          currentActiveFormats.add('insertOrderedList');
        }
        setActiveFormatting(currentActiveFormats);
        
        // 然后调用正常的更新函数
        updateActiveFormatting();
      }, 0);
    } else {
      // 没有选中文本，创建新的列表项
      console.log('✅ 没有选中文本，创建新的列表项');
      
      const list = document.createElement(listTag);
      const listItem = document.createElement('li');
      listItem.innerHTML = '&nbsp;';
      
      // 添加内联样式确保立即生效
      listItem.style.setProperty('font-size', '16px', 'important');
      listItem.style.setProperty('line-height', '1.6', 'important');
      listItem.style.setProperty('margin', '0.5em 0', 'important');
      listItem.style.setProperty('display', 'list-item', 'important');
      listItem.style.setProperty('list-style-position', 'outside', 'important');
      listItem.style.setProperty('list-style-type', listTag === 'ul' ? 'disc' : 'decimal', 'important');
      
      // 强制触发重绘
      listItem.offsetHeight;
      
      list.appendChild(listItem);
      
      range.insertNode(list);
      
      // 将光标放在新列表项内
      const newRange = document.createRange();
      newRange.setStart(listItem, 0);
      newRange.setEnd(listItem, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      console.log('✅ Created new list:', list); // 调试日志
      
      // 强制更新按钮状态 - 确保列表状态被添加
      setTimeout(() => {
        const currentActiveFormats = new Set(activeFormatting);
        // 清除所有列表状态
        currentActiveFormats.delete('insertUnorderedList');
        currentActiveFormats.delete('insertOrderedList');
        // 添加新的列表状态
        if (listTag === 'ul') {
          currentActiveFormats.add('insertUnorderedList');
        } else {
          currentActiveFormats.add('insertOrderedList');
        }
        setActiveFormatting(currentActiveFormats);
        
        // 然后调用正常的更新函数
        updateActiveFormatting();
      }, 0);
    }
    
    // 触发输入事件
    handleInput();
  }, [handleInput]);

  // 应用粗体格式的现代方法（作为对比）
  const applyBoldFormat = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      // 有选中文本，创建粗体元素
      const strong = document.createElement('strong');
      strong.textContent = selectedText;
      range.deleteContents();
      range.insertNode(strong);
      
      // 选中新创建的元素
      const newRange = document.createRange();
      newRange.selectNodeContents(strong);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // 没有选中文本，检查当前元素
      const container = range.commonAncestorContainer;
      const element = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement 
        : container as Element;
      
      if (element && element.tagName.toLowerCase() === 'strong') {
        // 当前在粗体元素中，移除粗体
        const textNode = document.createTextNode(element.textContent || '');
        element.parentNode?.replaceChild(textNode, element);
      } else {
        // 创建新的粗体元素
        const strong = document.createElement('strong');
        strong.innerHTML = '&nbsp;';
        range.insertNode(strong);
        
        // 将光标放在新元素内
        const newRange = document.createRange();
        newRange.setStart(strong, 0);
        newRange.setEnd(strong, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    
    // 触发输入事件
    handleInput();
  }, [handleInput]);

  // 更新活动格式状态
  const updateActiveFormatting = useCallback(() => {
    const activeFormats = new Set<string>();
    
    try {
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
          
          // 检查列表格式
          const currentList = blockElement.closest('ul, ol');
          if (currentList) {
            if (currentList.tagName.toLowerCase() === 'ul') {
              activeFormats.add('insertUnorderedList');
            } else if (currentList.tagName.toLowerCase() === 'ol') {
              activeFormats.add('insertOrderedList');
            }
          }
          
          // 检查内联格式
          if (blockElement.querySelector('strong, b')) {
            activeFormats.add('bold');
          }
          if (blockElement.querySelector('em, i')) {
            activeFormats.add('italic');
          }
          if (blockElement.querySelector('u')) {
            activeFormats.add('underline');
          }
          if (blockElement.querySelector('s, strike')) {
            activeFormats.add('strikeThrough');
          }
        }
      }
    } catch (error) {
      console.warn('Error checking command state:', error);
    }
    
    setActiveFormatting(activeFormats);
  }, []);

  // 安全的链接检测函数
  const findLinkElement = useCallback((container: Node): HTMLAnchorElement | null => {
    if (container.nodeType === Node.TEXT_NODE) {
      return container.parentElement?.closest('a') || null;
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      return (container as Element).closest?.('a') || null;
    }
    return null;
  }, []);

  // 增强的链接检测函数 - 处理各种选择情况
  const findLinkElementEnhanced = useCallback((selection: Selection): HTMLAnchorElement | null => {
    if (!selection || selection.rangeCount === 0) {
      console.log('🔧 findLinkElementEnhanced: 没有选择');
      return null;
    }

    const range = selection.getRangeAt(0);
    console.log('🔧 findLinkElementEnhanced: 检查选择范围');
    console.log('🔧 选择内容:', selection.toString());
    console.log('🔧 选择容器:', range.commonAncestorContainer);
    console.log('🔧 选择容器类型:', range.commonAncestorContainer.nodeType);
    
    // 方法1: 检查选择范围内的所有节点
    // 如果选择容器是文本节点，需要从其父元素开始搜索
    let searchContainer = range.commonAncestorContainer;
    if (searchContainer.nodeType === Node.TEXT_NODE) {
      searchContainer = searchContainer.parentElement || searchContainer;
      console.log('🔧 选择容器是文本节点，使用父元素:', searchContainer);
    }
    
    const walker = document.createTreeWalker(
      searchContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeName.toLowerCase() === 'a') {
            console.log('🔧 找到链接元素:', node);
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let linkNode = walker.nextNode();
    if (linkNode) {
      console.log('🔧 方法1找到链接:', linkNode);
      return linkNode as HTMLAnchorElement;
    }

    // 方法2: 检查选择边界
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    
    console.log('🔧 方法2: 检查选择边界');
    console.log('🔧 开始容器:', startContainer);
    console.log('🔧 结束容器:', endContainer);
    
    const startLink = findLinkElement(startContainer);
    if (startLink) {
      console.log('🔧 方法2在开始容器找到链接:', startLink);
      return startLink;
    }
    
    const endLink = findLinkElement(endContainer);
    if (endLink) {
      console.log('🔧 方法2在结束容器找到链接:', endLink);
      return endLink;
    }

    // 方法3: 检查选择范围内的文本节点
    console.log('🔧 方法3: 检查选择范围内的文本节点');
    const textNodes: Node[] = [];
    const walker2 = document.createTreeWalker(
      searchContainer, // 使用修正后的搜索容器
      NodeFilter.SHOW_TEXT,
      null
    );

    let textNode = walker2.nextNode();
    while (textNode) {
      if (range.intersectsNode(textNode)) {
        textNodes.push(textNode);
        console.log('🔧 找到相交的文本节点:', textNode);
      }
      textNode = walker2.nextNode();
    }

    for (const textNode of textNodes) {
      const link = findLinkElement(textNode);
      if (link) {
        console.log('🔧 方法3在文本节点找到链接:', link);
        return link;
      }
    }

    return null;
  }, [findLinkElement]);

  // 处理文本选择
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setSelectedText('');
      return;
    }
    
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      // 使用增强的链接检测函数
      const linkElement = findLinkElementEnhanced(selection);
      
      if (linkElement) {
        // 选中了链接
        console.log('🔧 选中了链接:', linkElement);
          setSelectedText(selectedText);
      } else {
        // 选中了普通文本，可以创建链接
        setSelectedText(selectedText);
      }
      
      // 更新格式状态
      updateActiveFormatting();
    } else {
      // 没有选中文本
      setSelectedText('');
    }
  }, [updateActiveFormatting, findLinkElementEnhanced]);

  // 处理链接移除
  const handleRemoveLink = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        showToastMessage(t('richEditor.noSelection', '没有选中文本'), 'warning');
        return;
      }
      
      // 使用增强的链接检测函数
      const linkElement = findLinkElementEnhanced(selection);
      
      if (linkElement) {
        console.log('🔧 找到链接元素:', linkElement);
        console.log('🔧 链接URL:', linkElement.href);
        console.log('🔧 链接文本:', linkElement.textContent);
        
        const textContent = linkElement.textContent || '';
        const textNode = document.createTextNode(textContent);
        
        // 替换链接为文本
        linkElement.parentNode?.replaceChild(textNode, linkElement);
        
        // 强制触发重绘，确保样式立即清除
        textNode.parentElement?.offsetHeight;
        
        // 选中文本
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // 延迟检查样式是否已清除
        setTimeout(() => {
          const parentElement = textNode.parentElement;
          if (parentElement) {
            const computedStyle = window.getComputedStyle(parentElement);
            console.log('🔧 移除链接后样式检查:');
            console.log('  - 颜色:', computedStyle.color);
            console.log('  - 下划线:', computedStyle.textDecoration);
            console.log('  - 光标:', computedStyle.cursor);
            console.log('  - 文本内容:', textNode.textContent);
          }
        }, 10);
        
        showToastMessage(t('richEditor.linkRemoved', '链接已移除'), 'success');
        
        // 触发输入事件
        handleInput();
      } else {
        console.log('❌ 未找到链接元素');
        console.log('🔧 选择范围:', selection.toString());
        console.log('🔧 选择容器:', selection.getRangeAt(0).commonAncestorContainer);
        
        showToastMessage(t('richEditor.linkNotFound', '未找到链接'), 'warning');
      }
    } catch (error) {
      console.error('Error removing link:', error);
      showToastMessage(t('richEditor.linkRemoveError', '链接移除失败'), 'error');
    }
  }, [handleInput, showToastMessage, t, findLinkElementEnhanced]);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current && !isInsertingLinkRef.current) {
      console.log('🔧 useEffect - 重置编辑器内容:', value);
      editorRef.current.innerHTML = value || '';
    } else {
      console.log('🔧 useEffect - 跳过重置，原因:', {
        hasEditor: !!editorRef.current,
        isUpdating: isUpdatingRef.current,
        isInsertingLink: isInsertingLinkRef.current
      });
    }
  }, [value]);


  // 执行格式化命令
  const executeCommand = useCallback((command: string, value?: string) => {
    try {
      if (command === 'insertRouteId') {
        setShowRouteIdModal(true);
      } else if (command === 'bold') {
        // 使用现代方法处理粗体
        applyBoldFormat();
      } else if (command === 'insertText') {
        // 处理换行
        if (value === '\n') {
          document.execCommand('insertHTML', false, '<br>');
        } else {
          document.execCommand('insertText', false, value);
        }
      } else if (command === 'formatBlock') {
        // 处理标题和段落格式 - 使用更现代的方法
        console.log('🔧 executeCommand formatBlock called with:', value); // 调试日志
        if (value && ['h1', 'h2', 'h3', 'p'].includes(value)) {
          applyBlockFormat(value);
        }
      } else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
        // 处理列表命令 - 使用现代方法
        console.log('🔧 executeCommand list called with:', command); // 调试日志
        console.log('🔧 executeCommand - 准备调用applyListFormat'); // 调试日志
        applyListFormat(command);
        console.log('🔧 executeCommand - applyListFormat调用完成'); // 调试日志
      } else if (command === 'createLink') {
        // 使用优化的浏览器弹窗方法
        console.log('🔧 使用浏览器弹窗创建链接');
        
        // 保存当前选择范围
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          console.log('🔧 没有选择范围');
          showToastMessage(t('richEditor.pleaseSelectText', '请先选中要添加链接的文本'), 'warning');
          return;
        }
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (!selectedText.trim()) {
          console.log('🔧 没有选中文本');
          showToastMessage(t('richEditor.pleaseSelectText', '请先选中要添加链接的文本'), 'warning');
          return;
        }
        
        console.log('🔧 当前选中文本:', selectedText);
        
        // 使用浏览器弹窗
        const url = prompt(t('richEditor.pleaseEnterUrl', '请输入链接地址'));
        if (url && url.trim()) {
          console.log('🔧 用户输入的链接:', url);
          
          // 重新获取选择范围（防止弹窗后丢失）
          const currentSelection = window.getSelection();
          if (currentSelection && currentSelection.rangeCount > 0) {
            const currentRange = currentSelection.getRangeAt(0);
            const currentText = currentRange.toString();
            
            // 如果选择范围丢失，尝试恢复
            if (!currentText.trim()) {
              console.log('🔧 选择范围丢失，尝试恢复');
              currentSelection.removeAllRanges();
              currentSelection.addRange(range);
            }
          }
          
          const success = document.execCommand('createLink', false, url.trim());
          if (success) {
            console.log('🔧 execCommand 创建链接成功');
            showToastMessage(t('richEditor.linkCreated', '链接创建成功'), 'success');
            
            // 手动应用样式到新创建的链接
            setTimeout(() => {
              const finalSelection = window.getSelection();
              if (finalSelection && finalSelection.rangeCount > 0) {
                const finalRange = finalSelection.getRangeAt(0);
                const linkElement = finalRange.commonAncestorContainer.nodeType === Node.TEXT_NODE 
                  ? finalRange.commonAncestorContainer.parentElement?.closest('a')
                  : (finalRange.commonAncestorContainer as Element).closest('a');
                
                if (linkElement) {
                  console.log('🔧 找到新创建的链接，应用样式');
                  linkElement.style.setProperty('color', '#2563eb', 'important');
                  linkElement.style.setProperty('text-decoration', 'underline', 'important');
                  linkElement.style.setProperty('cursor', 'pointer', 'important');
                  linkElement.target = '_blank';
                  linkElement.rel = 'noopener noreferrer';
                } else {
                  console.log('🔧 未找到新创建的链接元素');
                }
              }
            }, 100);
          } else {
            console.log('🔧 execCommand 创建链接失败');
            showToastMessage(t('richEditor.linkCreationFailed', '链接创建失败'), 'error');
          }
        } else {
          console.log('🔧 用户取消或输入为空');
        }
        return;
      } else if (command === 'unlink') {
        // 使用简单的 execCommand 方法移除链接
        console.log('🔧 使用 execCommand 移除链接');
        
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          console.log('🔧 没有选择范围');
          showToastMessage(t('richEditor.pleaseSelectLink', '请先选中要移除的链接'), 'warning');
          return;
        }
        
        const range = selection.getRangeAt(0);
        console.log('🔧 选择范围内容:', range.toString());
        
        // 检查是否选中了链接
        let linkElement = null;
        if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
          linkElement = range.commonAncestorContainer.parentElement?.closest('a');
        } else {
          linkElement = (range.commonAncestorContainer as Element).closest('a');
        }
        
        if (!linkElement) {
          console.log('🔧 没有找到链接元素');
          showToastMessage(t('richEditor.noLinkFound', '没有找到链接，请选中链接文本'), 'warning');
          return;
        }
        
        console.log('🔧 找到链接元素:', linkElement);
        
        // 选中整个链接元素
        const newRange = document.createRange();
        newRange.selectNodeContents(linkElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        console.log('🔧 已选中整个链接元素，准备移除');
        
        const success = document.execCommand('unlink', false);
        if (success) {
          console.log('🔧 execCommand 移除链接成功');
          
          // 自动执行清除格式功能
          setTimeout(() => {
            console.log('🔧 自动执行清除格式功能');
            const clearFormatSuccess = document.execCommand('removeFormat', false);
            if (clearFormatSuccess) {
              console.log('🔧 清除格式成功');
            } else {
              console.log('🔧 清除格式失败，尝试备用方法');
              // 备用方法：手动清除样式
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const textNode = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
                  ? range.commonAncestorContainer 
                  : range.startContainer;
                
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  const parentElement = textNode.parentElement;
                  if (parentElement) {
                    parentElement.removeAttribute('style');
                    console.log('🔧 备用方法：手动移除样式属性');
                  }
                }
              }
            }
          }, 100);
          
          showToastMessage(t('richEditor.linkRemoved', '链接已移除'), 'success');
        } else {
          console.log('🔧 execCommand 移除链接失败');
          showToastMessage(t('richEditor.linkRemoveError', '链接移除失败'), 'error');
        }
        return;
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
  }, [handleInput, applyBlockFormat, applyListFormat, applyBoldFormat, selectedText, showToastMessage, t, handleRemoveLink]);

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
      // 粘贴清洗，防止外部编辑器样式/包裹标签污染
      const handlePaste = (e: ClipboardEvent) => {
        if (!e.clipboardData) return;
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');
        if (!html) return; // 纯文本保持默认
        e.preventDefault();
        const allowedTags = new Set(['a','strong','b','em','i','u','s','p','br','h1','h2','h3','ul','ol','li','img','video','span']);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const sanitizeNode = (node: Node): Node | null => {
          if (node.nodeType === Node.TEXT_NODE) return node.cloneNode() as Node;
          if (node.nodeType !== Node.ELEMENT_NODE) return null;
          const el = node as HTMLElement;
          const tag = el.tagName.toLowerCase();
          if (!allowedTags.has(tag)) {
            const frag = document.createDocumentFragment();
            el.childNodes.forEach(child => {
              const clean = sanitizeNode(child);
              if (clean) frag.appendChild(clean);
            });
            return frag;
          }
          const cleanEl = document.createElement(tag);
          if (tag === 'a') {
            const href = el.getAttribute('href') || '#';
            cleanEl.setAttribute('href', href);
            cleanEl.setAttribute('target', '_blank');
            cleanEl.setAttribute('rel', 'noopener noreferrer');
          } else if (tag === 'img') {
            const src = el.getAttribute('src');
            if (src) cleanEl.setAttribute('src', src);
          } else if (tag === 'video') {
            const src = el.getAttribute('src');
            if (src) cleanEl.setAttribute('src', src);
            (cleanEl as HTMLVideoElement).controls = true;
          } else if (tag === 'span' && el.classList.contains('route-id-marker')) {
            cleanEl.className = 'route-id-marker';
            const rid = el.getAttribute('data-route-id');
            if (rid) cleanEl.setAttribute('data-route-id', rid);
          }
          el.childNodes.forEach(child => {
            const cleanChild = sanitizeNode(child);
            if (cleanChild) cleanEl.appendChild(cleanChild);
          });
          return cleanEl;
        };

        const bodyFrag = document.createDocumentFragment();
        const container = doc.body;
        if (container && container.childNodes.length > 0) {
          container.childNodes.forEach(node => {
            const clean = sanitizeNode(node);
            if (clean) bodyFrag.appendChild(clean);
          });
        } else if (text) {
          bodyFrag.appendChild(document.createTextNode(text));
        }

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(bodyFrag);
          range.collapse(false);
        }
        handleInput();
      };
      editor.addEventListener('paste', handlePaste);
      
      // 点击其他地方时的处理
      const handleClickOutside = (e: MouseEvent) => {
        if (!editor.contains(e.target as Node)) {
          // 可以在这里添加其他点击外部时的处理逻辑
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        editor.removeEventListener('input', handleInput);
        editor.removeEventListener('mouseup', handleSelection);
        editor.removeEventListener('keyup', handleSelection);
        editor.removeEventListener('keydown', handleKeyDown);
        editor.removeEventListener('focus', updateActiveFormatting);
        editor.removeEventListener('paste', handlePaste);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [handleInput, handleSelection, handleKeyDown, updateActiveFormatting]);


  // 处理链接插入
  const handleInsertLink = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        showToastMessage(t('richEditor.noSelection', '没有选中文本'), 'warning');
        return;
      }

      const range = selection.getRangeAt(0);
      const currentSelectedText = range.toString().trim() || selectedText.trim();
      if (!currentSelectedText) {
        showToastMessage(t('richEditor.pleaseSelectText', '请先选中要添加链接的文本'), 'warning');
        return;
      }

      const url = prompt(t('richEditor.pleaseEnterUrl', '请输入链接地址'))?.trim();
      if (!url) {
        return;
      }

      // 创建链接节点
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.textContent = currentSelectedText;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';

      // 替换所选内容
      range.deleteContents();
      range.insertNode(linkElement);

      // 选中新链接
      const newRange = document.createRange();
      newRange.selectNodeContents(linkElement);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // 触发同步
      setTimeout(() => { handleInput(); }, 50);
      showToastMessage(t('richEditor.linkCreated', '链接创建成功'), 'success');
    } catch (error) {
      console.error('link insert error:', error);
      showToastMessage(t('richEditor.linkCreationFailed', '链接创建失败'), 'error');
    }
  }, [selectedText, handleInput, showToastMessage, t]);
  
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
    
    // 链接
    { command: 'createLink', icon: '🔗', title: t('richEditor.createLink', '插入链接') },
    { command: 'unlink', icon: '🔓', title: t('richEditor.removeLink', '移除链接') },
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

  // 规范化高度值
  const maxHeightStr = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  // 预留工具栏高度（约 64-100px），这里取 80px 以保证空间
  const editorAreaMaxHeight = `calc(${maxHeightStr} - 80px)`;

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white relative flex flex-col ${className}`} style={{ maxHeight: maxHeightStr }}>
      {/* 工具栏 - 固定在顶部 */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap flex-shrink-0 z-10 sticky top-0">
        {/* 格式化按钮 */}
        {toolbarButtons.map((btn, idx) => 
          btn.type === 'separator' ? (
            <div key={idx} className="w-px h-6 bg-gray-300 mx-1"></div>
          ) : (
            <button
              key={`${btn.command}-${btn.value || 'default'}`}
              type="button"
              onClick={() => executeCommand(btn.command!, btn.value)}
              className={`px-2 py-1 min-w-[28px] border rounded text-sm transition-colors ${
                activeFormatting.has(btn.command!) || 
                (btn.value && activeFormatting.has(`${btn.command}-${btn.value}`)) ||
                (btn.command === 'formatBlock' && btn.value && activeFormatting.has(`formatBlock-${btn.value}`))
                  ? 'border-[#C2A87A] bg-[#C2A87A] text-white cursor-pointer' 
                  : 'border-gray-300 bg-white hover:bg-gray-100 cursor-pointer'
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

      {/* 编辑区域 - 可滚动 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="px-4 py-3 outline-none overflow-y-auto focus:ring-2 focus:ring-[#C2A87A] focus:ring-inset flex-1"
        style={{ minHeight, maxHeight: editorAreaMaxHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx>{`
        /* 重置所有可能的样式冲突 */
        [contentEditable] * {
          box-sizing: border-box;
        }
        
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contentEditable] {
          word-wrap: break-word;
          overflow-wrap: break-word;
          /* 重置可能影响链接样式的属性 */
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }
        [contentEditable] h1 {
          font-size: 32px !important;
          font-weight: bold !important;
          margin: 16px 0 !important;
          color: #1f2937 !important;
          line-height: 1.2 !important;
          display: block !important;
        }
        [contentEditable] h2 {
          font-size: 24px !important;
          font-weight: bold !important;
          margin: 14px 0 !important;
          color: #374151 !important;
          line-height: 1.3 !important;
          display: block !important;
        }
        [contentEditable] h3 {
          font-size: 18px !important;
          font-weight: bold !important;
          margin: 12px 0 !important;
          color: #4b5563 !important;
          line-height: 1.4 !important;
          display: block !important;
        }
        [contentEditable] p {
          font-size: 16px !important;
          margin: 12px 0 !important;
          line-height: 1.6 !important;
          display: block !important;
        }
        /* 列表样式 - 最高优先级 */
        [contentEditable] ul {
          margin: 1em 0 !important;
          padding-left: 2em !important;
          list-style-type: disc !important;
          font-size: 16px !important;
          font-family: inherit !important;
        }
        [contentEditable] ol {
          margin: 1em 0 !important;
          padding-left: 2em !important;
          list-style-type: decimal !important;
          font-size: 16px !important;
          font-family: inherit !important;
        }
        [contentEditable] li {
          margin: 0.5em 0 !important;
          display: list-item !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          list-style-position: outside !important;
          font-family: inherit !important;
          color: inherit !important;
        }
        [contentEditable] ul li {
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        [contentEditable] ol li {
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        /* 确保列表标记可见 */
        [contentEditable] ul li::marker {
          color: #374151 !important;
          font-weight: bold !important;
          font-size: 16px !important;
        }
        [contentEditable] ol li::marker {
          color: #374151 !important;
          font-weight: bold !important;
          font-size: 16px !important;
        }
        /* 强制覆盖任何可能的样式冲突 */
        [contentEditable] ul li {
          font-size: 16px !important;
          line-height: 1.6 !important;
          margin: 0.5em 0 !important;
          display: list-item !important;
          list-style-position: outside !important;
          list-style-type: disc !important;
        }
        [contentEditable] ol li {
          font-size: 16px !important;
          line-height: 1.6 !important;
          margin: 0.5em 0 !important;
          display: list-item !important;
          list-style-position: outside !important;
          list-style-type: decimal !important;
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
        /* 链接样式 - 最高优先级 */
        [contentEditable] a,
        [contentEditable] a:link,
        [contentEditable] a:focus,
        [contentEditable] a:active {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          background: none !important;
          outline: none !important;
          font-weight: inherit !important;
          font-size: inherit !important;
          line-height: inherit !important;
          display: inline !important;
          font-family: inherit !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        [contentEditable] a:hover {
          color: #1d4ed8 !important;
          text-decoration: none !important;
          background-color: rgba(37, 99, 235, 0.1) !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
        }
        /* 访问状态 - 强制实线 */
        [contentEditable] a:visited,
        [contentEditable] a:visited * {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          border-bottom: none !important;
          text-underline-offset: auto !important;
        }
        [contentEditable] a:focus {
          outline: 2px solid #2563eb !important;
          outline-offset: 2px !important;
        }
        /* 强制覆盖任何可能的样式冲突 */
        [contentEditable] a * {
          color: inherit !important;
          text-decoration: inherit !important;
        }
        /* 确保链接样式优先级 - 使用更具体的选择器 */
        [contentEditable] a[href] {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          cursor: pointer !important;
          display: inline !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          background: none !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /* 最高优先级 - 直接针对所有链接 */
        [contentEditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          cursor: pointer !important;
          display: inline !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          background: none !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          transition: all 0.2s ease !important;
        }
        /* 强制覆盖任何可能的全局样式 - 使用最高优先级 */
        [contentEditable] a,
        [contentEditable] a *,
        [contentEditable] a:link,
        [contentEditable] a:visited,
        [contentEditable] a:focus,
        [contentEditable] a:active,
        [contentEditable] a:hover {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          cursor: pointer !important;
          background: none !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: inline !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        /* 确保链接在所有情况下都显示正确 - 使用属性选择器 */
        [contentEditable] a[href] {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          display: inline !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          background: none !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /* 最高优先级 - 直接覆盖所有可能的样式 */
        [contentEditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          display: inline !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          background: none !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          transition: all 0.2s ease !important;
        }
        /* 悬停效果 */
        [contentEditable] a:hover {
          color: #1d4ed8 !important;
          text-decoration: none !important;
          background-color: rgba(37, 99, 235, 0.1) !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
        }
        /* 访问状态 - 强制实线 */
        [contentEditable] a:visited,
        [contentEditable] a:visited * {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
          text-decoration-style: solid !important;
          text-decoration-thickness: 1px !important;
          border-bottom: none !important;
          text-underline-offset: auto !important;
        }
        /* 焦点状态 */
        [contentEditable] a:focus {
          outline: 2px solid #2563eb !important;
          outline-offset: 2px !important;
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



      {/* 路由标识插入模态框 */}
      {showRouteIdModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slideIn">
            {/* 模态框头部 */}
            <div className="px-6 py-5 border-b border-sage-200 bg-gradient-to-r from-sage-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C2A87A] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sage-800">{t('richEditor.createLink', '插入链接')}</h3>
                  <p className="text-sm text-sage-600 mt-1">{t('richEditor.createLinkDesc', '为选中的文本添加链接')}</p>
                </div>
              </div>
          <button
            type="button"
              onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label={t('close', '关闭')}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
          </button>
        </div>

            {/* 模态框内容 */}
            <div className="px-6 py-6 space-y-6">
              {/* 链接地址输入 */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-sage-700">
                  {t('richEditor.linkUrl', '链接地址')} <span className="text-red-500">*</span>
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder={t('richEditor.pleaseEnterUrl', '请输入链接地址，如：https://example.com')}
                    className="w-full pl-10 pr-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-[#C2A87A] focus:border-[#C2A87A] text-base transition-all duration-200 hover:border-sage-400"
                autoFocus
              />
            </div>
                {linkUrl && (
                  <div className="flex items-center gap-2 text-xs text-sage-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('richEditor.urlValid', '链接地址格式正确')}</span>
                  </div>
                )}
              </div>

              {/* 链接文本输入 */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-sage-700">
                {t('richEditor.linkText', '链接文本')}
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
              <input
                type="text"
                value={linkText || selectedText}
                onChange={(e) => setLinkText(e.target.value)}
                    placeholder={t('richEditor.linkTextPlaceholder', '链接显示的文本（可选）')}
                    className="w-full pl-10 pr-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-[#C2A87A] focus:border-[#C2A87A] text-base transition-all duration-200 hover:border-sage-400"
              />
            </div>
                {selectedText && (
                  <div className="flex items-center gap-2 text-xs text-sage-600">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{t('richEditor.selectedText', '已选中文本')}: "{selectedText}"</span>
          </div>
                )}
              </div>

              {/* 预览区域 */}
              {(linkUrl || linkText || selectedText) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sage-700">
                    {t('richEditor.preview', '预览')}
                  </label>
                  <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
                    <div className="text-sm text-sage-600 mb-2">{t('richEditor.previewDesc', '链接预览')}:</div>
                    <a 
                      href={linkUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#C2A87A] hover:text-[#a88a5c] underline transition-colors"
                    >
                      {linkText || selectedText || t('richEditor.clickHere', '点击这里')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 模态框底部按钮 */}
            <div className="px-6 py-4 border-t border-sage-200 bg-gradient-to-r from-sage-50 to-white flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowLinkModal(false);
                setLinkUrl('');
                setLinkText('');
              }}
                className="px-6 py-2.5 text-base font-semibold border border-sage-300 text-sage-700 rounded-xl hover:bg-sage-100 hover:border-sage-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              {t('cancel', '取消')}
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className={`px-6 py-2.5 text-base font-semibold rounded-xl transition-all duration-200 shadow-lg cursor-pointer ${
                  linkUrl.trim() 
                    ? 'bg-[#C2A87A] text-white hover:bg-[#a88a5c] hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
              {t('confirm', '确认')}
                </div>
            </button>
            </div>
          </div>
        </div>
      )}

      {/* 路由标识模态框 */}
      {showRouteIdModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full max-w-md mx-4">
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

