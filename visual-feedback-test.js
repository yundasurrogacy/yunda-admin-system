// 富文本编辑器视觉反馈测试脚本
// 在浏览器控制台中运行此脚本来测试视觉反馈

console.log('🎨 富文本编辑器视觉反馈测试开始...');

// 测试1: 检查链接样式是否生效
function testLinkStyles() {
  console.log('\n📝 测试1: 检查链接样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 创建测试链接
  const testLink = document.createElement('a');
  testLink.href = 'https://example.com';
  testLink.textContent = '测试链接';
  testLink.target = '_blank';
  testLink.rel = 'noopener noreferrer';
  
  editor.appendChild(testLink);
  
  // 检查样式
  const computedStyle = window.getComputedStyle(testLink);
  console.log('✅ 链接颜色:', computedStyle.color);
  console.log('✅ 文本装饰:', computedStyle.textDecoration);
  console.log('✅ 字体粗细:', computedStyle.fontWeight);
  console.log('✅ 边框底部:', computedStyle.borderBottom);
  console.log('✅ 鼠标指针:', computedStyle.cursor);
  
  // 检查是否是期望的颜色
  const expectedColor = 'rgb(194, 168, 122)'; // #C2A87A
  const actualColor = computedStyle.color;
  
  if (actualColor === expectedColor) {
    console.log('✅ 链接颜色正确');
    return true;
  } else {
    console.log('❌ 链接颜色不正确，期望:', expectedColor, '实际:', actualColor);
    return false;
  }
}

// 测试2: 检查链接插入后的视觉效果
function testLinkInsertionVisual() {
  console.log('\n➕ 测试2: 检查链接插入后的视觉效果');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  const testText = document.createTextNode('这是一个测试文本');
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
  linkElement.href = 'https://test.com';
  linkElement.textContent = '这是一个测试文本';
  linkElement.target = '_blank';
  linkElement.rel = 'noopener noreferrer';
  
  // 替换文本
  range.deleteContents();
  range.insertNode(linkElement);
  
  // 选中链接
  const newRange = document.createRange();
  newRange.selectNodeContents(linkElement);
  selection.removeAllRanges();
  selection.addRange(newRange);
  
  // 强制重绘
  linkElement.offsetHeight;
  
  console.log('✅ 链接创建成功');
  console.log('✅ 链接文本:', linkElement.textContent);
  console.log('✅ 链接地址:', linkElement.href);
  
  // 检查样式
  const computedStyle = window.getComputedStyle(linkElement);
  console.log('✅ 链接颜色:', computedStyle.color);
  console.log('✅ 文本装饰:', computedStyle.textDecoration);
  console.log('✅ 字体粗细:', computedStyle.fontWeight);
  
  return true;
}

// 测试3: 检查链接检测功能
function testLinkDetection() {
  console.log('\n🔍 测试3: 检查链接检测功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  const links = editor.querySelectorAll('a');
  console.log('✅ 找到链接数量:', links.length);
  
  if (links.length > 0) {
    const link = links[0];
    console.log('✅ 第一个链接:', link.textContent);
    console.log('✅ 链接地址:', link.href);
    
    // 模拟选择链接
    const range = document.createRange();
    range.selectNodeContents(link);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    console.log('✅ 选中文本:', selection.toString());
    
    // 检查是否能检测到链接
    const container = range.commonAncestorContainer;
    const detectedLink = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement?.closest('a')
      : (container as Element).closest('a');
    
    console.log('✅ 检测到链接:', !!detectedLink);
    
    return !!detectedLink;
  }
  
  return false;
}

// 测试4: 检查工具栏按钮状态
function testToolbarButtonState() {
  console.log('\n🛠️ 测试4: 检查工具栏按钮状态');
  
  const unlinkButton = document.querySelector('button[title*="移除链接"]');
  if (!unlinkButton) {
    console.log('❌ 未找到移除链接按钮');
    return false;
  }
  
  console.log('✅ 移除链接按钮存在');
  console.log('✅ 按钮禁用状态:', unlinkButton.disabled);
  console.log('✅ 按钮类名:', unlinkButton.className);
  
  // 检查按钮样式
  const computedStyle = window.getComputedStyle(unlinkButton);
  console.log('✅ 按钮背景色:', computedStyle.backgroundColor);
  console.log('✅ 按钮文字颜色:', computedStyle.color);
  console.log('✅ 按钮边框:', computedStyle.border);
  
  return true;
}

// 测试5: 检查CSS样式优先级
function testCSSPriority() {
  console.log('\n🎯 测试5: 检查CSS样式优先级');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  const links = editor.querySelectorAll('a');
  if (links.length === 0) {
    console.log('❌ 没有找到链接元素');
    return false;
  }
  
  const link = links[0];
  const computedStyle = window.getComputedStyle(link);
  
  console.log('✅ 计算后的样式:');
  console.log('  - 颜色:', computedStyle.color);
  console.log('  - 文本装饰:', computedStyle.textDecoration);
  console.log('  - 字体粗细:', computedStyle.fontWeight);
  console.log('  - 边框底部:', computedStyle.borderBottom);
  
  // 检查是否有!important规则
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      const rules = styleSheet.cssRules || styleSheet.rules;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectorText && rule.selectorText.includes('a')) {
          console.log('✅ 找到链接CSS规则:', rule.selectorText);
          console.log('✅ CSS规则内容:', rule.style.cssText);
        }
      }
    } catch (e) {
      console.log('⚠️ 无法访问样式表:', e.message);
    }
  }
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    styles: testLinkStyles(),
    insertion: testLinkInsertionVisual(),
    detection: testLinkDetection(),
    toolbar: testToolbarButtonState(),
    cssPriority: testCSSPriority()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 链接样式测试:', results.styles ? '通过' : '失败');
  console.log('✅ 链接插入测试:', results.insertion ? '通过' : '失败');
  console.log('✅ 链接检测测试:', results.detection ? '通过' : '失败');
  console.log('✅ 工具栏状态测试:', results.toolbar ? '通过' : '失败');
  console.log('✅ CSS优先级测试:', results.cssPriority ? '通过' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！视觉反馈正常工作。');
  } else {
    console.log('⚠️ 部分测试失败，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 使用说明:');
console.log('1. 在富文本编辑器中输入一些文本');
console.log('2. 选中文本，点击链接按钮或按 Ctrl+K');
console.log('3. 输入URL，点击确定');
console.log('4. 检查链接是否正确显示为金色文字，带下划线');
console.log('5. 检查链接是否可以被选中和移除');
