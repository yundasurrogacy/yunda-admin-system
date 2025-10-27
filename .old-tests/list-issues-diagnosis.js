// 列表功能问题诊断脚本
// 在浏览器控制台中运行此脚本来诊断列表功能问题

console.log('🔧 列表功能问题诊断开始...');

function diagnoseListIssues() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 诊断1: 检查按钮和命令');
  
  // 查找所有按钮
  const buttons = Array.from(document.querySelectorAll('button'));
  console.log('✅ 找到按钮数量:', buttons.length);
  
  // 查找列表按钮
  const ulButton = buttons.find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList') || btn.title.includes('•'))
  );
  const olButton = buttons.find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList') || btn.title.includes('1.'))
  );
  
  console.log('✅ 无序列表按钮:', !!ulButton, ulButton?.title, ulButton?.onclick);
  console.log('✅ 有序列表按钮:', !!olButton, olButton?.title, olButton?.onclick);
  
  if (!ulButton || !olButton) {
    console.log('❌ 未找到列表按钮');
    return;
  }
  
  console.log('\n📋 诊断2: 测试无序列表功能');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  console.log('✅ 选中范围:', range.toString());
  
  // 检查按钮点击事件
  console.log('✅ 点击无序列表按钮...');
  
  // 手动触发点击事件
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  ulButton.dispatchEvent(clickEvent);
  
  // 等待DOM更新
  setTimeout(() => {
    console.log('✅ 点击后的编辑器内容:', editor.innerHTML);
    
    const ul = editor.querySelector('ul');
    const li = editor.querySelector('li');
    
    console.log('✅ UL存在:', !!ul);
    console.log('✅ LI存在:', !!li);
    
    if (ul) {
      console.log('✅ UL HTML:', ul.outerHTML);
      console.log('✅ UL子元素数量:', ul.children.length);
    }
    
    if (li) {
      console.log('✅ LI HTML:', li.outerHTML);
      console.log('✅ LI文本内容:', li.textContent);
      console.log('✅ LI内联样式:', li.style.cssText);
      
      // 检查计算样式
      const liStyle = window.getComputedStyle(li);
      console.log('✅ LI计算样式:');
      console.log('  - fontSize:', liStyle.fontSize);
      console.log('  - display:', liStyle.display);
      console.log('  - listStyleType:', liStyle.listStyleType);
    }
    
    // 测试第二次点击
    if (li) {
      console.log('\n📋 诊断3: 测试第二次点击（应该取消列表）');
      
      // 选中列表项
      const liRange = document.createRange();
      liRange.selectNodeContents(li);
      selection.removeAllRanges();
      selection.addRange(liRange);
      
      console.log('✅ 选中列表项:', selection.toString());
      
      // 再次点击按钮
      ulButton.dispatchEvent(clickEvent);
      
      setTimeout(() => {
        console.log('✅ 第二次点击后的编辑器内容:', editor.innerHTML);
        
        const ulAfter = editor.querySelector('ul');
        const paragraph = editor.querySelector('p');
        
        console.log('✅ 第二次点击后UL存在:', !!ulAfter);
        console.log('✅ 第二次点击后段落存在:', !!paragraph);
        
        if (paragraph) {
          console.log('✅ 段落HTML:', paragraph.outerHTML);
          console.log('✅ 段落文本内容:', paragraph.textContent);
        }
        
      }, 200);
    }
    
  }, 200);
}

// 运行诊断
diagnoseListIssues();
