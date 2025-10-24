// CSS样式覆盖检测脚本
// 在浏览器控制台中运行此脚本来检测是什么CSS规则在覆盖链接样式

console.log('🔧 CSS样式覆盖检测开始...');

function detectStyleOverrides() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 创建测试链接');
  
  // 清空编辑器
  editor.innerHTML = '';
  editor.innerHTML = '测试链接样式覆盖检测';
  
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
                
                // 详细分析样式覆盖
                console.log('\n📋 测试2: 详细分析样式覆盖');
                
                const linkStyle = window.getComputedStyle(link);
                console.log('✅ 计算样式:');
                console.log(`  - 颜色: ${linkStyle.color}`);
                console.log(`  - 下划线: ${linkStyle.textDecoration}`);
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
                
                // 检查所有应用的CSS规则
                console.log('\n📋 测试3: 检查应用的CSS规则');
                
                try {
                  // 获取所有样式表
                  const sheets = document.styleSheets;
                  console.log(`✅ 找到 ${sheets.length} 个样式表`);
                  
                  const appliedRules = [];
                  
                  for (let i = 0; i < sheets.length; i++) {
                    const sheet = sheets[i];
                    try {
                      const rules = sheet.cssRules || sheet.rules;
                      console.log(`✅ 样式表 ${i}: ${sheet.href || 'inline'} (${rules.length} 条规则)`);
                      
                      for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.selectorText && rule.selectorText.includes('a')) {
                          appliedRules.push({
                            sheet: i,
                            rule: j,
                            selector: rule.selectorText,
                            styles: rule.style.cssText,
                            href: sheet.href || 'inline'
                          });
                        }
                      }
                    } catch (e) {
                      console.log(`⚠️ 无法访问样式表 ${i}:`, e.message);
                    }
                  }
                  
                  console.log(`✅ 找到 ${appliedRules.length} 条链接相关CSS规则:`);
                  appliedRules.forEach((rule, index) => {
                    console.log(`  ${index + 1}. ${rule.selector}`);
                    console.log(`     样式: ${rule.styles}`);
                    console.log(`     来源: ${rule.href}`);
                  });
                  
                  // 检查是否有全局重置样式
                  const resetRules = appliedRules.filter(rule => 
                    rule.styles.includes('all:') || 
                    rule.styles.includes('color:') && rule.styles.includes('inherit') ||
                    rule.styles.includes('text-decoration:') && rule.styles.includes('none')
                  );
                  
                  if (resetRules.length > 0) {
                    console.log('\n⚠️ 发现可能的样式重置规则:');
                    resetRules.forEach((rule, index) => {
                      console.log(`  ${index + 1}. ${rule.selector}`);
                      console.log(`     样式: ${rule.styles}`);
                      console.log(`     来源: ${rule.href}`);
                    });
                  }
                  
                } catch (e) {
                  console.log('⚠️ 无法分析CSS规则:', e.message);
                }
                
                // 检查父元素的样式
                console.log('\n📋 测试4: 检查父元素样式');
                
                let parent = link.parentElement;
                let level = 0;
                while (parent && level < 5) {
                  const parentStyle = window.getComputedStyle(parent);
                  console.log(`✅ 父元素 ${level + 1} (${parent.tagName}):`);
                  console.log(`  - 颜色: ${parentStyle.color}`);
                  console.log(`  - 字体大小: ${parentStyle.fontSize}`);
                  console.log(`  - 字体粗细: ${parentStyle.fontWeight}`);
                  console.log(`  - 行高: ${parentStyle.lineHeight}`);
                  console.log(`  - 类名: ${parent.className}`);
                  console.log(`  - ID: ${parent.id}`);
                  
                  parent = parent.parentElement;
                  level++;
                }
                
                // 尝试手动强制应用样式
                console.log('\n📋 测试5: 手动强制应用样式');
                
                // 方法1: setProperty
                console.log('✅ 方法1: 使用setProperty');
                link.style.setProperty('color', '#2563eb', 'important');
                link.style.setProperty('text-decoration', 'underline', 'important');
                link.style.setProperty('cursor', 'pointer', 'important');
                
                setTimeout(() => {
                  const method1Style = window.getComputedStyle(link);
                  console.log('✅ 方法1结果:');
                  console.log(`  - 颜色: ${method1Style.color}`);
                  console.log(`  - 下划线: ${method1Style.textDecoration}`);
                  console.log(`  - 光标: ${method1Style.cursor}`);
                  
                  // 方法2: cssText
                  console.log('✅ 方法2: 使用cssText');
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
                  
                  setTimeout(() => {
                    const method2Style = window.getComputedStyle(link);
                    console.log('✅ 方法2结果:');
                    console.log(`  - 颜色: ${method2Style.color}`);
                    console.log(`  - 下划线: ${method2Style.textDecoration}`);
                    console.log(`  - 光标: ${method2Style.cursor}`);
                    
                    // 方法3: setAttribute
                    console.log('✅ 方法3: 使用setAttribute');
                    link.setAttribute('style', `
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
                    `);
                    
                    setTimeout(() => {
                      const method3Style = window.getComputedStyle(link);
                      console.log('✅ 方法3结果:');
                      console.log(`  - 颜色: ${method3Style.color}`);
                      console.log(`  - 下划线: ${method3Style.textDecoration}`);
                      console.log(`  - 光标: ${method3Style.cursor}`);
                      
                      console.log('\n🎯 样式覆盖检测完成！');
                      console.log('✅ 请查看上面的结果，找出是什么CSS规则在覆盖链接样式');
                      console.log('✅ 如果所有方法都无效，可能是浏览器或框架的全局样式重置');
                      
                    }, 100);
                  }, 100);
                }, 100);
                
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

// 运行检测
detectStyleOverrides();
