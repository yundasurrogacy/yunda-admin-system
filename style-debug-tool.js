// 富文本编辑器样式调试工具
// 在浏览器控制台中运行此脚本来调试样式问题

console.log('🔍 富文本编辑器样式调试工具启动...');

// 调试函数：检查链接样式
function debugLinkStyles() {
  console.log('\n📝 调试链接样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  const links = editor.querySelectorAll('a');
  console.log('✅ 找到链接数量:', links.length);
  
  links.forEach((link, index) => {
    console.log(`\n🔗 链接 ${index + 1}:`);
    console.log('  - 文本内容:', link.textContent);
    console.log('  - href:', link.href);
    
    // 检查内联样式
    console.log('  - 内联样式:', link.style.cssText);
    
    // 检查计算后的样式
    const computedStyle = window.getComputedStyle(link);
    console.log('  - 计算后的颜色:', computedStyle.color);
    console.log('  - 计算后的文本装饰:', computedStyle.textDecoration);
    console.log('  - 计算后的字体粗细:', computedStyle.fontWeight);
    console.log('  - 计算后的边框底部:', computedStyle.borderBottom);
    
    // 检查CSS规则
    const rules = getCSSRulesForElement(link);
    console.log('  - 应用的CSS规则:', rules);
  });
}

// 获取元素应用的CSS规则
function getCSSRulesForElement(element) {
  const rules = [];
  const sheets = document.styleSheets;
  
  for (let i = 0; i < sheets.length; i++) {
    try {
      const sheet = sheets[i];
      const cssRules = sheet.cssRules || sheet.rules;
      
      for (let j = 0; j < cssRules.length; j++) {
        const rule = cssRules[j];
        if (rule.style && element.matches(rule.selectorText)) {
          rules.push({
            selector: rule.selectorText,
            styles: rule.style.cssText
          });
        }
      }
    } catch (e) {
      // 跨域样式表可能无法访问
      console.log('⚠️ 无法访问样式表:', e.message);
    }
  }
  
  return rules;
}

// 强制应用链接样式
function forceApplyLinkStyles() {
  console.log('\n🔧 强制应用链接样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return;
  
  const links = editor.querySelectorAll('a');
  console.log('✅ 找到链接数量:', links.length);
  
  links.forEach((link, index) => {
    console.log(`🔗 强制应用样式到链接 ${index + 1}`);
    
    // 强制应用样式
    link.style.cssText = `
      color: #C2A87A !important;
      text-decoration: underline !important;
      font-weight: 500 !important;
      border-bottom: 1px solid #C2A87A !important;
      cursor: pointer !important;
      display: inline !important;
      background: none !important;
    `;
    
    // 触发重绘
    link.offsetHeight;
    
    console.log('✅ 样式已强制应用');
  });
}

// 检查样式冲突
function checkStyleConflicts() {
  console.log('\n⚠️ 检查样式冲突');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return;
  
  // 检查全局样式
  const body = document.body;
  const bodyStyle = window.getComputedStyle(body);
  console.log('📄 Body样式:');
  console.log('  - 颜色:', bodyStyle.color);
  console.log('  - 字体:', bodyStyle.fontFamily);
  console.log('  - 字体大小:', bodyStyle.fontSize);
  
  // 检查编辑器样式
  const editorStyle = window.getComputedStyle(editor);
  console.log('📝 编辑器样式:');
  console.log('  - 颜色:', editorStyle.color);
  console.log('  - 字体:', editorStyle.fontFamily);
  console.log('  - 字体大小:', editorStyle.fontSize);
  
  // 检查是否有冲突
  if (bodyStyle.color === editorStyle.color) {
    console.log('✅ 编辑器继承了Body的颜色');
  } else {
    console.log('⚠️ 编辑器颜色与Body不同');
  }
}

// 创建测试链接
function createTestLink() {
  console.log('\n➕ 创建测试链接');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 创建测试文本
  const testText = document.createTextNode('这是一个测试链接');
  editor.appendChild(testText);
  
  // 选择文本
  const range = document.createRange();
  range.selectNode(testText);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 创建链接
  const linkElement = document.createElement('a');
  linkElement.href = 'https://example.com';
  linkElement.textContent = '这是一个测试链接';
  linkElement.target = '_blank';
  linkElement.rel = 'noopener noreferrer';
  
  // 强制应用样式
  linkElement.style.cssText = `
    color: #C2A87A !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
    border-bottom: 1px solid #C2A87A !important;
    cursor: pointer !important;
    display: inline !important;
    background: none !important;
  `;
  
  // 替换文本
  range.deleteContents();
  range.insertNode(linkElement);
  
  // 选中链接
  const newRange = document.createRange();
  newRange.selectNodeContents(linkElement);
  selection.removeAllRanges();
  selection.addRange(newRange);
  
  console.log('✅ 测试链接创建成功');
  
  // 检查样式
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(linkElement);
    console.log('✅ 链接样式:');
    console.log('  - 颜色:', computedStyle.color);
    console.log('  - 文本装饰:', computedStyle.textDecoration);
    console.log('  - 字体粗细:', computedStyle.fontWeight);
  }, 100);
}

// 运行所有调试
function runAllDebug() {
  console.log('🚀 开始运行所有调试...\n');
  
  debugLinkStyles();
  checkStyleConflicts();
  createTestLink();
  
  console.log('\n💡 调试完成！');
  console.log('如果链接样式仍然有问题，请尝试运行 forceApplyLinkStyles() 强制应用样式');
}

// 自动运行调试
runAllDebug();

// 导出调试函数到全局
window.debugLinkStyles = debugLinkStyles;
window.forceApplyLinkStyles = forceApplyLinkStyles;
window.checkStyleConflicts = checkStyleConflicts;
window.createTestLink = createTestLink;

console.log('\n🛠️ 可用的调试函数:');
console.log('- debugLinkStyles() - 调试链接样式');
console.log('- forceApplyLinkStyles() - 强制应用链接样式');
console.log('- checkStyleConflicts() - 检查样式冲突');
console.log('- createTestLink() - 创建测试链接');
