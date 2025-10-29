// 直接测试applyListFormat函数
// 在浏览器控制台中运行此脚本来直接测试函数

console.log('🔧 直接测试applyListFormat函数...');

function testApplyListFormatDirectly() {
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
  
  console.log('\n📋 步骤2: 手动创建列表');
  
  // 手动创建无序列表
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  li.textContent = '测试无序列表样式';
  
  // 添加样式
  li.style.setProperty('font-size', '16px', 'important');
  li.style.setProperty('line-height', '1.6', 'important');
  li.style.setProperty('margin', '0.5em 0', 'important');
  li.style.setProperty('display', 'list-item', 'important');
  li.style.setProperty('list-style-position', 'outside', 'important');
  
  ul.appendChild(li);
  
  // 插入到编辑器
  range.deleteContents();
  range.insertNode(ul);
  
  console.log('✅ 手动创建的列表:', ul.outerHTML);
  
  // 检查样式
  const liStyle = window.getComputedStyle(li);
  console.log('✅ LI样式:');
  console.log('  - fontSize:', liStyle.fontSize);
  console.log('  - display:', liStyle.display);
  console.log('  - margin:', liStyle.margin);
  console.log('  - lineHeight:', liStyle.lineHeight);
  
  console.log('\n📋 步骤3: 测试手动创建的有序列表');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试有序列表功能';
  
  // 选中文本
  const textNode2 = editor.firstChild;
  const range2 = document.createRange();
  range2.setStart(textNode2, 0);
  range2.setEnd(textNode2, textNode2.textContent.length);
  const selection2 = window.getSelection();
  selection2.removeAllRanges();
  selection2.addRange(range2);
  
  // 手动创建有序列表
  const ol = document.createElement('ol');
  const li2 = document.createElement('li');
  li2.textContent = '测试有序列表样式';
  
  // 添加样式
  li2.style.setProperty('font-size', '16px', 'important');
  li2.style.setProperty('line-height', '1.6', 'important');
  li2.style.setProperty('margin', '0.5em 0', 'important');
  li2.style.setProperty('display', 'list-item', 'important');
  li2.style.setProperty('list-style-position', 'outside', 'important');
  
  ol.appendChild(li2);
  
  // 插入到编辑器
  range2.deleteContents();
  range2.insertNode(ol);
  
  console.log('✅ 手动创建的有序列表:', ol.outerHTML);
  
  // 检查样式
  const li2Style = window.getComputedStyle(li2);
  const olStyle = window.getComputedStyle(ol);
  console.log('✅ OL样式:');
  console.log('  - listStyleType:', olStyle.listStyleType);
  console.log('  - fontSize:', olStyle.fontSize);
  console.log('✅ LI2样式:');
  console.log('  - fontSize:', li2Style.fontSize);
  console.log('  - display:', li2Style.display);
  
  console.log('\n📋 步骤4: 测试按钮点击');
  
  // 查找无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮');
    
    // 清空编辑器
    editor.innerHTML = '';
    editor.innerHTML = '测试按钮点击';
    
    // 选中文本
    const textNode3 = editor.firstChild;
    const range3 = document.createRange();
    range3.setStart(textNode3, 0);
    range3.setEnd(textNode3, textNode3.textContent.length);
    const selection3 = window.getSelection();
    selection3.removeAllRanges();
    selection3.addRange(range3);
    
    console.log('✅ 选中文本:', selection3.toString());
    
    // 点击按钮
    console.log('✅ 点击按钮...');
    ulButton.click();
    
    setTimeout(() => {
      console.log('✅ 点击后的编辑器内容:', editor.innerHTML);
      
      const ulAfter = editor.querySelector('ul');
      const liAfter = editor.querySelector('li');
      
      console.log('✅ 点击后UL存在:', !!ulAfter);
      console.log('✅ 点击后LI存在:', !!liAfter);
      
      if (ulAfter) {
        console.log('✅ 点击后UL HTML:', ulAfter.outerHTML);
      }
      
      if (liAfter) {
        console.log('✅ 点击后LI HTML:', liAfter.outerHTML);
        console.log('✅ 点击后LI文本:', liAfter.textContent);
        
        const liAfterStyle = window.getComputedStyle(liAfter);
        console.log('✅ 点击后LI样式:');
        console.log('  - fontSize:', liAfterStyle.fontSize);
        console.log('  - display:', liAfterStyle.display);
      }
      
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
testApplyListFormatDirectly();
