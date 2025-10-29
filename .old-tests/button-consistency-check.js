// 按钮状态一致性检查脚本
// 在浏览器控制台中运行此脚本来检查按钮状态的一致性

console.log('🔧 按钮状态一致性检查开始...');

function checkButtonConsistency() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 检查1: 所有按钮的样式类名');
  
  // 获取所有工具栏按钮
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.parentElement?.classList.contains('flex') && 
    btn.parentElement?.classList.contains('items-center')
  );
  
  console.log('✅ 找到工具栏按钮数量:', buttons.length);
  
  buttons.forEach((btn, index) => {
    const className = btn.className;
    const isActive = className.includes('bg-[#C2A87A]') || className.includes('bg-sage-200');
    const title = btn.title || btn.textContent;
    
    console.log(`✅ 按钮${index + 1}: ${title}`);
    console.log(`  - 类名: ${className}`);
    console.log(`  - 是否激活: ${isActive ? '是' : '否'}`);
    console.log(`  - 背景色: ${isActive ? '激活色' : '默认色'}`);
    console.log('');
  });
  
  console.log('\n📋 检查2: 列表按钮状态');
  
  // 查找列表按钮
  const ulButton = buttons.find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  const olButton = buttons.find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (ulButton) {
    const ulClassName = ulButton.className;
    const ulIsActive = ulClassName.includes('bg-[#C2A87A]') || ulClassName.includes('bg-sage-200');
    console.log('✅ 无序列表按钮:');
    console.log(`  - 类名: ${ulClassName}`);
    console.log(`  - 是否激活: ${ulIsActive ? '是' : '否'}`);
  }
  
  if (olButton) {
    const olClassName = olButton.className;
    const olIsActive = olClassName.includes('bg-[#C2A87A]') || olClassName.includes('bg-sage-200');
    console.log('✅ 有序列表按钮:');
    console.log(`  - 类名: ${olClassName}`);
    console.log(`  - 是否激活: ${olIsActive ? '是' : '否'}`);
  }
  
  console.log('\n📋 检查3: 段落按钮状态（对比）');
  
  // 查找段落按钮
  const pButton = buttons.find(btn => 
    btn.textContent === 'P' || (btn.title && btn.title.includes('段落'))
  );
  
  if (pButton) {
    const pClassName = pButton.className;
    const pIsActive = pClassName.includes('bg-[#C2A87A]') || pClassName.includes('bg-sage-200');
    console.log('✅ 段落按钮:');
    console.log(`  - 类名: ${pClassName}`);
    console.log(`  - 是否激活: ${pIsActive ? '是' : '否'}`);
  }
  
  console.log('\n📋 检查4: 当前编辑器状态');
  
  // 检查当前是否有列表
  const ul = editor.querySelector('ul');
  const ol = editor.querySelector('ol');
  const p = editor.querySelector('p');
  
  console.log('✅ 当前编辑器内容:');
  console.log(`  - 是否有无序列表: ${!!ul}`);
  console.log(`  - 是否有有序列表: ${!!ol}`);
  console.log(`  - 是否有段落: ${!!p}`);
  
  if (ul) {
    console.log(`  - UL HTML: ${ul.outerHTML}`);
  }
  if (ol) {
    console.log(`  - OL HTML: ${ol.outerHTML}`);
  }
  if (p) {
    console.log(`  - P HTML: ${p.outerHTML}`);
  }
  
  console.log('\n📋 检查5: 测试按钮状态更新');
  
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
  
  if (ulButton) {
    console.log('✅ 点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ulAfter = editor.querySelector('ul');
      const ulButtonAfter = buttons.find(btn => 
        btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
      );
      
      if (ulAfter && ulButtonAfter) {
        const ulClassNameAfter = ulButtonAfter.className;
        const ulIsActiveAfter = ulClassNameAfter.includes('bg-[#C2A87A]') || ulClassNameAfter.includes('bg-sage-200');
        
        console.log('✅ 创建列表后按钮状态:');
        console.log(`  - 是否有列表: ${!!ulAfter}`);
        console.log(`  - 按钮是否激活: ${ulIsActiveAfter ? '是' : '否'}`);
        console.log(`  - 按钮类名: ${ulClassNameAfter}`);
        
        if (ulIsActiveAfter) {
          console.log('🎉 按钮状态正确！');
        } else {
          console.log('❌ 按钮状态不正确！');
        }
      } else {
        console.log('❌ 列表创建失败');
      }
    }, 300);
  }
}

// 运行检查
checkButtonConsistency();
