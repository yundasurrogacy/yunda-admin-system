// 标题切换功能测试脚本
// 在浏览器控制台中运行此脚本来测试标题的切换功能

console.log('🔧 标题切换功能测试开始...');

function testHeadingToggle() {
  console.log('\n📋 测试标题切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试标题切换功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 查找H1按钮
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮');
    
    // 第一次点击 - 应用H1格式
    console.log('✅ 第一次点击H1按钮...');
    h1Button.click();
    
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1格式应用成功！');
        console.log('✅ H1内容:', h1.textContent);
        
        // 检查样式
        const computedStyle = window.getComputedStyle(h1);
        console.log('✅ H1样式:', computedStyle.fontSize, computedStyle.fontWeight);
        
        // 选中H1文本
        const h1Range = document.createRange();
        h1Range.selectNodeContents(h1);
        selection.removeAllRanges();
        selection.addRange(h1Range);
        
        // 第二次点击 - 取消H1格式
        console.log('✅ 第二次点击H1按钮（应该取消格式）...');
        h1Button.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const h1After = editor.querySelector('h1');
          
          if (paragraph && !h1After) {
            console.log('🎉 H1格式取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
            
            // 检查段落样式
            const paragraphStyle = window.getComputedStyle(paragraph);
            console.log('✅ 段落样式:', paragraphStyle.fontSize, paragraphStyle.fontWeight);
            
            if (paragraphStyle.fontSize === '16px') {
              console.log('🎉 段落字体大小正确：16px');
            } else {
              console.log('❌ 段落字体大小不正确:', paragraphStyle.fontSize);
            }
            
            // 测试第三次点击 - 重新应用H1格式
            console.log('✅ 第三次点击H1按钮（应该重新应用格式）...');
            
            // 选中段落文本
            const paragraphRange = document.createRange();
            paragraphRange.selectNodeContents(paragraph);
            selection.removeAllRanges();
            selection.addRange(paragraphRange);
            
            h1Button.click();
            
            setTimeout(() => {
              const h1Final = editor.querySelector('h1');
              const paragraphFinal = editor.querySelector('p');
              
              if (h1Final && !paragraphFinal) {
                console.log('🎉 H1格式重新应用成功！');
                console.log('✅ 最终H1内容:', h1Final.textContent);
                
                const finalStyle = window.getComputedStyle(h1Final);
                console.log('✅ 最终H1样式:', finalStyle.fontSize, finalStyle.fontWeight);
                
                if (finalStyle.fontSize === '32px') {
                  console.log('🎉 最终H1字体大小正确：32px');
                } else {
                  console.log('❌ 最终H1字体大小不正确:', finalStyle.fontSize);
                }
                
                console.log('\n🎯 标题切换功能测试完成！');
                console.log('✅ 功能正常：可以应用、取消、重新应用标题格式');
                
              } else {
                console.log('❌ H1格式重新应用失败');
              }
            }, 200);
            
          } else {
            console.log('❌ H1格式取消失败');
            console.log('✅ 段落存在:', !!paragraph);
            console.log('✅ H1仍然存在:', !!h1After);
          }
        }, 200);
        
      } else {
        console.log('❌ H1格式应用失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试H2切换功能
function testH2Toggle() {
  console.log('\n📋 测试H2切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H2切换功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H2按钮
  const h2Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H2') || btn.title.includes('标题2'))
  );
  
  if (h2Button) {
    console.log('✅ 找到H2按钮');
    
    // 第一次点击 - 应用H2格式
    console.log('✅ 第一次点击H2按钮...');
    h2Button.click();
    
    setTimeout(() => {
      const h2 = editor.querySelector('h2');
      if (h2) {
        console.log('✅ H2格式应用成功！');
        
        // 选中H2文本
        const h2Range = document.createRange();
        h2Range.selectNodeContents(h2);
        selection.removeAllRanges();
        selection.addRange(h2Range);
        
        // 第二次点击 - 取消H2格式
        console.log('✅ 第二次点击H2按钮（应该取消格式）...');
        h2Button.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const h2After = editor.querySelector('h2');
          
          if (paragraph && !h2After) {
            console.log('🎉 H2格式取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
          } else {
            console.log('❌ H2格式取消失败');
          }
        }, 200);
        
      } else {
        console.log('❌ H2格式应用失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H2按钮');
  }
  
  return true;
}

// 测试H3切换功能
function testH3Toggle() {
  console.log('\n📋 测试H3切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H3切换功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H3按钮
  const h3Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H3') || btn.title.includes('标题3'))
  );
  
  if (h3Button) {
    console.log('✅ 找到H3按钮');
    
    // 第一次点击 - 应用H3格式
    console.log('✅ 第一次点击H3按钮...');
    h3Button.click();
    
    setTimeout(() => {
      const h3 = editor.querySelector('h3');
      if (h3) {
        console.log('✅ H3格式应用成功！');
        
        // 选中H3文本
        const h3Range = document.createRange();
        h3Range.selectNodeContents(h3);
        selection.removeAllRanges();
        selection.addRange(h3Range);
        
        // 第二次点击 - 取消H3格式
        console.log('✅ 第二次点击H3按钮（应该取消格式）...');
        h3Button.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const h3After = editor.querySelector('h3');
          
          if (paragraph && !h3After) {
            console.log('🎉 H3格式取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
          } else {
            console.log('❌ H3格式取消失败');
          }
        }, 200);
        
      } else {
        console.log('❌ H3格式应用失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H3按钮');
  }
  
  return true;
}

// 运行所有切换测试
function runAllToggleTests() {
  console.log('🚀 开始运行所有标题切换功能测试...\n');
  
  const results = {
    h1: testHeadingToggle(),
    h2: testH2Toggle(),
    h3: testH3Toggle()
  };
  
  console.log('\n📊 标题切换功能测试结果汇总:');
  console.log('✅ H1切换测试:', results.h1 ? '完成' : '失败');
  console.log('✅ H2切换测试:', results.h2 ? '完成' : '失败');
  console.log('✅ H3切换测试:', results.h3 ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有标题切换功能测试完成！');
  } else {
    console.log('⚠️ 部分标题切换功能测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllToggleTests();

console.log('\n💡 标题切换功能说明:');
console.log('1. 第一次点击标题按钮：应用标题格式');
console.log('2. 第二次点击相同标题按钮：取消标题格式，转换为段落');
console.log('3. 第三次点击相同标题按钮：重新应用标题格式');
console.log('4. 就像粗体、斜体等其他格式一样，支持切换功能');
console.log('5. 提供更好的用户体验，符合用户期望');
