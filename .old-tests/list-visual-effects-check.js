// 列表视觉效果检查脚本
// 在浏览器控制台中运行此脚本来检查列表的视觉效果

console.log('🔧 列表视觉效果检查开始...');

function checkListVisualEffects() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 步骤1: 创建测试列表');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 手动创建无序列表
  const ul = document.createElement('ul');
  const li1 = document.createElement('li');
  li1.textContent = '第一项';
  const li2 = document.createElement('li');
  li2.textContent = '第二项';
  const li3 = document.createElement('li');
  li3.textContent = '第三项';
  
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);
  
  editor.appendChild(ul);
  
  console.log('✅ 创建的无序列表:', ul.outerHTML);
  
  // 检查样式
  const ulStyle = window.getComputedStyle(ul);
  const li1Style = window.getComputedStyle(li1);
  
  console.log('\n📋 步骤2: 检查UL样式');
  console.log('✅ UL计算样式:');
  console.log('  - listStyleType:', ulStyle.listStyleType);
  console.log('  - listStylePosition:', ulStyle.listStylePosition);
  console.log('  - paddingLeft:', ulStyle.paddingLeft);
  console.log('  - margin:', ulStyle.margin);
  console.log('  - fontSize:', ulStyle.fontSize);
  console.log('  - fontFamily:', ulStyle.fontFamily);
  
  console.log('\n📋 步骤3: 检查LI样式');
  console.log('✅ LI1计算样式:');
  console.log('  - listStyleType:', li1Style.listStyleType);
  console.log('  - listStylePosition:', li1Style.listStylePosition);
  console.log('  - display:', li1Style.display);
  console.log('  - fontSize:', li1Style.fontSize);
  console.log('  - margin:', li1Style.margin);
  console.log('  - padding:', li1Style.padding);
  
  console.log('\n📋 步骤4: 检查CSS规则');
  
  // 检查是否有CSS规则影响列表
  const allStyles = document.styleSheets;
  console.log('✅ 样式表数量:', allStyles.length);
  
  for (let i = 0; i < allStyles.length; i++) {
    try {
      const sheet = allStyles[i];
      if (sheet.cssRules) {
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j];
          if (rule.selectorText && (
            rule.selectorText.includes('ul') || 
            rule.selectorText.includes('ol') || 
            rule.selectorText.includes('li') ||
            rule.selectorText.includes('list-style')
          )) {
            console.log('✅ 找到列表相关CSS规则:', rule.selectorText, rule.style.cssText);
          }
        }
      }
    } catch (e) {
      console.log('⚠️ 无法访问样式表:', i, e.message);
    }
  }
  
  console.log('\n📋 步骤5: 强制应用样式');
  
  // 强制应用样式
  ul.style.setProperty('list-style-type', 'disc', 'important');
  ul.style.setProperty('list-style-position', 'outside', 'important');
  ul.style.setProperty('padding-left', '2em', 'important');
  ul.style.setProperty('margin', '1em 0', 'important');
  
  li1.style.setProperty('display', 'list-item', 'important');
  li1.style.setProperty('list-style-position', 'outside', 'important');
  li1.style.setProperty('margin', '0.5em 0', 'important');
  
  li2.style.setProperty('display', 'list-item', 'important');
  li2.style.setProperty('list-style-position', 'outside', 'important');
  li2.style.setProperty('margin', '0.5em 0', 'important');
  
  li3.style.setProperty('display', 'list-item', 'important');
  li3.style.setProperty('list-style-position', 'outside', 'important');
  li3.style.setProperty('margin', '0.5em 0', 'important');
  
  // 强制重绘
  ul.offsetHeight;
  
  setTimeout(() => {
    console.log('\n📋 步骤6: 检查强制应用后的样式');
    
    const newUlStyle = window.getComputedStyle(ul);
    const newLi1Style = window.getComputedStyle(li1);
    
    console.log('✅ 强制应用后UL样式:');
    console.log('  - listStyleType:', newUlStyle.listStyleType);
    console.log('  - listStylePosition:', newUlStyle.listStylePosition);
    console.log('  - paddingLeft:', newUlStyle.paddingLeft);
    
    console.log('✅ 强制应用后LI1样式:');
    console.log('  - listStyleType:', newLi1Style.listStyleType);
    console.log('  - listStylePosition:', newLi1Style.listStylePosition);
    console.log('  - display:', newLi1Style.display);
    
    console.log('\n📋 步骤7: 测试有序列表');
    
    // 清空编辑器
    editor.innerHTML = '';
    
    // 创建有序列表
    const ol = document.createElement('ol');
    const oli1 = document.createElement('li');
    oli1.textContent = '第一项';
    const oli2 = document.createElement('li');
    oli2.textContent = '第二项';
    const oli3 = document.createElement('li');
    oli3.textContent = '第三项';
    
    ol.appendChild(oli1);
    ol.appendChild(oli2);
    ol.appendChild(oli3);
    
    editor.appendChild(ol);
    
    // 强制应用样式
    ol.style.setProperty('list-style-type', 'decimal', 'important');
    ol.style.setProperty('list-style-position', 'outside', 'important');
    ol.style.setProperty('padding-left', '2em', 'important');
    ol.style.setProperty('margin', '1em 0', 'important');
    
    oli1.style.setProperty('display', 'list-item', 'important');
    oli1.style.setProperty('list-style-position', 'outside', 'important');
    oli1.style.setProperty('margin', '0.5em 0', 'important');
    
    oli2.style.setProperty('display', 'list-item', 'important');
    oli2.style.setProperty('list-style-position', 'outside', 'important');
    oli2.style.setProperty('margin', '0.5em 0', 'important');
    
    oli3.style.setProperty('display', 'list-item', 'important');
    oli3.style.setProperty('list-style-position', 'outside', 'important');
    oli3.style.setProperty('margin', '0.5em 0', 'important');
    
    // 强制重绘
    ol.offsetHeight;
    
    setTimeout(() => {
      const olStyle = window.getComputedStyle(ol);
      const oli1Style = window.getComputedStyle(oli1);
      
      console.log('✅ 有序列表OL样式:');
      console.log('  - listStyleType:', olStyle.listStyleType);
      console.log('  - listStylePosition:', olStyle.listStylePosition);
      console.log('  - paddingLeft:', olStyle.paddingLeft);
      
      console.log('✅ 有序列表LI1样式:');
      console.log('  - listStyleType:', oli1Style.listStyleType);
      console.log('  - listStylePosition:', oli1Style.listStylePosition);
      console.log('  - display:', oli1Style.display);
      
      console.log('\n🎯 检查完成！');
      console.log('✅ 如果listStyleType显示为disc/decimal，说明标记应该可见');
      console.log('✅ 如果listStylePosition显示为outside，说明标记在外部');
      console.log('✅ 如果display显示为list-item，说明列表项显示正确');
      
    }, 100);
    
  }, 100);
}

// 运行检查
checkListVisualEffects();
