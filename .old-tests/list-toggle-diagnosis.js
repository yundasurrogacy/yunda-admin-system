// 列表取消功能诊断脚本
// 在浏览器控制台中运行此脚本来诊断列表取消功能

console.log('🔧 列表取消功能诊断开始...');

function diagnoseListToggleIssue() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 诊断1: 检查当前编辑器状态');
  console.log('✅ 编辑器HTML:', editor.innerHTML);
  
  // 查找按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (!ulButton || !olButton) {
    console.log('❌ 未找到列表按钮');
    return;
  }
  
  console.log('✅ 找到列表按钮');
  
  // 检查按钮状态
  const ulButtonActive = ulButton.classList.contains('bg-sage-200') || 
                        ulButton.classList.contains('bg-[#C2A87A]') ||
                        ulButton.style.backgroundColor;
  const olButtonActive = olButton.classList.contains('bg-sage-200') || 
                        olButton.classList.contains('bg-[#C2A87A]') ||
                        olButton.style.backgroundColor;
  
  console.log('✅ 无序列表按钮状态:', ulButtonActive ? '激活' : '未激活');
  console.log('✅ 有序列表按钮状态:', olButtonActive ? '激活' : '未激活');
  
  // 检查当前是否有列表
  const ul = editor.querySelector('ul');
  const ol = editor.querySelector('ol');
  const li = editor.querySelector('li');
  
  console.log('✅ 当前列表状态:');
  console.log('  - 是否有UL:', !!ul);
  console.log('  - 是否有OL:', !!ol);
  console.log('  - 是否有LI:', !!li);
  
  if (ul) {
    console.log('  - UL HTML:', ul.outerHTML);
  }
  if (ol) {
    console.log('  - OL HTML:', ol.outerHTML);
  }
  if (li) {
    console.log('  - LI HTML:', li.outerHTML);
    console.log('  - LI文本:', li.textContent);
  }
  
  console.log('\n📋 诊断2: 测试列表取消功能');
  
  // 如果有列表，测试取消功能
  if (ul || ol) {
    console.log('✅ 检测到列表，测试取消功能');
    
    // 选中列表项
    if (li) {
      const range = document.createRange();
      range.selectNodeContents(li);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      console.log('✅ 选中列表项:', li.textContent);
      
      // 尝试取消列表
      if (ul) {
        console.log('✅ 尝试取消无序列表...');
        ulButton.click();
        
        setTimeout(() => {
          const ulAfter = editor.querySelector('ul');
          const liAfter = editor.querySelector('li');
          const p = editor.querySelector('p');
          
          console.log('✅ 取消后状态:');
          console.log('  - 是否还有UL:', !!ulAfter);
          console.log('  - 是否还有LI:', !!liAfter);
          console.log('  - 是否有P标签:', !!p);
          
          if (!ulAfter && !liAfter && p) {
            console.log('🎉 无序列表取消成功！');
            console.log('✅ P标签内容:', p.textContent);
          } else {
            console.log('❌ 无序列表取消失败');
            console.log('✅ 当前HTML:', editor.innerHTML);
          }
        }, 300);
      } else if (ol) {
        console.log('✅ 尝试取消有序列表...');
        olButton.click();
        
        setTimeout(() => {
          const olAfter = editor.querySelector('ol');
          const liAfter = editor.querySelector('li');
          const p = editor.querySelector('p');
          
          console.log('✅ 取消后状态:');
          console.log('  - 是否还有OL:', !!olAfter);
          console.log('  - 是否还有LI:', !!liAfter);
          console.log('  - 是否有P标签:', !!p);
          
          if (!olAfter && !liAfter && p) {
            console.log('🎉 有序列表取消成功！');
            console.log('✅ P标签内容:', p.textContent);
          } else {
            console.log('❌ 有序列表取消失败');
            console.log('✅ 当前HTML:', editor.innerHTML);
          }
        }, 300);
      }
    }
  } else {
    console.log('✅ 没有检测到列表，测试创建功能');
    
    // 添加测试文本
    editor.innerHTML = '测试列表创建和取消功能';
    
    // 选中文本
    const textNode = editor.firstChild;
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.textContent.length);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    console.log('✅ 选中文本:', selection.toString());
    
    // 创建无序列表
    console.log('✅ 创建无序列表...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        
        // 选中列表项
        const range2 = document.createRange();
        range2.selectNodeContents(li);
        const selection2 = window.getSelection();
        selection2.removeAllRanges();
        selection2.addRange(range2);
        
        console.log('✅ 选中列表项:', li.textContent);
        
        // 尝试取消列表
        console.log('✅ 尝试取消无序列表...');
        ulButton.click();
        
        setTimeout(() => {
          const ulAfter = editor.querySelector('ul');
          const liAfter = editor.querySelector('li');
          const p = editor.querySelector('p');
          
          console.log('✅ 取消后状态:');
          console.log('  - 是否还有UL:', !!ulAfter);
          console.log('  - 是否还有LI:', !!liAfter);
          console.log('  - 是否有P标签:', !!p);
          
          if (!ulAfter && !liAfter && p) {
            console.log('🎉 无序列表取消成功！');
            console.log('✅ P标签内容:', p.textContent);
          } else {
            console.log('❌ 无序列表取消失败');
            console.log('✅ 当前HTML:', editor.innerHTML);
          }
        }, 300);
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 300);
  }
}

// 运行诊断
diagnoseListToggleIssue();
