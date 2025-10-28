// 检查函数调用的测试
// 在浏览器控制台中运行此脚本来检查函数调用

console.log('🔧 检查函数调用测试开始...');

function checkFunctionCalls() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 步骤1: 检查控制台输出');
  
  // 监听所有console.log输出
  const originalLog = console.log;
  const logs = [];
  
  console.log = function(...args) {
    logs.push(args.join(' '));
    originalLog.apply(console, args);
  };
  
  console.log('\n📋 步骤2: 设置测试环境');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试函数调用';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  console.log('\n📋 步骤3: 查找并点击按钮');
  
  // 查找无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮');
    
    // 点击按钮
    console.log('✅ 点击按钮...');
    ulButton.click();
    
    // 等待一下
    setTimeout(() => {
      console.log('\n📋 步骤4: 分析控制台输出');
      
      // 恢复console.log
      console.log = originalLog;
      
      console.log('✅ 所有控制台输出:');
      logs.forEach((log, index) => {
        console.log(`${index + 1}. ${log}`);
      });
      
      // 检查是否有相关的调试信息
      const relevantLogs = logs.filter(log => 
        log.includes('executeCommand') || 
        log.includes('applyListFormat') || 
        log.includes('list called') ||
        log.includes('函数开始执行')
      );
      
      console.log('\n✅ 相关的调试信息:');
      relevantLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log}`);
      });
      
      if (relevantLogs.length === 0) {
        console.log('❌ 没有找到相关的调试信息，函数可能没有被调用');
      } else {
        console.log('✅ 找到了相关的调试信息，函数被调用了');
      }
      
      console.log('\n📋 步骤5: 检查结果');
      console.log('✅ 点击后的编辑器内容:', editor.innerHTML);
      
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      console.log('✅ UL存在:', !!ul);
      console.log('✅ LI存在:', !!li);
      
      if (ul) {
        console.log('✅ UL HTML:', ul.outerHTML);
      }
      
      if (li) {
        console.log('✅ LI HTML:', li.outerHTML);
        console.log('✅ LI文本:', li.textContent);
      }
      
    }, 500);
  } else {
    console.log('❌ 未找到无序列表按钮');
    console.log = originalLog;
  }
}

// 运行测试
checkFunctionCalls();
