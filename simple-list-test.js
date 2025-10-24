// 简单的列表功能测试
// 在浏览器控制台中运行此脚本来测试列表功能

console.log('🔧 简单列表功能测试开始...');

function simpleListTest() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 步骤1: 设置测试环境');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试列表功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  console.log('✅ 编辑器内容:', editor.innerHTML);
  
  console.log('\n📋 步骤2: 查找按钮');
  
  // 查找无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList') || btn.title.includes('•'))
  );
  
  console.log('✅ 无序列表按钮:', !!ulButton);
  if (ulButton) {
    console.log('✅ 按钮标题:', ulButton.title);
    console.log('✅ 按钮图标:', ulButton.textContent);
    console.log('✅ 按钮onclick:', ulButton.onclick);
  }
  
  console.log('\n📋 步骤3: 点击按钮');
  
  if (ulButton) {
    // 监听控制台输出
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      if (args[0] && args[0].includes('applyListFormat')) {
        console.log('🎯 检测到applyListFormat调用:', args);
      }
    };
    
    // 点击按钮
    console.log('✅ 点击无序列表按钮...');
    ulButton.click();
    
    // 等待一下
    setTimeout(() => {
      console.log('\n📋 步骤4: 检查结果');
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
      
      // 恢复console.log
      console.log = originalLog;
      
      console.log('\n📋 步骤5: 测试第二次点击');
      
      if (li) {
        // 选中列表项
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        console.log('✅ 选中列表项:', selection.toString());
        
        // 再次点击按钮
        ulButton.click();
        
        setTimeout(() => {
          console.log('✅ 第二次点击后的编辑器内容:', editor.innerHTML);
          
          const ulAfter = editor.querySelector('ul');
          const paragraph = editor.querySelector('p');
          
          console.log('✅ 第二次点击后UL存在:', !!ulAfter);
          console.log('✅ 第二次点击后段落存在:', !!paragraph);
          
          if (paragraph) {
            console.log('✅ 段落HTML:', paragraph.outerHTML);
            console.log('✅ 段落文本:', paragraph.textContent);
          }
          
        }, 200);
      }
      
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
simpleListTest();
