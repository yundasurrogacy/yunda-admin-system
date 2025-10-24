// 列表样式问题诊断脚本
// 在浏览器控制台中运行此脚本来诊断样式问题

console.log('🔧 列表样式问题诊断开始...');

function diagnoseListStyles() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试列表样式';
  
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
    
    // 点击按钮
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 列表创建成功');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        
        // 检查内联样式
        console.log('✅ LI内联样式:', li.style.cssText);
        
        // 检查计算样式
        const liStyle = window.getComputedStyle(li);
        console.log('✅ LI计算样式:');
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - lineHeight:', liStyle.lineHeight);
        console.log('  - margin:', liStyle.margin);
        console.log('  - display:', liStyle.display);
        console.log('  - listStyleType:', liStyle.listStyleType);
        console.log('  - listStylePosition:', liStyle.listStylePosition);
        
        // 检查UL样式
        const ulStyle = window.getComputedStyle(ul);
        console.log('✅ UL计算样式:');
        console.log('  - fontSize:', ulStyle.fontSize);
        console.log('  - paddingLeft:', ulStyle.paddingLeft);
        console.log('  - margin:', ulStyle.margin);
        console.log('  - listStyleType:', ulStyle.listStyleType);
        
        // 检查是否有样式冲突
        console.log('✅ 检查样式冲突...');
        
        // 检查父元素样式
        const editorStyle = window.getComputedStyle(editor);
        console.log('✅ 编辑器样式:');
        console.log('  - fontSize:', editorStyle.fontSize);
        console.log('  - fontFamily:', editorStyle.fontFamily);
        console.log('  - lineHeight:', editorStyle.lineHeight);
        
        // 检查是否有全局样式覆盖
        const allStyles = document.styleSheets;
        console.log('✅ 样式表数量:', allStyles.length);
        
        // 检查CSS规则
        for (let i = 0; i < allStyles.length; i++) {
          try {
            const sheet = allStyles[i];
            if (sheet.cssRules) {
              for (let j = 0; j < sheet.cssRules.length; j++) {
                const rule = sheet.cssRules[j];
                if (rule.selectorText && rule.selectorText.includes('li')) {
                  console.log('✅ 找到LI相关CSS规则:', rule.selectorText, rule.style.cssText);
                }
                if (rule.selectorText && rule.selectorText.includes('ul')) {
                  console.log('✅ 找到UL相关CSS规则:', rule.selectorText, rule.style.cssText);
                }
              }
            }
          } catch (e) {
            console.log('⚠️ 无法访问样式表:', i, e.message);
          }
        }
        
        // 尝试强制应用样式
        console.log('✅ 尝试强制应用样式...');
        li.style.setProperty('font-size', '16px', 'important');
        li.style.setProperty('line-height', '1.6', 'important');
        li.style.setProperty('margin', '0.5em 0', 'important');
        li.style.setProperty('display', 'list-item', 'important');
        
        setTimeout(() => {
          const newStyle = window.getComputedStyle(li);
          console.log('✅ 强制应用后的样式:');
          console.log('  - fontSize:', newStyle.fontSize);
          console.log('  - lineHeight:', newStyle.lineHeight);
          console.log('  - margin:', newStyle.margin);
          console.log('  - display:', newStyle.display);
        }, 100);
        
      } else {
        console.log('❌ 列表创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行诊断
diagnoseListStyles();
