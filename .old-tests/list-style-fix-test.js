// 列表样式修复验证脚本
// 在浏览器控制台中运行此脚本来验证样式修复

console.log('🔧 列表样式修复验证开始...');

function testListStyleFix() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 测试1: 无序列表样式');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表样式';
  
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
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功！');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        
        // 检查内联样式
        console.log('✅ LI内联样式:', li.style.cssText);
        
        // 检查计算样式
        const liStyle = window.getComputedStyle(li);
        console.log('✅ LI计算样式:');
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - lineHeight:', liStyle.lineHeight);
        console.log('  - margin:', liStyle.margin);
        console.log('  - display:', liStyle.display);
        console.log('  - listStyleType:', liStyle.listStyleType);
        console.log('  - listStylePosition:', liStyle.listStylePosition);
        console.log('  - fontFamily:', liStyle.fontFamily);
        console.log('  - color:', liStyle.color);
        
        // 检查UL样式
        const ulStyle = window.getComputedStyle(ul);
        console.log('✅ UL计算样式:');
        console.log('  - fontSize:', ulStyle.fontSize);
        console.log('  - paddingLeft:', ulStyle.paddingLeft);
        console.log('  - margin:', ulStyle.margin);
        console.log('  - listStyleType:', ulStyle.listStyleType);
        console.log('  - fontFamily:', ulStyle.fontFamily);
        
        // 验证样式是否正确
        const styleChecks = {
          fontSize: liStyle.fontSize === '16px',
          lineHeight: liStyle.lineHeight === '1.6',
          display: liStyle.display === 'list-item',
          listStyleType: ulStyle.listStyleType === 'disc',
          listStylePosition: liStyle.listStylePosition === 'outside'
        };
        
        console.log('✅ 样式验证结果:');
        Object.entries(styleChecks).forEach(([key, value]) => {
          console.log(`  - ${key}: ${value ? '✅ 正确' : '❌ 错误'}`);
        });
        
        const allCorrect = Object.values(styleChecks).every(Boolean);
        if (allCorrect) {
          console.log('🎉 所有样式都正确应用！');
        } else {
          console.log('⚠️ 部分样式未正确应用');
        }
        
        // 测试文本内容
        console.log('✅ 列表项文本内容:', li.textContent);
        console.log('✅ 列表项文本长度:', li.textContent.length);
        
        if (li.textContent.trim() === '测试无序列表样式') {
          console.log('🎉 文本内容正确！');
        } else {
          console.log('❌ 文本内容不正确:', li.textContent);
        }
        
        // 测试取消功能
        console.log('\n📋 测试2: 取消列表样式');
        
        // 选中列表项
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        // 再次点击按钮
        ulButton.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const ulAfter = editor.querySelector('ul');
          
          if (paragraph && !ulAfter) {
            console.log('🎉 列表取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
            
            const paragraphStyle = window.getComputedStyle(paragraph);
            console.log('✅ 段落样式:');
            console.log('  - fontSize:', paragraphStyle.fontSize);
            console.log('  - display:', paragraphStyle.display);
            console.log('  - margin:', paragraphStyle.margin);
            console.log('  - lineHeight:', paragraphStyle.lineHeight);
            
            if (paragraphStyle.fontSize === '16px' && paragraphStyle.display === 'block') {
              console.log('🎉 段落样式正确！');
            } else {
              console.log('❌ 段落样式不正确');
            }
            
          } else {
            console.log('❌ 列表取消失败');
          }
        }, 200);
        
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
  
  return true;
}

function testOrderedListStyleFix() {
  console.log('\n📋 测试3: 有序列表样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试有序列表样式';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找有序列表按钮
  const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (olButton) {
    console.log('✅ 找到有序列表按钮');
    
    // 点击按钮
    olButton.click();
    
    setTimeout(() => {
      const ol = editor.querySelector('ol');
      const li = editor.querySelector('li');
      
      if (ol && li) {
        console.log('✅ 有序列表创建成功！');
        
        // 检查样式
        const liStyle = window.getComputedStyle(li);
        const olStyle = window.getComputedStyle(ol);
        
        console.log('✅ OL样式检查:');
        console.log('  - listStyleType:', olStyle.listStyleType);
        console.log('  - fontSize:', olStyle.fontSize);
        
        console.log('✅ LI样式检查:');
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - display:', liStyle.display);
        console.log('  - lineHeight:', liStyle.lineHeight);
        
        // 验证样式
        if (olStyle.listStyleType === 'decimal' && liStyle.fontSize === '16px') {
          console.log('🎉 有序列表样式正确！');
        } else {
          console.log('❌ 有序列表样式不正确');
        }
        
      } else {
        console.log('❌ 有序列表创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到有序列表按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllStyleTests() {
  console.log('🚀 开始运行所有样式修复测试...\n');
  
  const results = {
    unorderedList: testListStyleFix(),
    orderedList: testOrderedListStyleFix()
  };
  
  console.log('\n📊 样式修复测试结果汇总:');
  console.log('✅ 无序列表样式测试:', results.unorderedList ? '完成' : '失败');
  console.log('✅ 有序列表样式测试:', results.orderedList ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有样式修复测试完成！');
  } else {
    console.log('⚠️ 部分样式修复测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllStyleTests();

console.log('\n💡 样式修复说明:');
console.log('1. 使用setProperty方法强制应用样式');
console.log('2. 添加!important确保样式优先级');
console.log('3. 使用offsetHeight强制触发重绘');
console.log('4. 增强CSS特异性，覆盖所有可能的样式冲突');
console.log('5. 添加font-family: inherit确保字体一致');
console.log('6. 添加color: inherit确保颜色一致');
