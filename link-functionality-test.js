// 链接功能测试脚本
// 在浏览器控制台中运行此脚本来测试链接功能

console.log('🔧 链接功能测试开始...');

function testLinkFunctionality() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 插入链接功能');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试链接功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 查找插入链接按钮
  const linkButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('插入链接') || btn.title.includes('createLink'))
  );
  
  if (linkButton) {
    console.log('✅ 找到插入链接按钮');
    
    // 点击插入链接按钮
    console.log('✅ 点击插入链接按钮...');
    linkButton.click();
    
    setTimeout(() => {
      // 检查是否显示链接模态框
      const linkModal = document.querySelector('[class*="absolute"][class*="bg-white"][class*="border"]');
      if (linkModal && linkModal.textContent?.includes('插入链接')) {
        console.log('✅ 链接模态框显示成功');
        
        // 查找URL输入框
        const urlInput = linkModal.querySelector('input[type="url"]');
        if (urlInput) {
          console.log('✅ 找到URL输入框');
          
          // 输入URL
          (urlInput as HTMLInputElement).value = 'https://www.example.com';
          urlInput.dispatchEvent(new Event('input', { bubbles: true }));
          
          console.log('✅ 输入URL:', (urlInput as HTMLInputElement).value);
          
          // 查找确认按钮
          const confirmButton = Array.from(linkModal.querySelectorAll('button')).find(btn => 
            btn.textContent?.includes('确认') || btn.textContent?.includes('confirm')
          );
          
          if (confirmButton) {
            console.log('✅ 找到确认按钮');
            
            // 点击确认按钮
            console.log('✅ 点击确认按钮...');
            confirmButton.click();
            
            setTimeout(() => {
              // 检查是否创建了链接
              const link = editor.querySelector('a');
              if (link) {
                console.log('🎉 链接创建成功！');
                console.log('✅ 链接HTML:', link.outerHTML);
                console.log('✅ 链接URL:', link.href);
                console.log('✅ 链接文本:', link.textContent);
                
                // 测试链接样式
                const linkStyle = window.getComputedStyle(link);
                console.log('✅ 链接样式:');
                console.log(`  - 颜色: ${linkStyle.color}`);
                console.log(`  - 下划线: ${linkStyle.textDecoration}`);
                console.log(`  - 光标: ${linkStyle.cursor}`);
                
                // 测试链接工具栏
                console.log('\n📋 测试2: 链接工具栏功能');
                
                // 选中链接
                const linkRange = document.createRange();
                linkRange.selectNodeContents(link);
                selection.removeAllRanges();
                selection.addRange(linkRange);
                
                console.log('✅ 选中链接:', link.textContent);
                
                setTimeout(() => {
                  // 检查是否显示链接工具栏
                  const linkToolbar = document.querySelector('[class*="absolute"][class*="bg-white"]');
                  if (linkToolbar && linkToolbar.textContent?.includes('🔗')) {
                    console.log('✅ 链接工具栏显示成功');
                    
                    // 查找移除链接按钮
                    const removeButton = Array.from(linkToolbar.querySelectorAll('button')).find(btn => 
                      btn.textContent?.includes('🔓')
                    );
                    
                    if (removeButton) {
                      console.log('✅ 找到移除链接按钮');
                      
                      // 点击移除链接按钮
                      console.log('✅ 点击移除链接按钮...');
                      removeButton.click();
                      
                      setTimeout(() => {
                        // 检查链接是否被移除
                        const linkAfter = editor.querySelector('a');
                        const textAfter = editor.textContent;
                        
                        if (!linkAfter && textAfter.includes('测试链接功能')) {
                          console.log('🎉 链接移除成功！');
                          console.log('✅ 移除后文本:', textAfter);
                        } else {
                          console.log('❌ 链接移除失败');
                        }
                        
                        console.log('\n🎯 测试完成！');
                        console.log('✅ 如果看到"🎉"消息，说明链接功能正常');
                        console.log('✅ 链接应该可以正确创建、显示工具栏和移除');
                        
                      }, 300);
                    } else {
                      console.log('❌ 未找到移除链接按钮');
                    }
                  } else {
                    console.log('❌ 链接工具栏未显示');
                  }
                }, 300);
                
              } else {
                console.log('❌ 链接创建失败');
              }
            }, 300);
          } else {
            console.log('❌ 未找到确认按钮');
          }
        } else {
          console.log('❌ 未找到URL输入框');
        }
      } else {
        console.log('❌ 链接模态框未显示');
      }
    }, 300);
  } else {
    console.log('❌ 未找到插入链接按钮');
  }
}

// 运行测试
testLinkFunctionality();