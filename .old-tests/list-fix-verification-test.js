// 列表功能修复验证测试脚本
// 在浏览器控制台中运行此脚本来验证列表功能修复

console.log('🔧 列表功能修复验证测试开始...');

function testListFunctionality() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  console.log('\n📋 测试1: 无序列表创建');
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表';
  
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
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList') || btn.title.includes('•'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮:', ulButton.title);
    
    // 点击按钮
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      console.log('✅ UL存在:', !!ul);
      console.log('✅ LI存在:', !!li);
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功！');
        console.log('✅ UL HTML:', ul.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        
        // 检查样式
        const ulStyle = window.getComputedStyle(ul);
        const liStyle = window.getComputedStyle(li);
        
        console.log('✅ UL样式检查:');
        console.log('  - listStyleType:', ulStyle.listStyleType);
        console.log('  - paddingLeft:', ulStyle.paddingLeft);
        console.log('  - margin:', ulStyle.margin);
        console.log('  - display:', ulStyle.display);
        console.log('  - fontSize:', ulStyle.fontSize);
        
        console.log('✅ LI样式检查:');
        console.log('  - fontSize:', liStyle.fontSize);
        console.log('  - display:', liStyle.display);
        console.log('  - margin:', liStyle.margin);
        console.log('  - lineHeight:', liStyle.lineHeight);
        console.log('  - listStylePosition:', liStyle.listStylePosition);
        
        // 验证样式是否正确
        if (ulStyle.listStyleType === 'disc') {
          console.log('🎉 无序列表标记正确：disc');
        } else {
          console.log('❌ 无序列表标记不正确:', ulStyle.listStyleType);
        }
        
        if (liStyle.fontSize === '16px') {
          console.log('🎉 列表项字体大小正确：16px');
        } else {
          console.log('❌ 列表项字体大小不正确:', liStyle.fontSize);
        }
        
        if (liStyle.display === 'list-item') {
          console.log('🎉 列表项显示类型正确：list-item');
        } else {
          console.log('❌ 列表项显示类型不正确:', liStyle.display);
        }
        
        // 测试取消功能
        console.log('\n📋 测试2: 取消无序列表');
        
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
            console.log('🎉 无序列表取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
            
            const paragraphStyle = window.getComputedStyle(paragraph);
            console.log('✅ 段落样式:', paragraphStyle.fontSize, paragraphStyle.display);
            
            if (paragraphStyle.fontSize === '16px') {
              console.log('🎉 段落字体大小正确：16px');
            } else {
              console.log('❌ 段落字体大小不正确:', paragraphStyle.fontSize);
            }
            
          } else {
            console.log('❌ 无序列表取消失败');
            console.log('✅ 段落存在:', !!paragraph);
            console.log('✅ UL仍然存在:', !!ulAfter);
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

function testOrderedListFunctionality() {
  console.log('\n📋 测试3: 有序列表创建');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试有序列表';
  
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
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList') || btn.title.includes('1.'))
  );
  
  if (olButton) {
    console.log('✅ 找到有序列表按钮:', olButton.title);
    
    // 点击按钮
    olButton.click();
    
    setTimeout(() => {
      const ol = editor.querySelector('ol');
      const li = editor.querySelector('li');
      
      if (ol && li) {
        console.log('✅ 有序列表创建成功！');
        console.log('✅ OL HTML:', ol.outerHTML);
        console.log('✅ LI HTML:', li.outerHTML);
        
        // 检查样式
        const olStyle = window.getComputedStyle(ol);
        const liStyle = window.getComputedStyle(li);
        
        console.log('✅ OL样式检查:');
        console.log('  - listStyleType:', olStyle.listStyleType);
        console.log('  - paddingLeft:', olStyle.paddingLeft);
        console.log('  - fontSize:', olStyle.fontSize);
        
        // 验证样式是否正确
        if (olStyle.listStyleType === 'decimal') {
          console.log('🎉 有序列表标记正确：decimal');
        } else {
          console.log('❌ 有序列表标记不正确:', olStyle.listStyleType);
        }
        
        if (liStyle.fontSize === '16px') {
          console.log('🎉 列表项字体大小正确：16px');
        } else {
          console.log('❌ 列表项字体大小不正确:', liStyle.fontSize);
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

function testListToggle() {
  console.log('\n📋 测试4: 列表类型切换');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试列表切换';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (ulButton && olButton) {
    console.log('✅ 找到列表按钮');
    
    // 先创建无序列表
    console.log('✅ 创建无序列表...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      if (ul) {
        console.log('✅ 无序列表创建成功');
        
        // 选中列表项
        const li = editor.querySelector('li');
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        // 切换到有序列表
        console.log('✅ 切换到有序列表...');
        olButton.click();
        
        setTimeout(() => {
          const ol = editor.querySelector('ol');
          const ulAfter = editor.querySelector('ul');
          
          if (ol && !ulAfter) {
            console.log('🎉 列表类型切换成功！');
            console.log('✅ 从无序列表切换到有序列表');
            
            const olStyle = window.getComputedStyle(ol);
            if (olStyle.listStyleType === 'decimal') {
              console.log('🎉 有序列表样式正确：decimal');
            } else {
              console.log('❌ 有序列表样式不正确:', olStyle.listStyleType);
            }
            
          } else {
            console.log('❌ 列表类型切换失败');
          }
        }, 200);
        
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到列表按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllListTests() {
  console.log('🚀 开始运行所有列表功能测试...\n');
  
  const results = {
    unorderedList: testListFunctionality(),
    orderedList: testOrderedListFunctionality(),
    listToggle: testListToggle()
  };
  
  console.log('\n📊 列表功能测试结果汇总:');
  console.log('✅ 无序列表测试:', results.unorderedList ? '完成' : '失败');
  console.log('✅ 有序列表测试:', results.orderedList ? '完成' : '失败');
  console.log('✅ 列表切换测试:', results.listToggle ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有列表功能测试完成！');
  } else {
    console.log('⚠️ 部分列表功能测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllListTests();

console.log('\n💡 列表功能修复说明:');
console.log('1. 使用cssText确保内联样式立即生效');
console.log('2. 增强CSS特异性，使用!important');
console.log('3. 添加list-style-position: outside确保标记可见');
console.log('4. 添加::marker样式确保标记颜色和粗细');
console.log('5. 修复字体大小和显示类型问题');
console.log('6. 确保切换功能正常工作');
