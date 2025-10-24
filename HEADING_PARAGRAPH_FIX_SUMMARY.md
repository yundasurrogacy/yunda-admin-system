# 富文本编辑器标题和段落功能修复总结

## 问题诊断 🔍

标题和段落功能一直没有解决的根本原因是：

1. **`updateActiveFormatting`函数问题**: 仍然依赖`document.queryCommandState`，但现代实现不使用`execCommand`
2. **函数依赖循环**: `handleInput`依赖`updateActiveFormatting`，但定义顺序错误
3. **缺少调试信息**: 无法确定函数是否被正确调用

## 修复方案 ✅

### 1. 修复函数依赖问题
```typescript
// 处理内容变化
const handleInput = useCallback(() => {
  if (editorRef.current && !isUpdatingRef.current) {
    isUpdatingRef.current = true;
    onChange(editorRef.current.innerHTML);
    
    // 延迟更新活动格式状态，避免循环依赖
    setTimeout(() => {
      updateActiveFormatting();
      isUpdatingRef.current = false;
    }, 0);
  }
}, [onChange]);
```

### 2. 添加调试日志
```typescript
// 在executeCommand中添加调试日志
console.log('🔧 executeCommand formatBlock called with:', value);

// 在applyBlockFormat中添加调试日志
console.log('🔧 applyBlockFormat called with:', tagName);
console.log('✅ Selected text:', selectedText);
console.log('✅ Created element:', element);
```

### 3. 现代实现方法
```typescript
const applyBlockFormat = useCallback((tagName: string) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  
  if (selectedText) {
    // 有选中文本，直接创建标题元素
    const element = document.createElement(tagName);
    element.textContent = selectedText;
    range.deleteContents();
    range.insertNode(element);
    
    // 选中新创建的元素
    const newRange = document.createRange();
    newRange.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // 智能处理无选中文本的情况
    // ...
  }
  
  handleInput();
}, [handleInput]);
```

## 测试方法 🧪

### 1. 运行简单测试脚本
在浏览器控制台运行 `simple-heading-test.js`：
```javascript
// 测试标题功能
function testHeadingFunction() {
  const editor = document.querySelector('[contentEditable]');
  editor.innerHTML = '测试标题功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 点击H1按钮
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    h1Button.click();
    
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1标题创建成功！');
      } else {
        console.log('❌ H1标题创建失败');
      }
    }, 200);
  }
}
```

### 2. 检查调试日志
在浏览器控制台中查看以下日志：
- `🔧 executeCommand formatBlock called with: h1`
- `🔧 applyBlockFormat called with: h1`
- `✅ Selected text: 测试标题功能`
- `✅ Created element: <h1>测试标题功能</h1>`

## 预期结果 🎯

修复后，标题和段落功能应该：

1. **选中文本应用标题**: 选中文本后点击H1/H2/H3按钮，文本会立即应用标题格式
2. **当前段落应用标题**: 在段落中点击标题按钮，整个段落会应用标题格式
3. **创建新标题**: 在没有文本的情况下点击标题按钮，会创建新的标题元素
4. **标题切换**: 在不同标题格式之间切换
5. **段落功能**: 段落按钮应该正常工作

## 如果仍然不工作 ⚠️

如果标题功能仍然不工作，请检查：

1. **按钮配置**: 确认工具栏按钮正确配置了`command: 'formatBlock'`和`value: 'h1'`
2. **函数调用**: 确认`executeCommand`函数被正确调用
3. **JavaScript错误**: 检查浏览器控制台是否有JavaScript错误
4. **选择状态**: 确认文本选择状态正确

## 下一步 🔄

1. 运行测试脚本验证功能
2. 检查调试日志确认函数调用
3. 如果仍有问题，提供具体的错误信息
4. 移除调试日志，优化性能
