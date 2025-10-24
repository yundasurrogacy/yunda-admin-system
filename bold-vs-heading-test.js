// 富文本编辑器粗体和标题功能对比测试脚本
// 在浏览器控制台中运行此脚本来测试粗体和标题功能的差异

console.log('🔍 富文本编辑器粗体和标题功能对比测试开始...');

// 测试1: 测试粗体功能
function testBoldFunctionality() {
  console.log('\n📋 测试1: 测试粗体功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试粗体
  console.log('✅ 测试粗体...');
  
  // 选中文本
  editor.innerHTML = '测试粗体文本';
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
      const bold = editor.querySelector('b') || editor.querySelector('strong');
      if (bold) {
        console.log('✅ 粗体创建成功');
        console.log('✅ 粗体内容:', bold.textContent);
        console.log('✅ 粗体样式:', window.getComputedStyle(bold).fontWeight);
      } else {
        console.log('❌ 粗体创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到粗体按钮');
  }
  
  return true;
}

// 测试2: 测试标题功能
function testHeadingFunctionality() {
  console.log('\n📋 测试2: 测试标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
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

// 测试3: 直接测试execCommand
function testExecCommandDirectly() {
  console.log('\n📋 测试3: 直接测试execCommand');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试粗体命令
  console.log('✅ 测试粗体命令...');
  const boldSuccess = document.execCommand('bold', false);
  console.log('✅ 粗体命令结果:', boldSuccess);
  
  // 测试标题命令
  console.log('✅ 测试标题命令...');
  const h1Success = document.execCommand('formatBlock', false, 'h1');
  console.log('✅ H1标题命令结果:', h1Success);
  
  // 测试H2命令
  console.log('✅ 测试H2标题命令...');
  const h2Success = document.execCommand('formatBlock', false, 'h2');
  console.log('✅ H2标题命令结果:', h2Success);
  
  // 测试H3命令
  console.log('✅ 测试H3标题命令...');
  const h3Success = document.execCommand('formatBlock', false, 'h3');
  console.log('✅ H3标题命令结果:', h3Success);
  
  return { boldSuccess, h1Success, h2Success, h3Success };
}

// 测试4: 检查命令支持
function testCommandSupport() {
  console.log('\n📋 测试4: 检查命令支持');
  
  const commands = [
    'bold',
    'italic',
    'underline',
    'formatBlock',
    'insertUnorderedList',
    'insertOrderedList'
  ];
  
  commands.forEach(cmd => {
    const supported = document.queryCommandSupported(cmd);
    console.log(`✅ ${cmd} 支持状态:`, supported);
  });
  
  return true;
}

// 测试5: 检查按钮配置
function testButtonConfiguration() {
  console.log('\n📋 测试5: 检查按钮配置');
  
  const buttons = Array.from(document.querySelectorAll('button'));
  console.log('✅ 找到的按钮数量:', buttons.length);
  
  // 查找粗体按钮
  const boldButton = buttons.find(btn => 
    btn.title && (btn.title.includes('粗体') || btn.title.includes('bold'))
  );
  
  if (boldButton) {
    console.log('✅ 粗体按钮配置:', {
      title: boldButton.title,
      icon: boldButton.textContent,
      className: boldButton.className
    });
  } else {
    console.log('❌ 未找到粗体按钮');
  }
  
  // 查找H1按钮
  const h1Button = buttons.find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ H1按钮配置:', {
      title: h1Button.title,
      icon: h1Button.textContent,
      className: h1Button.className
    });
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    bold: testBoldFunctionality(),
    heading: testHeadingFunctionality(),
    execCommand: testExecCommandDirectly(),
    support: testCommandSupport(),
    buttons: testButtonConfiguration()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 粗体功能测试:', results.bold ? '完成' : '失败');
  console.log('✅ 标题功能测试:', results.heading ? '完成' : '失败');
  console.log('✅ execCommand测试:', results.execCommand ? '完成' : '失败');
  console.log('✅ 命令支持测试:', results.support ? '完成' : '失败');
  console.log('✅ 按钮配置测试:', results.buttons ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试完成！');
  } else {
    console.log('⚠️ 部分测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 分析说明:');
console.log('1. 粗体命令使用 document.execCommand("bold") 直接执行');
console.log('2. 标题命令使用 document.execCommand("formatBlock", false, "h1") 执行');
console.log('3. 如果标题命令失败，可能是浏览器不支持或实现有问题');
console.log('4. 需要检查 executeCommand 函数中的 formatBlock 处理逻辑');
