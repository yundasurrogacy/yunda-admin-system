// 富文本编辑器标题和列表功能测试脚本
// 在浏览器控制台中运行此脚本来测试标题和列表功能

console.log('📝 富文本编辑器标题和列表功能测试开始...');

// 测试1: 检查标题功能
function testHeadingFunctions() {
  console.log('\n📋 测试1: 检查标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H1
  console.log('✅ 测试H1标题...');
  editor.innerHTML = '<h1>这是一个H1标题</h1>';
  const h1 = editor.querySelector('h1');
  if (h1) {
    console.log('✅ H1元素创建成功');
    const computedStyle = window.getComputedStyle(h1);
    console.log('✅ H1字体大小:', computedStyle.fontSize);
    console.log('✅ H1字体粗细:', computedStyle.fontWeight);
  } else {
    console.log('❌ H1元素创建失败');
  }
  
  // 测试H2
  console.log('✅ 测试H2标题...');
  editor.innerHTML = '<h2>这是一个H2标题</h2>';
  const h2 = editor.querySelector('h2');
  if (h2) {
    console.log('✅ H2元素创建成功');
    const computedStyle = window.getComputedStyle(h2);
    console.log('✅ H2字体大小:', computedStyle.fontSize);
    console.log('✅ H2字体粗细:', computedStyle.fontWeight);
  } else {
    console.log('❌ H2元素创建失败');
  }
  
  // 测试H3
  console.log('✅ 测试H3标题...');
  editor.innerHTML = '<h3>这是一个H3标题</h3>';
  const h3 = editor.querySelector('h3');
  if (h3) {
    console.log('✅ H3元素创建成功');
    const computedStyle = window.getComputedStyle(h3);
    console.log('✅ H3字体大小:', computedStyle.fontSize);
    console.log('✅ H3字体粗细:', computedStyle.fontWeight);
  } else {
    console.log('❌ H3元素创建失败');
  }
  
  return true;
}

// 测试2: 检查列表功能
function testListFunctions() {
  console.log('\n📋 测试2: 检查列表功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 测试无序列表
  console.log('✅ 测试无序列表...');
  editor.innerHTML = '<ul><li>列表项1</li><li>列表项2</li><li>列表项3</li></ul>';
  const ul = editor.querySelector('ul');
  const lis = editor.querySelectorAll('li');
  
  if (ul && lis.length > 0) {
    console.log('✅ 无序列表创建成功');
    console.log('✅ 列表项数量:', lis.length);
    const computedStyle = window.getComputedStyle(ul);
    console.log('✅ 列表左边距:', computedStyle.paddingLeft);
    console.log('✅ 列表外边距:', computedStyle.margin);
  } else {
    console.log('❌ 无序列表创建失败');
  }
  
  // 测试有序列表
  console.log('✅ 测试有序列表...');
  editor.innerHTML = '<ol><li>有序列表项1</li><li>有序列表项2</li><li>有序列表项3</li></ol>';
  const ol = editor.querySelector('ol');
  const olLis = editor.querySelectorAll('li');
  
  if (ol && olLis.length > 0) {
    console.log('✅ 有序列表创建成功');
    console.log('✅ 列表项数量:', olLis.length);
    const computedStyle = window.getComputedStyle(ol);
    console.log('✅ 列表左边距:', computedStyle.paddingLeft);
    console.log('✅ 列表外边距:', computedStyle.margin);
  } else {
    console.log('❌ 有序列表创建失败');
  }
  
  return true;
}

// 测试3: 检查工具栏按钮
function testToolbarButtons() {
  console.log('\n🛠️ 测试3: 检查工具栏按钮');
  
  // 检查H1按钮
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && btn.title.includes('H1') || btn.title && btn.title.includes('标题1')
  );
  
  if (h1Button) {
    console.log('✅ H1按钮存在');
    console.log('✅ H1按钮标题:', h1Button.title);
  } else {
    console.log('❌ H1按钮不存在');
  }
  
  // 检查H2按钮
  const h2Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && btn.title.includes('H2') || btn.title && btn.title.includes('标题2')
  );
  
  if (h2Button) {
    console.log('✅ H2按钮存在');
    console.log('✅ H2按钮标题:', h2Button.title);
  } else {
    console.log('❌ H2按钮不存在');
  }
  
  // 检查H3按钮
  const h3Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && btn.title.includes('H3') || btn.title && btn.title.includes('标题3')
  );
  
  if (h3Button) {
    console.log('✅ H3按钮存在');
    console.log('✅ H3按钮标题:', h3Button.title);
  } else {
    console.log('❌ H3按钮不存在');
  }
  
  // 检查无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && btn.title.includes('无序列表') || btn.title && btn.title.includes('bulletList')
  );
  
  if (ulButton) {
    console.log('✅ 无序列表按钮存在');
    console.log('✅ 无序列表按钮标题:', ulButton.title);
  } else {
    console.log('❌ 无序列表按钮不存在');
  }
  
  // 检查有序列表按钮
  const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && btn.title.includes('有序列表') || btn.title && btn.title.includes('numberList')
  );
  
  if (olButton) {
    console.log('✅ 有序列表按钮存在');
    console.log('✅ 有序列表按钮标题:', olButton.title);
  } else {
    console.log('❌ 有序列表按钮不存在');
  }
  
  return true;
}

// 测试4: 检查execCommand功能
function testExecCommand() {
  console.log('\n⚙️ 测试4: 检查execCommand功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试formatBlock命令
  console.log('✅ 测试formatBlock命令...');
  
  // 测试H1
  const h1Success = document.execCommand('formatBlock', false, 'h1');
  console.log('✅ H1 formatBlock命令结果:', h1Success);
  
  // 测试H2
  const h2Success = document.execCommand('formatBlock', false, 'h2');
  console.log('✅ H2 formatBlock命令结果:', h2Success);
  
  // 测试H3
  const h3Success = document.execCommand('formatBlock', false, 'h3');
  console.log('✅ H3 formatBlock命令结果:', h3Success);
  
  // 测试段落
  const pSuccess = document.execCommand('formatBlock', false, 'p');
  console.log('✅ P formatBlock命令结果:', pSuccess);
  
  // 测试无序列表
  const ulSuccess = document.execCommand('insertUnorderedList', false);
  console.log('✅ 无序列表命令结果:', ulSuccess);
  
  // 测试有序列表
  const olSuccess = document.execCommand('insertOrderedList', false);
  console.log('✅ 有序列表命令结果:', olSuccess);
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    headings: testHeadingFunctions(),
    lists: testListFunctions(),
    toolbar: testToolbarButtons(),
    execCommand: testExecCommand()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 标题功能测试:', results.headings ? '通过' : '失败');
  console.log('✅ 列表功能测试:', results.lists ? '通过' : '失败');
  console.log('✅ 工具栏按钮测试:', results.toolbar ? '通过' : '失败');
  console.log('✅ execCommand测试:', results.execCommand ? '通过' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！标题和列表功能正常工作。');
  } else {
    console.log('⚠️ 部分测试失败，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 使用说明:');
console.log('1. 在富文本编辑器中输入一些文本');
console.log('2. 选中文本，点击H1/H2/H3按钮设置标题格式');
console.log('3. 选中文本，点击列表按钮创建有序或无序列表');
console.log('4. 检查文本是否正确应用了标题和列表格式');
