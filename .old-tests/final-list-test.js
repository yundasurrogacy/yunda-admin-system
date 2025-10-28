// 最终列表功能测试
// 在浏览器控制台中运行此脚本来验证修复

console.log('🔧 最终列表功能测试开始...');

function finalListTest() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 无序列表创建');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表功能';
  
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
        console.log('🎉 无序列表创建成功！');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        console.log('✅ LI文本内容:', li.textContent);
        
        // 检查样式
        const liStyle = window.getComputedStyle(li);
        console.log('✅ LI样式:');
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - display:', liStyle.display);
        console.log('  - margin:', liStyle.margin);
        console.log('  - lineHeight:', liStyle.lineHeight);
        
        // 验证样式
        if (liStyle.fontSize === '16px' && liStyle.display === 'list-item') {
          console.log('🎉 样式应用正确！');
        } else {
          console.log('❌ 样式应用不正确');
        }
        
        // 测试取消功能
        console.log('\n📋 测试2: 取消无序列表');
        
        // 选中列表项
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        console.log('✅ 选中列表项:', selection.toString());
        
        // 再次点击按钮
        console.log('✅ 再次点击无序列表按钮...');
        ulButton.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const ulAfter = editor.querySelector('ul');
          
          if (paragraph && !ulAfter) {
            console.log('🎉 无序列表取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
            
            const paragraphStyle = window.getComputedStyle(paragraph);
            console.log('✅ 段落样式:');
            console.log('  - fontSize:', paragraphStyle.fontSize);
            console.log('  - display:', paragraphStyle.display);
            
            if (paragraphStyle.fontSize === '16px' && paragraphStyle.display === 'block') {
              console.log('🎉 段落样式正确！');
            } else {
              console.log('❌ 段落样式不正确');
            }
            
          } else {
            console.log('❌ 无序列表取消失败');
            console.log('✅ 段落存在:', !!paragraph);
            console.log('✅ UL仍然存在:', !!ulAfter);
          }
          
          // 测试有序列表
          console.log('\n📋 测试3: 有序列表创建');
          
          // 清空编辑器
          editor.innerHTML = '';
          editor.innerHTML = '测试有序列表功能';
          
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
                console.log('🎉 有序列表创建成功！');
                console.log('✅ OL HTML:', ol.outerHTML);
                console.log('✅ LI HTML:', li2.outerHTML);
                console.log('✅ LI文本内容:', li2.textContent);
                
                // 检查样式
                const olStyle = window.getComputedStyle(ol);
                const li2Style = window.getComputedStyle(li2);
                console.log('✅ OL样式:');
                console.log('  - listStyleType:', olStyle.listStyleType);
                console.log('✅ LI2样式:');
                console.log('  - fontSize:', li2Style.fontSize);
                console.log('  - display:', li2Style.display);
                
                // 验证样式
                if (olStyle.listStyleType === 'decimal' && li2Style.fontSize === '16px') {
                  console.log('🎉 有序列表样式正确！');
                } else {
                  console.log('❌ 有序列表样式不正确');
                }
                
              } else {
                console.log('❌ 有序列表创建失败');
              }
              
              console.log('\n🎯 测试完成！');
              console.log('✅ 如果看到所有"🎉"消息，说明列表功能正常工作');
              console.log('✅ 如果看到"❌"消息，说明还有问题需要修复');
              
            }, 200);
          } else {
            console.log('❌ 未找到有序列表按钮');
          }
          
        }, 200);
        
      } else {
        console.log('❌ 无序列表创建失败');
        console.log('✅ UL存在:', !!ul);
        console.log('✅ LI存在:', !!li);
      }
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
finalListTest();
