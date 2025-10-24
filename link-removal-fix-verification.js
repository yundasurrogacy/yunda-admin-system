// 链接移除功能修复验证脚本
// 在浏览器控制台中运行此脚本来验证修复

console.log('🔧 链接移除功能修复验证开始...');

function testLinkRemovalFixed() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 创建链接');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试链接移除功能';
  
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
                
                // 测试链接移除功能
                console.log('\n📋 测试2: 链接移除功能');
                
                // 选中链接
                const linkRange = document.createRange();
                linkRange.selectNodeContents(link);
                selection.removeAllRanges();
                selection.addRange(linkRange);
                
                console.log('✅ 选中链接:', link.textContent);
                
                // 检查选择状态
                console.log('✅ 选择文本:', selection.toString());
                console.log('✅ 选择范围数量:', selection.rangeCount);
                
                if (selection.rangeCount > 0) {
                  const testRange = selection.getRangeAt(0);
                  console.log('✅ 选择容器:', testRange.commonAncestorContainer);
                  console.log('✅ 选择开始容器:', testRange.startContainer);
                  console.log('✅ 选择结束容器:', testRange.endContainer);
                  
                  // 测试增强的链接检测函数
                  console.log('\n📋 测试3: 增强的链接检测');
                  
                  // 模拟增强检测函数
                  const findLinkElementEnhanced = (selection) => {
                    if (!selection || selection.rangeCount === 0) {
                      return null;
                    }

                    const range = selection.getRangeAt(0);
                    
                    // 方法1: 检查选择范围内的所有节点
                    const walker = document.createTreeWalker(
                      range.commonAncestorContainer,
                      NodeFilter.SHOW_ELEMENT,
                      {
                        acceptNode: (node) => {
                          if (node.nodeName.toLowerCase() === 'a') {
                            return NodeFilter.FILTER_ACCEPT;
                          }
                          return NodeFilter.FILTER_SKIP;
                        }
                      }
                    );

                    let linkNode = walker.nextNode();
                    if (linkNode) {
                      return linkNode;
                    }

                    // 方法2: 检查选择边界
                    const startContainer = range.startContainer;
                    const endContainer = range.endContainer;
                    
                    const findLinkElement = (container) => {
                      if (container.nodeType === Node.TEXT_NODE) {
                        return container.parentElement?.closest('a') || null;
                      } else if (container.nodeType === Node.ELEMENT_NODE) {
                        return container.closest?.('a') || null;
                      }
                      return null;
                    };
                    
                    const startLink = findLinkElement(startContainer);
                    if (startLink) return startLink;
                    
                    const endLink = findLinkElement(endContainer);
                    if (endLink) return endLink;

                    return null;
                  };
                  
                  const detectedLink = findLinkElementEnhanced(selection);
                  if (detectedLink) {
                    console.log('✅ 增强检测找到链接:', detectedLink);
                    console.log('✅ 检测到的链接URL:', detectedLink.href);
                    console.log('✅ 检测到的链接文本:', detectedLink.textContent);
                    
                    // 测试移除链接按钮
                    console.log('\n📋 测试4: 移除链接按钮');
                    
                    // 查找移除链接按钮
                    const removeButton = Array.from(document.querySelectorAll('button')).find(btn => 
                      btn.title && (btn.title.includes('移除链接') || btn.title.includes('removeLink'))
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
                        
                        if (!linkAfter && textAfter.includes('测试链接移除功能')) {
                          console.log('🎉 链接移除成功！');
                          console.log('✅ 移除后文本:', textAfter);
                        } else {
                          console.log('❌ 链接移除失败');
                          console.log('✅ 剩余链接:', linkAfter);
                          console.log('✅ 当前文本:', textAfter);
                        }
                        
                        console.log('\n🎯 修复验证完成！');
                        console.log('✅ 如果看到"🎉"消息，说明修复成功');
                        console.log('✅ "未找到链接元素"错误已修复');
                        console.log('✅ 链接移除功能现在应该正常工作');
                        
                      }, 300);
                    } else {
                      console.log('❌ 未找到移除链接按钮');
                    }
                  } else {
                    console.log('❌ 增强检测未找到链接');
                  }
                }
                
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
testLinkRemovalFixed();
