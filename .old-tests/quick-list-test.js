// 简单的列表功能测试
// 在浏览器控制台中运行此脚本来快速测试列表功能

console.log('🔧 简单列表功能测试开始...');

function quickListTest() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
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
  
  console.log('✅ 无序列表按钮:', !!ulButton, ulButton?.title);
  console.log('✅ 有序列表按钮:', !!olButton, olButton?.title);
  
  if (ulButton) {
    console.log('✅ 测试无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      console.log('✅ UL存在:', !!ul);
      console.log('✅ LI存在:', !!li);
      
      if (ul) {
        console.log('✅ UL HTML:', ul.outerHTML);
        const ulStyle = window.getComputedStyle(ul);
        console.log('✅ UL样式:', {
          listStyleType: ulStyle.listStyleType,
          paddingLeft: ulStyle.paddingLeft,
          margin: ulStyle.margin,
          display: ulStyle.display
        });
      }
      
      if (li) {
        console.log('✅ LI HTML:', li.outerHTML);
        const liStyle = window.getComputedStyle(li);
        console.log('✅ LI样式:', {
          fontSize: liStyle.fontSize,
          display: liStyle.display,
          margin: liStyle.margin,
          lineHeight: liStyle.lineHeight
        });
      }
      
    }, 200);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
quickListTest();
