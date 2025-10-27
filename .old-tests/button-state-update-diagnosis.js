// 列表按钮状态更新诊断脚本
// 在浏览器控制台中运行此脚本来诊断按钮状态更新问题

console.log('🔧 列表按钮状态更新诊断开始...');

function diagnoseButtonStateUpdate() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 诊断1: 检查当前按钮状态');
  
  // 查找列表按钮
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
  
  // 检查当前按钮状态
  const ulButtonActive = ulButton.className.includes('bg-[#C2A87A]');
  const olButtonActive = olButton.className.includes('bg-[#C2A87A]');
  
  console.log('✅ 当前按钮状态:');
  console.log(`  - 无序列表按钮激活: ${ulButtonActive}`);
  console.log(`  - 有序列表按钮激活: ${olButtonActive}`);
  
  // 检查当前编辑器内容
  const ul = editor.querySelector('ul');
  const ol = editor.querySelector('ol');
  const p = editor.querySelector('p');
  
  console.log('✅ 当前编辑器内容:');
  console.log(`  - 是否有无序列表: ${!!ul}`);
  console.log(`  - 是否有有序列表: ${!!ol}`);
  console.log(`  - 是否有段落: ${!!p}`);
  
  console.log('\n📋 诊断2: 测试按钮状态更新');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试按钮状态更新';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 测试无序列表
  console.log('\n📋 测试无序列表按钮状态更新:');
  
  // 第一次点击 - 创建列表
  console.log('1. 创建无序列表...');
  ulButton.click();
  
  setTimeout(() => {
    const ulAfter = editor.querySelector('ul');
    const ulButtonActiveAfter = ulButton.className.includes('bg-[#C2A87A]');
    
    console.log('✅ 创建后状态:');
    console.log(`  - 是否有列表: ${!!ulAfter}`);
    console.log(`  - 按钮是否激活: ${ulButtonActiveAfter}`);
    
    if (ulAfter && ulButtonActiveAfter) {
      console.log('✅ 列表创建成功，按钮状态正确');
      
      // 选中列表项
      const li = editor.querySelector('li');
      if (li) {
        const range2 = document.createRange();
        range2.selectNodeContents(li);
        const selection2 = window.getSelection();
        selection2.removeAllRanges();
        selection2.addRange(range2);
        
        console.log('✅ 选中列表项:', li.textContent);
        
        // 第二次点击 - 应该取消列表
        console.log('2. 取消无序列表...');
        ulButton.click();
        
        setTimeout(() => {
          const ulAfter2 = editor.querySelector('ul');
          const liAfter = editor.querySelector('li');
          const pAfter = editor.querySelector('p');
          const ulButtonActiveAfter2 = ulButton.className.includes('bg-[#C2A87A]');
          
          console.log('✅ 取消后状态:');
          console.log(`  - 是否还有列表: ${!!ulAfter2}`);
          console.log(`  - 是否还有LI: ${!!liAfter}`);
          console.log(`  - 是否有段落: ${!!pAfter}`);
          console.log(`  - 按钮是否仍然激活: ${ulButtonActiveAfter2}`);
          
          if (!ulAfter2 && !liAfter && pAfter) {
            console.log('✅ 列表取消成功，转换为段落');
            
            if (!ulButtonActiveAfter2) {
              console.log('🎉 按钮状态也正确更新了！');
            } else {
              console.log('❌ 按钮状态没有更新！这是问题所在');
              
              // 尝试手动触发状态更新
              console.log('🔧 尝试手动触发状态更新...');
              
              // 模拟点击编辑器来触发状态更新
              editor.click();
              
              setTimeout(() => {
                const ulButtonActiveManual = ulButton.className.includes('bg-[#C2A87A]');
                console.log(`✅ 手动触发后按钮状态: ${ulButtonActiveManual ? '激活' : '未激活'}`);
                
                if (!ulButtonActiveManual) {
                  console.log('🎉 手动触发成功！');
                } else {
                  console.log('❌ 手动触发也失败了');
                }
              }, 100);
            }
          } else {
            console.log('❌ 列表取消失败');
          }
        }, 300);
      }
    } else {
      console.log('❌ 列表创建失败或按钮状态不正确');
    }
  }, 300);
}

// 运行诊断
diagnoseButtonStateUpdate();
