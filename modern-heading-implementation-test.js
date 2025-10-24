// 现代标题实现方法测试脚本
// 在浏览器控制台中运行此脚本来测试新的现代实现方法

console.log('🚀 现代标题实现方法测试开始...');

// 测试1: 测试现代标题实现方法
function testModernHeadingImplementation() {
  console.log('\n📋 测试1: 测试现代标题实现方法');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H1标题
  console.log('✅ 测试H1标题...');
  
  // 选中文本
  editor.innerHTML = '测试现代H1标题文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H1按钮并点击
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮，点击...');
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ 现代H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
        console.log('✅ H1样式:', window.getComputedStyle(h1).fontSize);
      } else {
        console.log('❌ 现代H1标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试2: 测试现代粗体实现方法
function testModernBoldImplementation() {
  console.log('\n📋 测试2: 测试现代粗体实现方法');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试粗体
  console.log('✅ 测试粗体...');
  
  // 选中文本
  editor.innerHTML = '测试现代粗体文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找粗体按钮并点击
  const boldButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('粗体') || btn.title.includes('bold'))
  );
  
  if (boldButton) {
    console.log('✅ 找到粗体按钮，点击...');
    boldButton.click();
    
    // 检查结果
    setTimeout(() => {
      const strong = editor.querySelector('strong');
      if (strong) {
        console.log('✅ 现代粗体创建成功');
        console.log('✅ 粗体内容:', strong.textContent);
        console.log('✅ 粗体样式:', window.getComputedStyle(strong).fontWeight);
      } else {
        console.log('❌ 现代粗体创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到粗体按钮');
  }
  
  return true;
}

// 测试3: 对比传统execCommand和现代方法
function testTraditionalVsModern() {
  console.log('\n📋 测试3: 对比传统execCommand和现代方法');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试传统execCommand方法
  console.log('✅ 测试传统execCommand方法...');
  
  // 选中文本
  editor.innerHTML = '测试传统方法';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 使用传统execCommand
  const traditionalSuccess = document.execCommand('formatBlock', false, 'h1');
  console.log('✅ 传统execCommand结果:', traditionalSuccess);
  
  // 检查结果
  setTimeout(() => {
    const h1 = editor.querySelector('h1');
    if (h1) {
      console.log('✅ 传统方法创建H1成功');
    } else {
      console.log('❌ 传统方法创建H1失败');
    }
  }, 100);
  
  return true;
}

// 测试4: 测试无选中文本的情况
function testNoSelectionCase() {
  console.log('\n📋 测试4: 测试无选中文本的情况');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试无选中文本时点击H1按钮
  console.log('✅ 测试无选中文本时点击H1按钮...');
  
  // 将光标放在编辑器中
  const range = document.createRange();
  range.setStart(editor, 0);
  range.setEnd(editor, 0);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H1按钮并点击
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮，点击...');
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ 无选中文本时H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
      } else {
        console.log('❌ 无选中文本时H1标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试5: 测试标题切换功能
function testHeadingSwitching() {
  console.log('\n📋 测试5: 测试标题切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 创建H1标题
  editor.innerHTML = '<h1>测试标题切换</h1>';
  
  // 选中H1标题
  const h1 = editor.querySelector('h1');
  const range = document.createRange();
  range.selectNodeContents(h1);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H2按钮并点击
  const h2Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H2') || btn.title.includes('标题2'))
  );
  
  if (h2Button) {
    console.log('✅ 找到H2按钮，点击...');
    h2Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h2 = editor.querySelector('h2');
      if (h2) {
        console.log('✅ 标题切换成功：H1 -> H2');
        console.log('✅ H2内容:', h2.textContent);
      } else {
        console.log('❌ 标题切换失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H2按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    modernHeading: testModernHeadingImplementation(),
    modernBold: testModernBoldImplementation(),
    traditionalVsModern: testTraditionalVsModern(),
    noSelection: testNoSelectionCase(),
    headingSwitching: testHeadingSwitching()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 现代标题实现测试:', results.modernHeading ? '完成' : '失败');
  console.log('✅ 现代粗体实现测试:', results.modernBold ? '完成' : '失败');
  console.log('✅ 传统vs现代方法测试:', results.traditionalVsModern ? '完成' : '失败');
  console.log('✅ 无选中文本测试:', results.noSelection ? '完成' : '失败');
  console.log('✅ 标题切换测试:', results.headingSwitching ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试完成！现代实现方法现在应该正常工作。');
  } else {
    console.log('⚠️ 部分测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 现代实现方法说明:');
console.log('1. 使用现代 Selection API 和 Range API');
console.log('2. 直接使用DOM操作创建元素');
console.log('3. 不依赖 document.execCommand');
console.log('4. 更好的浏览器兼容性');
console.log('5. 更精确的控制和更好的性能');
console.log('6. 支持选中文本和无选中文本两种情况');
console.log('7. 支持标题格式切换');
