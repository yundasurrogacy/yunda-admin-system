// 简单按钮状态测试
// 在浏览器控制台中运行此脚本来测试按钮状态

console.log('🔧 简单按钮状态测试开始...');

function simpleButtonTest() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试按钮状态更新');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试按钮状态';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 查找无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮');
    
    // 检查初始状态
    const initialClass = ulButton.className;
    const initialActive = initialClass.includes('bg-[#C2A87A]');
    console.log('✅ 初始状态:');
    console.log(`  - 类名: ${initialClass}`);
    console.log(`  - 是否激活: ${initialActive}`);
    
    // 点击按钮
    console.log('✅ 点击无序列表按钮...');
    ulButton.click();
    
    // 等待状态更新
    setTimeout(() => {
      const afterClass = ulButton.className;
      const afterActive = afterClass.includes('bg-[#C2A87A]');
      console.log('✅ 点击后状态:');
      console.log(`  - 类名: ${afterClass}`);
      console.log(`  - 是否激活: ${afterActive}`);
      
      const ul = editor.querySelector('ul');
      console.log(`  - 是否有列表: ${!!ul}`);
      
      if (ul && afterActive) {
        console.log('🎉 按钮状态正确！');
        
        // 测试取消
        console.log('✅ 再次点击按钮（应该取消）...');
        ulButton.click();
        
        setTimeout(() => {
          const cancelClass = ulButton.className;
          const cancelActive = cancelClass.includes('bg-[#C2A87A]');
          console.log('✅ 取消后状态:');
          console.log(`  - 类名: ${cancelClass}`);
          console.log(`  - 是否激活: ${cancelActive}`);
          
          const ulAfter = editor.querySelector('ul');
          const pAfter = editor.querySelector('p');
          console.log(`  - 是否还有列表: ${!!ulAfter}`);
          console.log(`  - 是否有段落: ${!!pAfter}`);
          
          if (!ulAfter && pAfter && !cancelActive) {
            console.log('🎉 按钮状态完全正确！');
          } else {
            console.log('❌ 按钮状态有问题');
          }
        }, 300);
      } else {
        console.log('❌ 按钮状态不正确');
      }
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
simpleButtonTest();
