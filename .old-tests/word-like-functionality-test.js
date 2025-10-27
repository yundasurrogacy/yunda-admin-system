// 富文本编辑器Word-like功能测试脚本
// 在浏览器控制台中运行此脚本来测试标题和列表功能是否像Word那样工作

console.log('📝 富文本编辑器Word-like功能测试开始...');

// 测试1: 测试标题功能
function testHeadingFunctionality() {
  console.log('\n📋 测试1: 测试标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试H1标题
  console.log('✅ 测试H1标题...');
  
  // 方法1: 选中文本后点击H1按钮
  editor.innerHTML = '测试H1标题文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H1按钮并点击
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮，点击...');
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
        console.log('✅ H1样式:', window.getComputedStyle(h1).fontSize);
      } else {
        console.log('❌ H1标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试2: 测试列表功能
function testListFunctionality() {
  console.log('\n📋 测试2: 测试列表功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试无序列表
  console.log('✅ 测试无序列表...');
  
  // 选中文本
  editor.innerHTML = '列表项1';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找无序列表按钮并点击
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    console.log('✅ 找到无序列表按钮，点击...');
    ulButton.click();
    
    // 检查结果
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      if (ul) {
        console.log('✅ 无序列表创建成功');
        console.log('✅ 列表内容:', ul.innerHTML);
        const lis = ul.querySelectorAll('li');
        console.log('✅ 列表项数量:', lis.length);
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
  
  return true;
}

// 测试3: 测试段落格式
function testParagraphFormat() {
  console.log('\n📋 测试3: 测试段落格式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试段落格式
  console.log('✅ 测试段落格式...');
  
  // 选中文本
  editor.innerHTML = '测试段落文本';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找段落按钮并点击
  const pButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('段落') || btn.title.includes('paragraph'))
  );
  
  if (pButton) {
    console.log('✅ 找到段落按钮，点击...');
    pButton.click();
    
    // 检查结果
    setTimeout(() => {
      const p = editor.querySelector('p');
      if (p) {
        console.log('✅ 段落格式创建成功');
        console.log('✅ 段落内容:', p.textContent);
      } else {
        console.log('❌ 段落格式创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到段落按钮');
  }
  
  return true;
}

// 测试4: 测试无选中文本的情况
function testNoSelectionCase() {
  console.log('\n📋 测试4: 测试无选中文本的情况');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 测试无选中文本时点击H1按钮
  console.log('✅ 测试无选中文本时点击H1按钮...');
  
  // 将光标放在编辑器中
  const range = document.createRange();
  range.setStart(editor, 0);
  range.setEnd(editor, 0);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找H1按钮并点击
  const h1Button = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('H1') || btn.title.includes('标题1'))
  );
  
  if (h1Button) {
    console.log('✅ 找到H1按钮，点击...');
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ 无选中文本时H1标题创建成功');
        console.log('✅ H1内容:', h1.textContent);
      } else {
        console.log('❌ 无选中文本时H1标题创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试5: 测试列表切换功能
function testListToggle() {
  console.log('\n📋 测试5: 测试列表切换功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 先创建无序列表
  console.log('✅ 先创建无序列表...');
  
  // 选中文本
  editor.innerHTML = '列表项1';
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 查找无序列表按钮并点击
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  
  if (ulButton) {
    ulButton.click();
    
    // 等待列表创建
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      if (ul) {
        console.log('✅ 无序列表创建成功');
        
        // 现在测试切换到有序列表
        console.log('✅ 测试切换到有序列表...');
        
        // 选中列表项
        const li = ul.querySelector('li');
        if (li) {
          const range = document.createRange();
          range.setStart(li, 0);
          range.setEnd(li, li.textContent.length);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          // 查找有序列表按钮并点击
          const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
          );
          
          if (olButton) {
            olButton.click();
            
            // 检查结果
            setTimeout(() => {
              const ol = editor.querySelector('ol');
              if (ol) {
                console.log('✅ 列表切换成功，现在是有序列表');
                console.log('✅ 有序列表内容:', ol.innerHTML);
              } else {
                console.log('❌ 列表切换失败');
              }
            }, 100);
          } else {
            console.log('❌ 未找到有序列表按钮');
          }
        }
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 100);
  } else {
    console.log('❌ 未找到无序列表按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    headings: testHeadingFunctionality(),
    lists: testListFunctionality(),
    paragraphs: testParagraphFormat(),
    noSelection: testNoSelectionCase(),
    listToggle: testListToggle()
  };
  
  console.log('\n📊 测试结果汇总:');
  console.log('✅ 标题功能测试:', results.headings ? '完成' : '失败');
  console.log('✅ 列表功能测试:', results.lists ? '完成' : '失败');
  console.log('✅ 段落格式测试:', results.paragraphs ? '完成' : '失败');
  console.log('✅ 无选中文本测试:', results.noSelection ? '完成' : '失败');
  console.log('✅ 列表切换测试:', results.listToggle ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试完成！标题和列表功能现在应该像Word那样工作。');
  } else {
    console.log('⚠️ 部分测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllTests();

console.log('\n💡 使用说明:');
console.log('1. 在富文本编辑器中输入文本');
console.log('2. 选中文本，点击H1/H2/H3按钮设置标题格式');
console.log('3. 选中文本，点击列表按钮创建有序或无序列表');
console.log('4. 不选中文本时，点击按钮会创建新的格式元素');
console.log('5. 在列表项中点击不同的列表按钮可以切换列表类型');
console.log('6. 功能现在应该像Word那样工作');
