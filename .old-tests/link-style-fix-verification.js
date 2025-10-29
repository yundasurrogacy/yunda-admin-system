// 链接样式修复验证脚本
// 在浏览器控制台中运行此脚本来验证链接样式修复

console.log('🔧 链接样式修复验证开始...');

function testLinkStyleFix() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 创建链接并检查样式');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试链接样式修复';
  
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
                
                // 详细检查链接样式
                console.log('\n📋 测试2: 详细检查链接样式');
                
                const linkStyle = window.getComputedStyle(link);
                console.log('✅ 计算样式检查:');
                console.log(`  - 颜色: ${linkStyle.color}`);
                console.log(`  - 下划线: ${linkStyle.textDecoration}`);
                console.log(`  - 光标: ${linkStyle.cursor}`);
                console.log(`  - 显示: ${linkStyle.display}`);
                console.log(`  - 字体大小: ${linkStyle.fontSize}`);
                console.log(`  - 字体粗细: ${linkStyle.fontWeight}`);
                console.log(`  - 行高: ${linkStyle.lineHeight}`);
                
                console.log('✅ 内联样式检查:');
                console.log(`  - 内联样式: ${link.style.cssText}`);
                
                // 检查CSS规则
                console.log('\n📋 测试3: 检查CSS规则');
                const allStyles = window.getComputedStyle(link);
                const cssRules = [];
                
                // 尝试获取应用的CSS规则
                try {
                  const sheets = document.styleSheets;
                  for (let sheet of sheets) {
                    try {
                      const rules = sheet.cssRules || sheet.rules;
                      for (let rule of rules) {
                        if (rule.selectorText && rule.selectorText.includes('a')) {
                          cssRules.push({
                            selector: rule.selectorText,
                            styles: rule.style.cssText
                          });
                        }
                      }
                    } catch (e) {
                      // 跨域样式表可能无法访问
                    }
                  }
                } catch (e) {
                  console.log('⚠️ 无法访问样式表:', e.message);
                }
                
                console.log('✅ 找到的CSS规则:', cssRules);
                
                // 检查样式是否正确应用
                const isBlue = linkStyle.color === 'rgb(37, 99, 235)' || linkStyle.color === '#2563eb';
                const hasUnderline = linkStyle.textDecoration.includes('underline');
                const hasPointer = linkStyle.cursor === 'pointer';
                
                console.log('\n📋 测试4: 样式验证结果');
                console.log(`✅ 蓝色样式: ${isBlue ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 下划线样式: ${hasUnderline ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 指针光标: ${hasPointer ? '✅ 正确' : '❌ 错误'}`);
                
                if (isBlue && hasUnderline && hasPointer) {
                  console.log('🎉 链接样式完全正确！');
                  
                  // 测试悬停效果
                  console.log('\n📋 测试5: 悬停效果');
                  
                  // 模拟悬停
                  const hoverEvent = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  link.dispatchEvent(hoverEvent);
                  
                  setTimeout(() => {
                    const hoverStyle = window.getComputedStyle(link);
                    console.log('✅ 悬停后样式:');
                    console.log(`  - 颜色: ${hoverStyle.color}`);
                    console.log(`  - 下划线: ${hoverStyle.textDecoration}`);
                    console.log(`  - 背景色: ${hoverStyle.backgroundColor}`);
                    
                    console.log('\n🎯 样式修复验证完成！');
                    console.log('✅ 如果看到"🎉"消息，说明链接样式修复成功');
                    console.log('✅ 链接应该显示为蓝色下划线文本');
                    console.log('✅ 悬停时应该有背景高亮效果');
                    
                  }, 100);
                  
                } else {
                  console.log('❌ 链接样式有问题');
                  console.log('🔧 尝试手动修复...');
                  
                  // 手动应用样式
                  link.style.cssText = `
                    color: #2563eb !important;
                    text-decoration: underline !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    background: none !important;
                    outline: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: inline !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                  `;
                  
                  link.offsetHeight; // 强制重绘
                  
                  setTimeout(() => {
                    const fixedStyle = window.getComputedStyle(link);
                    console.log('🔧 修复后样式:');
                    console.log(`  - 颜色: ${fixedStyle.color}`);
                    console.log(`  - 下划线: ${fixedStyle.textDecoration}`);
                    console.log(`  - 光标: ${fixedStyle.cursor}`);
                  }, 100);
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
testLinkStyleFix();
