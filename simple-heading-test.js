// 简单的标题功能测试脚本
// 在浏览器控制台中运行此脚本来测试标题功能

console.log('🔧 简单标题功能测试开始...');

function testHeadingFunction() {
  console.log('\n📋 测试标题功能');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试标题功能';
  
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
    console.log('✅ 找到H1按钮，点击...');
    
    // 点击按钮
    h1Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h1 = editor.querySelector('h1');
      if (h1) {
        console.log('✅ H1标题创建成功！');
        console.log('✅ H1内容:', h1.textContent);
        console.log('✅ 编辑器内容:', editor.innerHTML);
      } else {
        console.log('❌ H1标题创建失败');
        console.log('❌ 编辑器内容:', editor.innerHTML);
      }
    }, 200);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 运行测试
testHeadingFunction();

console.log('\n💡 如果标题功能仍然不工作，请检查：');
console.log('1. 按钮是否正确配置');
console.log('2. executeCommand函数是否正确调用applyBlockFormat');
console.log('3. applyBlockFormat函数是否正确实现');
console.log('4. 是否有JavaScript错误');
