// 富文本编辑器标题和列表功能调试脚本
// 在浏览器控制台中运行此脚本来调试标题和列表功能

console.log('🔍 富文本编辑器标题和列表功能调试开始...');

// 调试1: 检查工具栏按钮
function debugToolbarButtons() {
  console.log('\n🛠️ 调试1: 检查工具栏按钮');
  
  const buttons = Array.from(document.querySelectorAll('button'));
  console.log('✅ 找到的按钮数量:', buttons.length);
  
  // 查找标题按钮
  const headingButtons = buttons.filter(btn => 
    btn.title && (
      btn.title.includes('H1') || btn.title.includes('H2') || btn.title.includes('H3') ||
      btn.title.includes('标题1') || btn.title.includes('标题2') || btn.title.includes('标题3')
    )
  );
  
  console.log('✅ 标题按钮数量:', headingButtons.length);
  headingButtons.forEach((btn, index) => {
    console.log(`✅ 标题按钮${index + 1}:`, {
      title: btn.title,
      icon: btn.textContent,
      disabled: btn.disabled,
      className: btn.className
    });
  });
  
  // 查找列表按钮
  const listButtons = buttons.filter(btn => 
    btn.title && (
      btn.title.includes('列表') || btn.title.includes('List') ||
      btn.title.includes('无序') || btn.title.includes('有序')
    )
  );
  
  console.log('✅ 列表按钮数量:', listButtons.length);
  listButtons.forEach((btn, index) => {
    console.log(`✅ 列表按钮${index + 1}:`, {
      title: btn.title,
      icon: btn.textContent,
      disabled: btn.disabled,
      className: btn.className
    });
  });
  
  return { headingButtons, listButtons };
}

// 调试2: 检查execCommand支持
function debugExecCommandSupport() {
  console.log('\n⚙️ 调试2: 检查execCommand支持');
  
  const commands = [
    'formatBlock',
    'insertUnorderedList',
    'insertOrderedList',
    'bold',
    'italic',
    'underline'
  ];
  
  commands.forEach(cmd => {
    const supported = document.queryCommandSupported(cmd);
    console.log(`✅ ${cmd} 支持状态:`, supported);
  });
  
  return true;
}

// 调试3: 测试标题功能
function debugHeadingFunctions() {
  console.log('\n📋 调试3: 测试标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H1
  console.log('✅ 测试H1标题...');
  const h1Success = document.execCommand('formatBlock', false, 'h1');
  console.log('✅ H1 formatBlock命令结果:', h1Success);
  
  if (h1Success) {
    const h1 = editor.querySelector('h1');
    if (h1) {
      console.log('✅ H1元素创建成功');
      console.log('✅ H1内容:', h1.textContent);
      console.log('✅ H1 HTML:', h1.outerHTML);
    } else {
      console.log('❌ H1元素未找到');
    }
  }
  
  // 测试H2
  console.log('✅ 测试H2标题...');
  editor.innerHTML = ''; // 清空
  const h2Success = document.execCommand('formatBlock', false, 'h2');
  console.log('✅ H2 formatBlock命令结果:', h2Success);
  
  if (h2Success) {
    const h2 = editor.querySelector('h2');
    if (h2) {
      console.log('✅ H2元素创建成功');
      console.log('✅ H2内容:', h2.textContent);
      console.log('✅ H2 HTML:', h2.outerHTML);
    } else {
      console.log('❌ H2元素未找到');
    }
  }
  
  // 测试H3
  console.log('✅ 测试H3标题...');
  editor.innerHTML = ''; // 清空
  const h3Success = document.execCommand('formatBlock', false, 'h3');
  console.log('✅ H3 formatBlock命令结果:', h3Success);
  
  if (h3Success) {
    const h3 = editor.querySelector('h3');
    if (h3) {
      console.log('✅ H3元素创建成功');
      console.log('✅ H3内容:', h3.textContent);
      console.log('✅ H3 HTML:', h3.outerHTML);
    } else {
      console.log('❌ H3元素未找到');
    }
  }
  
  return { h1Success, h2Success, h3Success };
}

// 调试4: 测试列表功能
function debugListFunctions() {
  console.log('\n📋 调试4: 测试列表功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 测试无序列表
  console.log('✅ 测试无序列表...');
  editor.innerHTML = ''; // 清空
  const ulSuccess = document.execCommand('insertUnorderedList', false);
  console.log('✅ 无序列表命令结果:', ulSuccess);
  
  if (ulSuccess) {
    const ul = editor.querySelector('ul');
    if (ul) {
      console.log('✅ 无序列表创建成功');
      console.log('✅ 无序列表HTML:', ul.outerHTML);
      const lis = ul.querySelectorAll('li');
      console.log('✅ 列表项数量:', lis.length);
    } else {
      console.log('❌ 无序列表元素未找到');
    }
  }
  
  // 测试有序列表
  console.log('✅ 测试有序列表...');
  editor.innerHTML = ''; // 清空
  const olSuccess = document.execCommand('insertOrderedList', false);
  console.log('✅ 有序列表命令结果:', olSuccess);
  
  if (olSuccess) {
    const ol = editor.querySelector('ol');
    if (ol) {
      console.log('✅ 有序列表创建成功');
      console.log('✅ 有序列表HTML:', ol.outerHTML);
      const lis = ol.querySelectorAll('li');
      console.log('✅ 列表项数量:', lis.length);
    } else {
      console.log('❌ 有序列表元素未找到');
    }
  }
  
  return { ulSuccess, olSuccess };
}

// 调试5: 检查CSS样式
function debugCSSStyles() {
  console.log('\n🎨 调试5: 检查CSS样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 创建测试元素
  editor.innerHTML = '<h1>测试H1</h1><h2>测试H2</h2><h3>测试H3</h3><ul><li>测试列表项</li></ul>';
  
  // 检查H1样式
  const h1 = editor.querySelector('h1');
  if (h1) {
    const style = window.getComputedStyle(h1);
    console.log('✅ H1样式:', {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      margin: style.margin
    });
  }
  
  // 检查H2样式
  const h2 = editor.querySelector('h2');
  if (h2) {
    const style = window.getComputedStyle(h2);
    console.log('✅ H2样式:', {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      margin: style.margin
    });
  }
  
  // 检查H3样式
  const h3 = editor.querySelector('h3');
  if (h3) {
    const style = window.getComputedStyle(h3);
    console.log('✅ H3样式:', {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      margin: style.margin
    });
  }
  
  // 检查列表样式
  const ul = editor.querySelector('ul');
  if (ul) {
    const style = window.getComputedStyle(ul);
    console.log('✅ 无序列表样式:', {
      margin: style.margin,
      paddingLeft: style.paddingLeft
    });
  }
  
  return true;
}

// 调试6: 检查按钮点击事件
function debugButtonClicks() {
  console.log('\n🖱️ 调试6: 检查按钮点击事件');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 查找H1按钮
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮');
    
    // 模拟点击
    console.log('✅ 模拟点击H1按钮...');
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1按钮点击成功，创建了H1元素');
        console.log('✅ H1内容:', h1.textContent);
      } else {
        console.log('❌ H1按钮点击失败，未创建H1元素');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 运行所有调试
function runAllDebug() {
  console.log('🚀 开始运行所有调试...\n');
  
  const results = {
    toolbar: debugToolbarButtons(),
    execCommand: debugExecCommandSupport(),
    headings: debugHeadingFunctions(),
    lists: debugListFunctions(),
    css: debugCSSStyles(),
    clicks: debugButtonClicks()
  };
  
  console.log('\n📊 调试结果汇总:');
  console.log('✅ 工具栏按钮调试:', results.toolbar ? '完成' : '失败');
  console.log('✅ execCommand支持调试:', results.execCommand ? '完成' : '失败');
  console.log('✅ 标题功能调试:', results.headings ? '完成' : '失败');
  console.log('✅ 列表功能调试:', results.lists ? '完成' : '失败');
  console.log('✅ CSS样式调试:', results.css ? '完成' : '失败');
  console.log('✅ 按钮点击调试:', results.clicks ? '完成' : '失败');
  
  return results;
}

// 自动运行调试
runAllDebug();

console.log('\n💡 调试说明:');
console.log('1. 检查工具栏按钮是否正确显示');
console.log('2. 检查execCommand命令是否支持');
console.log('3. 测试标题和列表功能是否正常工作');
console.log('4. 检查CSS样式是否正确应用');
console.log('5. 测试按钮点击事件是否正常');
