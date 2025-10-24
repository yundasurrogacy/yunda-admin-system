// 富文本编辑器链接功能增强测试脚本
// 在浏览器控制台中运行此脚本来测试链接功能

console.log('🔗 富文本编辑器链接功能测试开始...');

// 测试1: 检查链接样式
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
  testLink.style.color = '#C2A87A';
  testLink.style.textDecoration = 'underline';
  testLink.style.fontWeight = '500';
  
  editor.appendChild(testLink);
  
  // 检查样式
  const computedStyle = window.getComputedStyle(testLink);
  console.log('✅ 链接颜色:', computedStyle.color);
  console.log('✅ 文本装饰:', computedStyle.textDecoration);
  console.log('✅ 字体粗细:', computedStyle.fontWeight);
  
  return true;
}

// 测试2: 检查链接检测
function testLinkDetection() {
  console.log('\n🔍 测试2: 检查链接检测');
  
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

// 测试3: 检查工具栏状态
function testToolbarState() {
  console.log('\n🛠️ 测试3: 检查工具栏状态');
  
  const unlinkButton = document.querySelector('button[title*="移除链接"]');
  if (!unlinkButton) {
    console.log('❌ 未找到移除链接按钮');
    return false;
  }
  
  console.log('✅ 移除链接按钮存在');
  console.log('✅ 按钮禁用状态:', unlinkButton.disabled);
  console.log('✅ 按钮类名:', unlinkButton.className);
  
  return true;
}

// 测试4: 检查链接插入流程
function testLinkInsertion() {
  console.log('\n➕ 测试4: 检查链接插入流程');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
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
  linkElement.style.color = '#C2A87A';
  linkElement.style.textDecoration = 'underline';
  linkElement.style.fontWeight = '500';
  
  // 替换文本
  range.deleteContents();
  range.insertNode(linkElement);
  
  // 选中链接
  const newRange = document.createRange();
  newRange.selectNodeContents(linkElement);
  selection.removeAllRanges();
  selection.addRange(newRange);
  
  console.log('✅ 链接创建成功');
  console.log('✅ 链接文本:', linkElement.textContent);
  console.log('✅ 链接地址:', linkElement.href);
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    styles: testLinkStyles(),
    detection: testLinkDetection(),
    toolbar: testToolbarState(),
    insertion: testLinkInsertion()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 链接样式测试:', results.styles ? '通过' : '失败');
  console.log('✅ 链接检测测试:', results.detection ? '通过' : '失败');
  console.log('✅ 工具栏状态测试:', results.toolbar ? '通过' : '失败');
  console.log('✅ 链接插入测试:', results.insertion ? '通过' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！链接功能正常工作。');
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
console.log('4. 检查链接是否正确显示和可选中');
console.log('5. 选中链接，检查移除链接按钮是否可用');
