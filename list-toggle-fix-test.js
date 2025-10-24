// 列表取消功能修复验证脚本
// 在浏览器控制台中运行此脚本来验证修复后的列表取消功能

console.log('🔧 列表取消功能修复验证开始...');

function testListToggleFix() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 无序列表取消功能');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表取消功能';
  
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
    
    // 第一次点击 - 创建无序列表
    console.log('✅ 第一次点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功！');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        console.log('✅ LI文本内容:', li.textContent);
        
        // 检查按钮状态
        const isUlButtonActive = ulButton.classList.contains('bg-sage-200') || 
                                ulButton.classList.contains('bg-[#C2A87A]') ||
                                ulButton.style.backgroundColor;
        console.log('✅ 无序列表按钮是否激活:', isUlButtonActive);
        
        // 选中列表项
        const range2 = document.createRange();
        range2.selectNodeContents(li);
        const selection2 = window.getSelection();
        selection2.removeAllRanges();
        selection2.addRange(range2);
        
        console.log('✅ 选中列表项:', li.textContent);
        
        // 第二次点击 - 应该取消列表格式
        console.log('\n📋 测试2: 取消无序列表格式');
        console.log('✅ 第二次点击无序列表按钮...');
        ulButton.click();
        
        setTimeout(() => {
          const ulAfter = editor.querySelector('ul');
          const liAfter = editor.querySelector('li');
          const p = editor.querySelector('p');
          
          console.log('✅ 取消后检查:');
          console.log('  - 是否还有UL:', !!ulAfter);
          console.log('  - 是否还有LI:', !!liAfter);
          console.log('  - 是否有P标签:', !!p);
          
          if (!ulAfter && !liAfter && p) {
            console.log('🎉 无序列表取消成功！转换为段落');
            console.log('✅ P HTML:', p.outerHTML);
            console.log('✅ P文本内容:', p.textContent);
            
            // 检查按钮状态
            const isUlButtonActiveAfter = ulButton.classList.contains('bg-sage-200') || 
                                        ulButton.classList.contains('bg-[#C2A87A]') ||
                                        ulButton.style.backgroundColor;
            console.log('✅ 无序列表按钮是否仍然激活:', isUlButtonActiveAfter);
            
            if (!isUlButtonActiveAfter) {
              console.log('🎉 按钮状态正确取消！');
            } else {
              console.log('⚠️ 按钮状态未正确取消');
            }
            
          } else {
            console.log('❌ 无序列表取消失败');
            console.log('✅ 当前HTML:', editor.innerHTML);
          }
          
          // 测试有序列表
          console.log('\n📋 测试3: 有序列表取消功能');
          
          // 清空编辑器
          editor.innerHTML = '';
          editor.innerHTML = '测试有序列表取消功能';
          
          // 选中文本
          const textNode3 = editor.firstChild;
          const range3 = document.createRange();
          range3.setStart(textNode3, 0);
          range3.setEnd(textNode3, textNode3.textContent.length);
          const selection3 = window.getSelection();
          selection3.removeAllRanges();
          selection3.addRange(range3);
          
          // 查找有序列表按钮
          const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
          );
          
          if (olButton) {
            console.log('✅ 找到有序列表按钮');
            
            // 第一次点击 - 创建有序列表
            console.log('✅ 第一次点击有序列表按钮...');
            olButton.click();
            
            setTimeout(() => {
              const ol = editor.querySelector('ol');
              const li3 = editor.querySelector('li');
              
              if (ol && li3) {
                console.log('✅ 有序列表创建成功！');
                console.log('✅ OL HTML:', ol.outerHTML);
                console.log('✅ LI HTML:', li3.outerHTML);
                console.log('✅ LI文本内容:', li3.textContent);
                
                // 检查按钮状态
                const isOlButtonActive = olButton.classList.contains('bg-sage-200') || 
                                        olButton.classList.contains('bg-[#C2A87A]') ||
                                        olButton.style.backgroundColor;
                console.log('✅ 有序列表按钮是否激活:', isOlButtonActive);
                
                // 选中列表项
                const range4 = document.createRange();
                range4.selectNodeContents(li3);
                const selection4 = window.getSelection();
                selection4.removeAllRanges();
                selection4.addRange(range4);
                
                console.log('✅ 选中列表项:', li3.textContent);
                
                // 第二次点击 - 应该取消列表格式
                console.log('\n📋 测试4: 取消有序列表格式');
                console.log('✅ 第二次点击有序列表按钮...');
                olButton.click();
                
                setTimeout(() => {
                  const olAfter = editor.querySelector('ol');
                  const li3After = editor.querySelector('li');
                  const p2 = editor.querySelector('p');
                  
                  console.log('✅ 取消后检查:');
                  console.log('  - 是否还有OL:', !!olAfter);
                  console.log('  - 是否还有LI:', !!li3After);
                  console.log('  - 是否有P标签:', !!p2);
                  
                  if (!olAfter && !li3After && p2) {
                    console.log('🎉 有序列表取消成功！转换为段落');
                    console.log('✅ P HTML:', p2.outerHTML);
                    console.log('✅ P文本内容:', p2.textContent);
                    
                    // 检查按钮状态
                    const isOlButtonActiveAfter = olButton.classList.contains('bg-sage-200') || 
                                                  olButton.classList.contains('bg-[#C2A87A]') ||
                                                  olButton.style.backgroundColor;
                    console.log('✅ 有序列表按钮是否仍然激活:', isOlButtonActiveAfter);
                    
                    if (!isOlButtonActiveAfter) {
                      console.log('🎉 按钮状态正确取消！');
                    } else {
                      console.log('⚠️ 按钮状态未正确取消');
                    }
                    
                  } else {
                    console.log('❌ 有序列表取消失败');
                    console.log('✅ 当前HTML:', editor.innerHTML);
                  }
                  
                  console.log('\n🎯 测试完成！');
                  console.log('✅ 如果看到"🎉"消息，说明列表取消功能正常');
                  console.log('✅ 列表应该可以正确创建和取消');
                  console.log('✅ 按钮状态应该正确更新');
                  
                }, 300);
              } else {
                console.log('❌ 有序列表创建失败');
              }
            }, 300);
          } else {
            console.log('❌ 未找到有序列表按钮');
          }
          
        }, 300);
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
testListToggleFix();
