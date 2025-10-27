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
                console.log('✅ 计算样式:');
                console.log(`  - 颜色: ${linkStyle.color}`);
                console.log(`  - 下划线: ${linkStyle.textDecoration}`);
                console.log(`  - 下划线颜色: ${linkStyle.textDecorationColor}`);
                console.log(`  - 下划线样式: ${linkStyle.textDecorationStyle}`);
                console.log(`  - 下划线粗细: ${linkStyle.textDecorationThickness}`);
                console.log(`  - 光标: ${linkStyle.cursor}`);
                console.log(`  - 显示: ${linkStyle.display}`);
                console.log(`  - 字体大小: ${linkStyle.fontSize}`);
                console.log(`  - 字体粗细: ${linkStyle.fontWeight}`);
                console.log(`  - 行高: ${linkStyle.lineHeight}`);
                console.log(`  - 背景: ${linkStyle.backgroundColor}`);
                console.log(`  - 边框: ${linkStyle.border}`);
                console.log(`  - 内边距: ${linkStyle.padding}`);
                console.log(`  - 外边距: ${linkStyle.margin}`);
                
                console.log('✅ 内联样式:');
                console.log(`  - 内联样式: ${link.style.cssText}`);
                
                // 检查样式是否正确
                const isBlue = linkStyle.color === 'rgb(37, 99, 235)' || linkStyle.color === '#2563eb';
                const hasUnderline = linkStyle.textDecoration.includes('underline');
                const hasPointer = linkStyle.cursor === 'pointer';
                const hasBlueUnderline = linkStyle.textDecorationColor === 'rgb(37, 99, 235)' || linkStyle.textDecorationColor === '#2563eb';
                
                console.log('\n📋 测试3: 样式验证结果');
                console.log(`✅ 蓝色样式: ${isBlue ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 下划线样式: ${hasUnderline ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 蓝色下划线: ${hasBlueUnderline ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 指针光标: ${hasPointer ? '✅ 正确' : '❌ 错误'}`);
                
                if (isBlue && hasUnderline && hasPointer) {
                  console.log('🎉 链接样式完全正确！');
                  
                  // 测试悬停效果
                  console.log('\n📋 测试4: 悬停效果');
                  
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
                    
                    // 测试点击功能
                    console.log('\n📋 测试5: 点击功能');
                    
                    // 模拟点击链接
                    const clickEvent = new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      view: window
                    });
                    
                    console.log('✅ 模拟点击链接...');
                    link.dispatchEvent(clickEvent);
                    
                    console.log('\n🎯 样式修复验证完成！');
                    console.log('✅ 如果看到"🎉"消息，说明链接样式修复成功');
                    console.log('✅ 链接应该显示为蓝色下划线文本');
                    console.log('✅ 悬停时应该有背景高亮效果');
                    console.log('✅ 点击链接应该跳转到目标页面');
                    
                  }, 100);
                  
                } else {
                  console.log('❌ 链接样式仍有问题');
                  console.log('🔧 尝试手动强制修复...');
                  
                  // 手动强制应用样式
                  link.style.setProperty('color', '#2563eb', 'important');
                  link.style.setProperty('text-decoration', 'underline', 'important');
                  link.style.setProperty('text-decoration-color', '#2563eb', 'important');
                  link.style.setProperty('text-decoration-style', 'solid', 'important');
                  link.style.setProperty('text-decoration-thickness', '1px', 'important');
                  link.style.setProperty('cursor', 'pointer', 'important');
                  
                  link.offsetHeight; // 强制重绘
                  
                  setTimeout(() => {
                    const fixedStyle = window.getComputedStyle(link);
                    console.log('🔧 手动修复后样式:');
                    console.log(`  - 颜色: ${fixedStyle.color}`);
                    console.log(`  - 下划线: ${fixedStyle.textDecoration}`);
                    console.log(`  - 下划线颜色: ${fixedStyle.textDecorationColor}`);
                    console.log(`  - 光标: ${fixedStyle.cursor}`);
                    
                    const isFixedBlue = fixedStyle.color === 'rgb(37, 99, 235)' || fixedStyle.color === '#2563eb';
                    const isFixedUnderline = fixedStyle.textDecoration.includes('underline');
                    const isFixedPointer = fixedStyle.cursor === 'pointer';
                    
                    if (isFixedBlue && isFixedUnderline && isFixedPointer) {
                      console.log('🎉 手动修复成功！');
                    } else {
                      console.log('❌ 手动修复失败');
                      console.log('🔧 可能需要检查CSS规则优先级或全局样式重置');
                    }
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
