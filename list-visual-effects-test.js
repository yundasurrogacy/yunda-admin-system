// 列表视觉效果验证脚本
// 在浏览器控制台中运行此脚本来验证列表的视觉效果

console.log('🔧 列表视觉效果验证开始...');

function testListVisualEffects() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 无序列表视觉效果');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表视觉效果';
  
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
    console.log('✅ 点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功！');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        console.log('✅ LI文本内容:', li.textContent);
        
        // 检查样式
        const ulStyle = window.getComputedStyle(ul);
        const liStyle = window.getComputedStyle(li);
        
        console.log('✅ UL计算样式:');
        console.log('  - listStyleType:', ulStyle.listStyleType);
        console.log('  - paddingLeft:', ulStyle.paddingLeft);
        console.log('  - margin:', ulStyle.margin);
        console.log('  - fontSize:', ulStyle.fontSize);
        
        console.log('✅ LI计算样式:');
        console.log('  - listStyleType:', liStyle.listStyleType);
        console.log('  - listStylePosition:', liStyle.listStylePosition);
        console.log('  - display:', liStyle.display);
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - margin:', liStyle.margin);
        
        // 验证视觉效果
        const visualChecks = {
          ulListStyleType: ulStyle.listStyleType === 'disc',
          liListStyleType: liStyle.listStyleType === 'disc',
          liDisplay: liStyle.display === 'list-item',
          liListStylePosition: liStyle.listStylePosition === 'outside',
          ulPaddingLeft: ulStyle.paddingLeft === '32px' || ulStyle.paddingLeft === '2em'
        };
        
        console.log('✅ 视觉效果验证:');
        Object.entries(visualChecks).forEach(([key, value]) => {
          console.log(`  - ${key}: ${value ? '✅ 正确' : '❌ 错误'}`);
        });
        
        const allCorrect = Object.values(visualChecks).every(Boolean);
        if (allCorrect) {
          console.log('🎉 无序列表视觉效果正确！应该能看到圆点标记');
        } else {
          console.log('⚠️ 无序列表视觉效果有问题');
        }
        
        // 测试有序列表
        console.log('\n📋 测试2: 有序列表视觉效果');
        
        // 清空编辑器
        editor.innerHTML = '';
        editor.innerHTML = '测试有序列表视觉效果';
        
        // 选中文本
        const textNode2 = editor.firstChild;
        const range2 = document.createRange();
        range2.setStart(textNode2, 0);
        range2.setEnd(textNode2, textNode2.textContent.length);
        const selection2 = window.getSelection();
        selection2.removeAllRanges();
        selection2.addRange(range2);
        
        // 查找有序列表按钮
        const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
        );
        
        if (olButton) {
          console.log('✅ 找到有序列表按钮');
          
          // 点击按钮
          console.log('✅ 点击有序列表按钮...');
          olButton.click();
          
          setTimeout(() => {
            const ol = editor.querySelector('ol');
            const li2 = editor.querySelector('li');
            
            if (ol && li2) {
              console.log('✅ 有序列表创建成功！');
              console.log('✅ OL HTML:', ol.outerHTML);
              console.log('✅ LI HTML:', li2.outerHTML);
              console.log('✅ LI文本内容:', li2.textContent);
              
              // 检查样式
              const olStyle = window.getComputedStyle(ol);
              const li2Style = window.getComputedStyle(li2);
              
              console.log('✅ OL计算样式:');
              console.log('  - listStyleType:', olStyle.listStyleType);
              console.log('  - paddingLeft:', olStyle.paddingLeft);
              console.log('  - margin:', olStyle.margin);
              console.log('  - fontSize:', olStyle.fontSize);
              
              console.log('✅ LI2计算样式:');
              console.log('  - listStyleType:', li2Style.listStyleType);
              console.log('  - listStylePosition:', li2Style.listStylePosition);
              console.log('  - display:', li2Style.display);
              console.log('  - fontSize:', li2Style.fontSize);
              console.log('  - margin:', li2Style.margin);
              
              // 验证视觉效果
              const visualChecks2 = {
                olListStyleType: olStyle.listStyleType === 'decimal',
                li2ListStyleType: li2Style.listStyleType === 'decimal',
                li2Display: li2Style.display === 'list-item',
                li2ListStylePosition: li2Style.listStylePosition === 'outside',
                olPaddingLeft: olStyle.paddingLeft === '32px' || olStyle.paddingLeft === '2em'
              };
              
              console.log('✅ 有序列表视觉效果验证:');
              Object.entries(visualChecks2).forEach(([key, value]) => {
                console.log(`  - ${key}: ${value ? '✅ 正确' : '❌ 错误'}`);
              });
              
              const allCorrect2 = Object.values(visualChecks2).every(Boolean);
              if (allCorrect2) {
                console.log('🎉 有序列表视觉效果正确！应该能看到数字标记');
              } else {
                console.log('⚠️ 有序列表视觉效果有问题');
              }
              
            } else {
              console.log('❌ 有序列表创建失败');
            }
            
            console.log('\n🎯 测试完成！');
            console.log('✅ 如果看到"🎉"消息，说明列表视觉效果正确');
            console.log('✅ 应该能看到圆点(•)和数字(1.)标记');
            console.log('✅ 如果看不到标记，可能是浏览器兼容性问题');
            
          }, 300);
        } else {
          console.log('❌ 未找到有序列表按钮');
        }
        
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
testListVisualEffects();
