// 详细按钮状态调试脚本
// 在浏览器控制台中运行此脚本来详细调试按钮状态

console.log('🔧 详细按钮状态调试开始...');

function debugButtonStates() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 调试1: 检查activeFormatting状态');
  
  // 尝试访问React组件的状态
  const reactFiber = editor._reactInternalFiber || editor._reactInternalInstance;
  if (reactFiber) {
    console.log('✅ 找到React组件实例');
  } else {
    console.log('⚠️ 无法直接访问React状态');
  }
  
  console.log('\n📋 调试2: 检查按钮激活逻辑');
  
  // 获取所有工具栏按钮
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.parentElement?.classList.contains('flex') && 
    btn.parentElement?.classList.contains('items-center')
  );
  
  // 查找列表按钮
  const ulButton = buttons.find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  const olButton = buttons.find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (ulButton) {
    console.log('✅ 无序列表按钮详情:');
    console.log(`  - 按钮元素:`, ulButton);
    console.log(`  - 完整类名: ${ulButton.className}`);
    console.log(`  - 是否包含激活样式: ${ulButton.className.includes('bg-[#C2A87A]')}`);
    console.log(`  - 是否包含sage-200: ${ulButton.className.includes('bg-sage-200')}`);
    console.log(`  - 背景色计算值:`, window.getComputedStyle(ulButton).backgroundColor);
  }
  
  if (olButton) {
    console.log('✅ 有序列表按钮详情:');
    console.log(`  - 按钮元素:`, olButton);
    console.log(`  - 完整类名: ${olButton.className}`);
    console.log(`  - 是否包含激活样式: ${olButton.className.includes('bg-[#C2A87A]')}`);
    console.log(`  - 是否包含sage-200: ${olButton.className.includes('bg-sage-200')}`);
    console.log(`  - 背景色计算值:`, window.getComputedStyle(olButton).backgroundColor);
  }
  
  console.log('\n📋 调试3: 检查段落按钮（对比）');
  
  const pButton = buttons.find(btn => 
    btn.textContent === 'P' || (btn.title && btn.title.includes('段落'))
  );
  
  if (pButton) {
    console.log('✅ 段落按钮详情:');
    console.log(`  - 按钮元素:`, pButton);
    console.log(`  - 完整类名: ${pButton.className}`);
    console.log(`  - 是否包含激活样式: ${pButton.className.includes('bg-[#C2A87A]')}`);
    console.log(`  - 是否包含sage-200: ${pButton.className.includes('bg-sage-200')}`);
    console.log(`  - 背景色计算值:`, window.getComputedStyle(pButton).backgroundColor);
  }
  
  console.log('\n📋 调试4: 检查编辑器内容状态');
  
  const ul = editor.querySelector('ul');
  const ol = editor.querySelector('ol');
  const p = editor.querySelector('p');
  
  console.log('✅ 编辑器内容状态:');
  console.log(`  - 是否有无序列表: ${!!ul}`);
  console.log(`  - 是否有有序列表: ${!!ol}`);
  console.log(`  - 是否有段落: ${!!p}`);
  console.log(`  - 编辑器HTML: ${editor.innerHTML}`);
  
  console.log('\n📋 调试5: 测试状态更新');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试状态更新';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  if (ulButton) {
    console.log('✅ 点击无序列表按钮前的状态:');
    console.log(`  - 按钮类名: ${ulButton.className}`);
    console.log(`  - 是否激活: ${ulButton.className.includes('bg-[#C2A87A]')}`);
    
    console.log('✅ 点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      console.log('✅ 点击无序列表按钮后的状态:');
      console.log(`  - 按钮类名: ${ulButton.className}`);
      console.log(`  - 是否激活: ${ulButton.className.includes('bg-[#C2A87A]')}`);
      console.log(`  - 背景色: ${window.getComputedStyle(ulButton).backgroundColor}`);
      
      const ulAfter = editor.querySelector('ul');
      console.log(`  - 是否有列表: ${!!ulAfter}`);
      
      if (ulAfter) {
        console.log('✅ 列表创建成功，检查按钮状态是否同步');
        
        // 选中列表项
        const li = editor.querySelector('li');
        if (li) {
          const range2 = document.createRange();
          range2.selectNodeContents(li);
          const selection2 = window.getSelection();
          selection2.removeAllRanges();
          selection2.addRange(range2);
          
          console.log('✅ 选中列表项:', li.textContent);
          
          console.log('✅ 再次点击无序列表按钮（应该取消）...');
          ulButton.click();
          
          setTimeout(() => {
            console.log('✅ 取消列表后的状态:');
            console.log(`  - 按钮类名: ${ulButton.className}`);
            console.log(`  - 是否激活: ${ulButton.className.includes('bg-[#C2A87A]')}`);
            console.log(`  - 背景色: ${window.getComputedStyle(ulButton).backgroundColor}`);
            
            const ulAfter2 = editor.querySelector('ul');
            const pAfter = editor.querySelector('p');
            console.log(`  - 是否还有列表: ${!!ulAfter2}`);
            console.log(`  - 是否有段落: ${!!pAfter}`);
            
            if (!ulAfter2 && pAfter) {
              console.log('🎉 列表取消成功！');
              if (!ulButton.className.includes('bg-[#C2A87A]')) {
                console.log('🎉 按钮状态也正确更新了！');
              } else {
                console.log('❌ 按钮状态没有正确更新！');
              }
            } else {
              console.log('❌ 列表取消失败');
            }
          }, 300);
        }
      } else {
        console.log('❌ 列表创建失败');
      }
    }, 300);
  }
}

// 运行调试
debugButtonStates();
