// 按钮状态更新修复验证脚本
// 在浏览器控制台中运行此脚本来验证修复后的按钮状态更新

console.log('🔧 按钮状态更新修复验证开始...');

function testButtonStateUpdateFix() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 无序列表按钮状态更新');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试无序列表按钮状态更新';
  
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
    const initialActive = ulButton.className.includes('bg-[#C2A87A]');
    console.log('✅ 初始状态:', initialActive ? '激活' : '未激活');
    
    // 第一次点击 - 创建列表
    console.log('✅ 第一次点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const ulButtonActive = ulButton.className.includes('bg-[#C2A87A]');
      
      console.log('✅ 创建后状态:');
      console.log(`  - 是否有列表: ${!!ul}`);
      console.log(`  - 按钮是否激活: ${ulButtonActive}`);
      
      if (ul && ulButtonActive) {
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
          console.log('✅ 第二次点击无序列表按钮（应该取消）...');
          ulButton.click();
          
          setTimeout(() => {
            const ulAfter = editor.querySelector('ul');
            const liAfter = editor.querySelector('li');
            const pAfter = editor.querySelector('p');
            const ulButtonActiveAfter = ulButton.className.includes('bg-[#C2A87A]');
            
            console.log('✅ 取消后状态:');
            console.log(`  - 是否还有列表: ${!!ulAfter}`);
            console.log(`  - 是否还有LI: ${!!liAfter}`);
            console.log(`  - 是否有段落: ${!!pAfter}`);
            console.log(`  - 按钮是否仍然激活: ${ulButtonActiveAfter}`);
            
            if (!ulAfter && !liAfter && pAfter) {
              console.log('✅ 列表取消成功，转换为段落');
              
              if (!ulButtonActiveAfter) {
                console.log('🎉 按钮状态也正确更新了！');
              } else {
                console.log('❌ 按钮状态仍然没有更新！');
              }
            } else {
              console.log('❌ 列表取消失败');
            }
            
            // 测试有序列表
            console.log('\n📋 测试2: 有序列表按钮状态更新');
            
            // 清空编辑器
            editor.innerHTML = '';
            editor.innerHTML = '测试有序列表按钮状态更新';
            
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
              
              // 第一次点击 - 创建列表
              console.log('✅ 第一次点击有序列表按钮...');
              olButton.click();
              
              setTimeout(() => {
                const ol = editor.querySelector('ol');
                const olButtonActive = olButton.className.includes('bg-[#C2A87A]');
                
                console.log('✅ 创建后状态:');
                console.log(`  - 是否有列表: ${!!ol}`);
                console.log(`  - 按钮是否激活: ${olButtonActive}`);
                
                if (ol && olButtonActive) {
                  console.log('✅ 有序列表创建成功，按钮状态正确');
                  
                  // 选中列表项
                  const li3 = editor.querySelector('li');
                  if (li3) {
                    const range4 = document.createRange();
                    range4.selectNodeContents(li3);
                    const selection4 = window.getSelection();
                    selection4.removeAllRanges();
                    selection4.addRange(range4);
                    
                    console.log('✅ 选中列表项:', li3.textContent);
                    
                    // 第二次点击 - 应该取消列表
                    console.log('✅ 第二次点击有序列表按钮（应该取消）...');
                    olButton.click();
                    
                    setTimeout(() => {
                      const olAfter = editor.querySelector('ol');
                      const li3After = editor.querySelector('li');
                      const p2After = editor.querySelector('p');
                      const olButtonActiveAfter = olButton.className.includes('bg-[#C2A87A]');
                      
                      console.log('✅ 取消后状态:');
                      console.log(`  - 是否还有列表: ${!!olAfter}`);
                      console.log(`  - 是否还有LI: ${!!li3After}`);
                      console.log(`  - 是否有段落: ${!!p2After}`);
                      console.log(`  - 按钮是否仍然激活: ${olButtonActiveAfter}`);
                      
                      if (!olAfter && !li3After && p2After) {
                        console.log('✅ 有序列表取消成功，转换为段落');
                        
                        if (!olButtonActiveAfter) {
                          console.log('🎉 有序列表按钮状态也正确更新了！');
                        } else {
                          console.log('❌ 有序列表按钮状态仍然没有更新！');
                        }
                      } else {
                        console.log('❌ 有序列表取消失败');
                      }
                      
                      console.log('\n🎯 测试完成！');
                      console.log('✅ 如果看到"🎉"消息，说明按钮状态更新修复成功');
                      console.log('✅ 列表按钮应该可以正确创建、取消和切换');
                      console.log('✅ 按钮状态应该与列表状态实时同步');
                      
                    }, 300);
                  }
                } else {
                  console.log('❌ 有序列表创建失败或按钮状态不正确');
                }
              }, 300);
            } else {
              console.log('❌ 未找到有序列表按钮');
            }
            
          }, 300);
        }
      } else {
        console.log('❌ 无序列表创建失败或按钮状态不正确');
      }
    }, 300);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
}

// 运行测试
testButtonStateUpdateFix();
