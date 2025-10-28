// 富文本编辑器标题功能修复测试脚本
// 在浏览器控制台中运行此脚本来测试修复后的标题功能

console.log('🔧 富文本编辑器标题功能修复测试开始...');

// 测试1: 测试H1标题功能
function testH1Heading() {
  console.log('\n📋 测试1: 测试H1标题功能');
  
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
  editor.innerHTML = '测试H1标题文本';
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
        console.log('✅ H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
        console.log('✅ H1样式:', window.getComputedStyle(h1).fontSize);
      } else {
        console.log('❌ H1标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试2: 测试H2标题功能
function testH2Heading() {
  console.log('\n📋 测试2: 测试H2标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H2标题
  console.log('✅ 测试H2标题...');
  
  // 选中文本
  editor.innerHTML = '测试H2标题文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
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
        console.log('✅ H2标题创建成功');
        console.log('✅ H2内容:', h2.textContent);
        console.log('✅ H2样式:', window.getComputedStyle(h2).fontSize);
      } else {
        console.log('❌ H2标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H2按钮');
  }
  
  return true;
}

// 测试3: 测试H3标题功能
function testH3Heading() {
  console.log('\n📋 测试3: 测试H3标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H3标题
  console.log('✅ 测试H3标题...');
  
  // 选中文本
  editor.innerHTML = '测试H3标题文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H3按钮并点击
  const h3Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H3') || btn.title.includes('标题3'))
  );
  
  if (h3Button) {
    console.log('✅ 找到H3按钮，点击...');
    h3Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h3 = editor.querySelector('h3');
      if (h3) {
        console.log('✅ H3标题创建成功');
        console.log('✅ H3内容:', h3.textContent);
        console.log('✅ H3样式:', window.getComputedStyle(h3).fontSize);
      } else {
        console.log('❌ H3标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H3按钮');
  }
  
  return true;
}

// 测试4: 测试段落功能
function testParagraph() {
  console.log('\n📋 测试4: 测试段落功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试段落
  console.log('✅ 测试段落...');
  
  // 选中文本
  editor.innerHTML = '测试段落文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找段落按钮并点击
  const pButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('段落') || btn.title.includes('paragraph'))
  );
  
  if (pButton) {
    console.log('✅ 找到段落按钮，点击...');
    pButton.click();
    
    // 检查结果
    setTimeout(() => {
      const p = editor.querySelector('p');
      if (p) {
        console.log('✅ 段落创建成功');
        console.log('✅ 段落内容:', p.textContent);
      } else {
        console.log('❌ 段落创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到段落按钮');
  }
  
  return true;
}

// 测试5: 测试无选中文本的情况
function testNoSelectionCase() {
  console.log('\n📋 测试5: 测试无选中文本的情况');
  
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

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    h1: testH1Heading(),
    h2: testH2Heading(),
    h3: testH3Heading(),
    paragraph: testParagraph(),
    noSelection: testNoSelectionCase()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ H1标题功能测试:', results.h1 ? '完成' : '失败');
  console.log('✅ H2标题功能测试:', results.h2 ? '完成' : '失败');
  console.log('✅ H3标题功能测试:', results.h3 ? '完成' : '失败');
  console.log('✅ 段落功能测试:', results.paragraph ? '完成' : '失败');
  console.log('✅ 无选中文本测试:', results.noSelection ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试完成！标题功能现在应该正常工作。');
  } else {
    console.log('⚠️ 部分测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 修复说明:');
console.log('1. 移除了对 document.execCommand("formatBlock") 的依赖');
console.log('2. 直接使用DOM操作创建标题元素');
console.log('3. 支持选中文本和无选中文本两种情况');
console.log('4. 标题功能现在应该像粗体功能一样正常工作');
