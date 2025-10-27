// 全局CSS链接样式修复验证脚本
// 在浏览器控制台中运行此脚本来验证全局CSS修复是否生效

console.log('🔧 全局CSS链接样式修复验证开始...');

function testGlobalCssLinkFix() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 检查全局CSS规则是否已加载');
  
  // 检查全局CSS规则是否存在
  const sheets = document.styleSheets;
  let globalCssFound = false;
  let linkRulesFound = 0;
  
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    try {
      const rules = sheet.cssRules || sheet.rules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.selectorText && rule.selectorText.includes('[contentEditable] a')) {
          globalCssFound = true;
          linkRulesFound++;
          console.log(`✅ 找到全局CSS规则 ${linkRulesFound}: ${rule.selectorText}`);
          console.log(`   样式: ${rule.style.cssText}`);
        }
      }
    } catch (e) {
      console.log(`⚠️ 无法访问样式表 ${i}:`, e.message);
    }
  }
  
  if (globalCssFound) {
    console.log(`✅ 找到 ${linkRulesFound} 条全局CSS链接规则`);
  } else {
    console.log('❌ 未找到全局CSS链接规则');
    console.log('🔧 可能需要刷新页面以加载新的CSS规则');
    return;
  }
  
  console.log('\n📋 测试2: 创建链接并测试全局CSS样式');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试全局CSS链接样式';
  
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
                
                // 检查全局CSS样式是否生效
                console.log('\n📋 测试3: 检查全局CSS样式是否生效');
                
                const linkStyle = window.getComputedStyle(link);
                console.log('✅ 计算样式:');
                console.log(`  - 颜色: ${linkStyle.color}`);
                console.log(`  - 下划线: ${linkStyle.textDecoration}`);
                console.log(`  - 光标: ${linkStyle.cursor}`);
                console.log(`  - 显示: ${linkStyle.display}`);
                console.log(`  - 字体大小: ${linkStyle.fontSize}`);
                console.log(`  - 字体粗细: ${linkStyle.fontWeight}`);
                console.log(`  - 行高: ${linkStyle.lineHeight}`);
                
                // 检查样式是否正确
                const hasColor = linkStyle.color && linkStyle.color !== 'rgba(0, 0, 0, 0)' && linkStyle.color !== 'rgb(0, 0, 0)';
                const hasUnderline = linkStyle.textDecoration.includes('underline');
                const hasPointer = linkStyle.cursor === 'pointer';
                
                console.log('\n📋 测试4: 样式验证结果');
                console.log(`✅ 有颜色: ${hasColor ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 下划线: ${hasUnderline ? '✅ 正确' : '❌ 错误'}`);
                console.log(`✅ 指针光标: ${hasPointer ? '✅ 正确' : '❌ 错误'}`);
                
                if (hasColor && hasUnderline && hasPointer) {
                  console.log('🎉 全局CSS修复成功！');
                  
                  // 测试悬停效果
                  console.log('\n📋 测试5: 测试悬停效果');
                  
                  // 模拟悬停
                  const hoverEvent = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  
                  console.log('✅ 模拟悬停...');
                  link.dispatchEvent(hoverEvent);
                  
                  setTimeout(() => {
                    const hoverStyle = window.getComputedStyle(link);
                    console.log('✅ 悬停后样式:');
                    console.log(`  - 颜色: ${hoverStyle.color}`);
                    console.log(`  - 下划线: ${hoverStyle.textDecoration}`);
                    console.log(`  - 背景: ${hoverStyle.backgroundColor}`);
                    
                    // 测试点击功能
                    console.log('\n📋 测试6: 测试链接点击功能');
                    
                    // 模拟点击链接
                    const clickEvent = new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      view: window
                    });
                    
                    console.log('✅ 模拟点击链接...');
                    link.dispatchEvent(clickEvent);
                    
                    console.log('\n🎯 全局CSS修复验证完成！');
                    console.log('✅ 如果看到"🎉"消息，说明全局CSS修复成功');
                    console.log('✅ 链接应该显示为蓝色下划线样式');
                    console.log('✅ 悬停时应该有背景高亮效果');
                    console.log('✅ 点击链接应该跳转到目标页面');
                    
                  }, 100);
                  
                } else {
                  console.log('❌ 全局CSS样式未生效');
                  console.log('🔧 可能需要刷新页面以重新加载CSS');
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
testGlobalCssLinkFix();
