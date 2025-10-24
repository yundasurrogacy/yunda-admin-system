// 富文本编辑器标题和段落功能诊断脚本
// 在浏览器控制台中运行此脚本来诊断问题

console.log('🔍 富文本编辑器标题和段落功能诊断开始...');

// 诊断1: 检查编辑器是否存在
function diagnoseEditor() {
  console.log('\n📋 诊断1: 检查编辑器是否存在');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  console.log('✅ 找到富文本编辑器');
  console.log('✅ 编辑器内容:', editor.innerHTML);
  console.log('✅ 编辑器是否可编辑:', editor.contentEditable);
  
  return true;
}

// 诊断2: 检查按钮是否存在
function diagnoseButtons() {
  console.log('\n📋 诊断2: 检查按钮是否存在');
  
  const buttons = Array.from(document.querySelectorAll('button'));
  console.log('✅ 找到的按钮数量:', buttons.length);
  
  // 查找标题按钮
  const h1Button = buttons.find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  const h2Button = buttons.find(btn => 
    btn.title && (btn.title.includes('H2') || btn.title.includes('标题2'))
  );
  
  const h3Button = buttons.find(btn => 
    btn.title && (btn.title.includes('H3') || btn.title.includes('标题3'))
  );
  
  const pButton = buttons.find(btn => 
    btn.title && (btn.title.includes('段落') || btn.title.includes('paragraph'))
  );
  
  console.log('✅ H1按钮:', h1Button ? '存在' : '不存在');
  console.log('✅ H2按钮:', h2Button ? '存在' : '不存在');
  console.log('✅ H3按钮:', h3Button ? '存在' : '不存在');
  console.log('✅ 段落按钮:', pButton ? '存在' : '不存在');
  
  if (h1Button) {
    console.log('✅ H1按钮配置:', {
      title: h1Button.title,
      icon: h1Button.textContent,
      className: h1Button.className,
      onClick: h1Button.onclick ? '已设置' : '未设置'
    });
  }
  
  return { h1Button, h2Button, h3Button, pButton };
}

// 诊断3: 检查函数是否存在
function diagnoseFunctions() {
  console.log('\n📋 诊断3: 检查函数是否存在');
  
  // 检查全局函数
  const functions = [
    'executeCommand',
    'applyBlockFormat',
    'applyBoldFormat',
    'handleInput'
  ];
  
  functions.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    console.log(`✅ ${funcName}:`, exists ? '存在' : '不存在');
  });
  
  return true;
}

// 诊断4: 测试按钮点击
function diagnoseButtonClick() {
  console.log('\n📋 诊断4: 测试按钮点击');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试标题功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 查找H1按钮
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮，准备点击...');
    
    // 添加点击事件监听器
    h1Button.addEventListener('click', function() {
      console.log('✅ H1按钮被点击');
    });
    
    // 点击按钮
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
      } else {
        console.log('❌ H1标题创建失败');
        console.log('❌ 编辑器内容:', editor.innerHTML);
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 诊断5: 检查execCommand支持
function diagnoseExecCommand() {
  console.log('\n📋 诊断5: 检查execCommand支持');
  
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

// 诊断6: 检查Selection API
function diagnoseSelectionAPI() {
  console.log('\n📋 诊断6: 检查Selection API');
  
  const selection = window.getSelection();
  console.log('✅ Selection对象:', selection ? '存在' : '不存在');
  
  if (selection) {
    console.log('✅ Selection方法:', {
      toString: typeof selection.toString === 'function',
      getRangeAt: typeof selection.getRangeAt === 'function',
      addRange: typeof selection.addRange === 'function',
      removeAllRanges: typeof selection.removeAllRanges === 'function'
    });
  }
  
  return true;
}

// 诊断7: 手动测试标题创建
function diagnoseManualHeadingCreation() {
  console.log('\n📋 诊断7: 手动测试标题创建');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '手动测试标题创建';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 手动创建H1标题
  try {
    const h1 = document.createElement('h1');
    h1.textContent = selection.toString();
    range.deleteContents();
    range.insertNode(h1);
    
    console.log('✅ 手动创建H1成功');
    console.log('✅ 编辑器内容:', editor.innerHTML);
    
    // 选中新创建的元素
    const newRange = document.createRange();
    newRange.selectNodeContents(h1);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    console.log('✅ 选中新元素成功');
    
  } catch (error) {
    console.error('❌ 手动创建H1失败:', error);
  }
  
  return true;
}

// 运行所有诊断
function runAllDiagnostics() {
  console.log('🚀 开始运行所有诊断...\n');
  
  const results = {
    editor: diagnoseEditor(),
    buttons: diagnoseButtons(),
    functions: diagnoseFunctions(),
    buttonClick: diagnoseButtonClick(),
    execCommand: diagnoseExecCommand(),
    selectionAPI: diagnoseSelectionAPI(),
    manualCreation: diagnoseManualHeadingCreation()
  };
  
  console.log('\n📊 诊断结果汇总:');
  console.log('✅ 编辑器检查:', results.editor ? '通过' : '失败');
  console.log('✅ 按钮检查:', results.buttons ? '通过' : '失败');
  console.log('✅ 函数检查:', results.functions ? '通过' : '失败');
  console.log('✅ 按钮点击测试:', results.buttonClick ? '通过' : '失败');
  console.log('✅ execCommand检查:', results.execCommand ? '通过' : '失败');
  console.log('✅ Selection API检查:', results.selectionAPI ? '通过' : '失败');
  console.log('✅ 手动创建测试:', results.manualCreation ? '通过' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 诊断完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有诊断完成！');
  } else {
    console.log('⚠️ 部分诊断完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行诊断
runAllDiagnostics();

console.log('\n💡 诊断说明:');
console.log('1. 检查编辑器是否存在且可编辑');
console.log('2. 检查标题和段落按钮是否存在');
console.log('3. 检查相关函数是否存在');
console.log('4. 测试按钮点击功能');
console.log('5. 检查execCommand支持状态');
console.log('6. 检查Selection API支持');
console.log('7. 手动测试标题创建功能');
