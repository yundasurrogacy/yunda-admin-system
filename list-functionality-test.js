// 列表功能测试脚本
// 在浏览器控制台中运行此脚本来测试列表功能

console.log('🔧 列表功能测试开始...');

function testUnorderedList() {
  console.log('\n📋 测试无序列表功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试无序列表功能';
  
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
    console.log('✅ 找到无序列表按钮');
    
    // 第一次点击 - 应用无序列表格式
    console.log('✅ 第一次点击无序列表按钮...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const li = editor.querySelector('li');
      
      if (ul && li) {
        console.log('✅ 无序列表创建成功！');
        console.log('✅ 列表内容:', li.textContent);
        
        // 检查样式
        const ulStyle = window.getComputedStyle(ul);
        const liStyle = window.getComputedStyle(li);
        console.log('✅ UL样式:', ulStyle.listStyleType, ulStyle.paddingLeft);
        console.log('✅ LI样式:', liStyle.fontSize, liStyle.display);
        
        // 选中列表项
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        // 第二次点击 - 取消列表格式
        console.log('✅ 第二次点击无序列表按钮（应该取消格式）...');
        ulButton.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const ulAfter = editor.querySelector('ul');
          
          if (paragraph && !ulAfter) {
            console.log('🎉 无序列表格式取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
            
            const paragraphStyle = window.getComputedStyle(paragraph);
            console.log('✅ 段落样式:', paragraphStyle.fontSize, paragraphStyle.display);
            
            if (paragraphStyle.fontSize === '16px') {
              console.log('🎉 段落字体大小正确：16px');
            } else {
              console.log('❌ 段落字体大小不正确:', paragraphStyle.fontSize);
            }
            
          } else {
            console.log('❌ 无序列表格式取消失败');
            console.log('✅ 段落存在:', !!paragraph);
            console.log('✅ UL仍然存在:', !!ulAfter);
          }
        }, 200);
        
      } else {
        console.log('❌ 无序列表创建失败');
        console.log('✅ UL存在:', !!ul);
        console.log('✅ LI存在:', !!li);
      }
    }, 200);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
  
  return true;
}

function testOrderedList() {
  console.log('\n📋 测试有序列表功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试有序列表功能';
  
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
    console.log('✅ 找到有序列表按钮');
    
    // 第一次点击 - 应用有序列表格式
    console.log('✅ 第一次点击有序列表按钮...');
    olButton.click();
    
    setTimeout(() => {
      const ol = editor.querySelector('ol');
      const li = editor.querySelector('li');
      
      if (ol && li) {
        console.log('✅ 有序列表创建成功！');
        console.log('✅ 列表内容:', li.textContent);
        
        // 检查样式
        const olStyle = window.getComputedStyle(ol);
        const liStyle = window.getComputedStyle(li);
        console.log('✅ OL样式:', olStyle.listStyleType, olStyle.paddingLeft);
        console.log('✅ LI样式:', liStyle.fontSize, liStyle.display);
        
        if (olStyle.listStyleType === 'decimal') {
          console.log('🎉 有序列表样式正确：decimal');
        } else {
          console.log('❌ 有序列表样式不正确:', olStyle.listStyleType);
        }
        
        // 选中列表项
        const liRange = document.createRange();
        liRange.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(liRange);
        
        // 第二次点击 - 取消列表格式
        console.log('✅ 第二次点击有序列表按钮（应该取消格式）...');
        olButton.click();
        
        setTimeout(() => {
          const paragraph = editor.querySelector('p');
          const olAfter = editor.querySelector('ol');
          
          if (paragraph && !olAfter) {
            console.log('🎉 有序列表格式取消成功！');
            console.log('✅ 转换为段落:', paragraph.textContent);
          } else {
            console.log('❌ 有序列表格式取消失败');
          }
        }, 200);
        
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
  console.log('\n📋 测试列表类型切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试列表切换功能';
  
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

function testMultipleListItems() {
  console.log('\n📋 测试多个列表项功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加多行测试文本
  editor.innerHTML = '第一项\n第二项\n第三项';
  
  // 选中所有文本
  const range = document.createRange();
  range.selectNodeContents(editor);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中多行文本:', selection.toString());
  
  // 查找无序列表按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮');
    
    // 点击创建列表
    console.log('✅ 创建多项目列表...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      const lis = editor.querySelectorAll('li');
      
      if (ul && lis.length > 0) {
        console.log('✅ 多项目列表创建成功！');
        console.log('✅ 列表项数量:', lis.length);
        
        lis.forEach((li, index) => {
          console.log(`✅ 第${index + 1}项:`, li.textContent);
        });
        
        // 检查样式
        const ulStyle = window.getComputedStyle(ul);
        console.log('✅ UL样式:', ulStyle.listStyleType, ulStyle.paddingLeft);
        
        if (ulStyle.listStyleType === 'disc') {
          console.log('🎉 无序列表样式正确：disc');
        } else {
          console.log('❌ 无序列表样式不正确:', ulStyle.listStyleType);
        }
        
      } else {
        console.log('❌ 多项目列表创建失败');
        console.log('✅ UL存在:', !!ul);
        console.log('✅ LI数量:', lis.length);
      }
    }, 200);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
  
  return true;
}

// 运行所有列表测试
function runAllListTests() {
  console.log('🚀 开始运行所有列表功能测试...\n');
  
  const results = {
    unorderedList: testUnorderedList(),
    orderedList: testOrderedList(),
    listToggle: testListToggle(),
    multipleItems: testMultipleListItems()
  };
  
  console.log('\n📊 列表功能测试结果汇总:');
  console.log('✅ 无序列表测试:', results.unorderedList ? '完成' : '失败');
  console.log('✅ 有序列表测试:', results.orderedList ? '完成' : '失败');
  console.log('✅ 列表切换测试:', results.listToggle ? '完成' : '失败');
  console.log('✅ 多项目测试:', results.multipleItems ? '完成' : '失败');
  
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

console.log('\n💡 列表功能说明:');
console.log('1. 无序列表：点击按钮创建带圆点的列表');
console.log('2. 有序列表：点击按钮创建带数字的列表');
console.log('3. 切换功能：再次点击相同按钮取消列表格式');
console.log('4. 类型切换：在无序和有序列表之间切换');
console.log('5. 多项目：支持多行文本转换为多个列表项');
console.log('6. 样式正确：列表项有正确的缩进和标记');
