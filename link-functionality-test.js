// 富文本编辑器链接功能测试
// 在浏览器控制台中运行此脚本来测试链接功能

console.log('🔗 开始测试富文本编辑器链接功能...');

// 获取富文本编辑器元素
const editor = document.querySelector('[contentEditable]');
if (!editor) {
  console.error('❌ 未找到富文本编辑器元素');
} else {
  console.log('✅ 找到富文本编辑器元素');
  
  // 测试1：检查链接按钮是否存在
  const linkButton = document.querySelector('button[title*="插入链接"], button[title*="createLink"]');
  if (linkButton) {
    console.log('✅ 找到链接按钮');
  } else {
    console.error('❌ 未找到链接按钮');
  }
  
  // 测试2：检查链接模态框是否存在
  const linkModal = document.querySelector('[class*="absolute"][class*="z-50"]');
  if (linkModal) {
    console.log('✅ 找到链接模态框容器');
  } else {
    console.log('⚠️ 链接模态框可能未显示');
  }
  
  // 测试3：测试选择文本功能
  const testTextSelection = () => {
    console.log('\n📝 测试文本选择功能...');
    
    // 在编辑器中插入一些测试文本
    editor.innerHTML = '<p>这是一段测试文本，请选择其中的一些文字。</p>';
    editor.focus();
    
    console.log('✅ 已插入测试文本');
    console.log('📖 请手动选择一些文本，然后点击链接按钮测试');
  };
  
  // 测试4：测试链接创建命令
  const testLinkCommand = () => {
    console.log('\n🔗 测试链接创建命令...');
    
    try {
      // 先插入一些文本
      editor.innerHTML = '<p>测试链接文本</p>';
      editor.focus();
      
      // 选择文本
      const range = document.createRange();
      const textNode = editor.querySelector('p')?.firstChild;
      if (textNode) {
        range.setStart(textNode, 0);
        range.setEnd(textNode, 4); // 选择前4个字符
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        // 尝试创建链接
        const success = document.execCommand('createLink', false, 'https://example.com');
        if (success) {
          console.log('✅ 链接创建命令执行成功');
          console.log('📄 编辑器内容:', editor.innerHTML);
        } else {
          console.error('❌ 链接创建命令执行失败');
        }
      }
    } catch (error) {
      console.error('❌ 链接创建测试出错:', error);
    }
  };
  
  // 测试5：检查链接样式
  const testLinkStyles = () => {
    console.log('\n🎨 检查链接样式...');
    
    const links = editor.querySelectorAll('a');
    if (links.length > 0) {
      console.log(`✅ 找到 ${links.length} 个链接`);
      links.forEach((link, index) => {
        console.log(`链接 ${index + 1}:`, {
          href: link.getAttribute('href'),
          text: link.textContent,
          target: link.getAttribute('target'),
          rel: link.getAttribute('rel')
        });
      });
    } else {
      console.log('⚠️ 未找到任何链接');
    }
  };
  
  // 运行所有测试
  const runAllTests = () => {
    console.log('🎯 开始链接功能测试...\n');
    
    testTextSelection();
    testLinkCommand();
    testLinkStyles();
    
    console.log('\n📋 手动测试步骤:');
    console.log('1. 在编辑器中输入一些文本');
    console.log('2. 选择部分文本');
    console.log('3. 点击链接按钮 (🔗)');
    console.log('4. 在弹出框中输入URL');
    console.log('5. 点击确定按钮');
    console.log('6. 检查文本是否变成了可点击的链接');
    console.log('7. 测试键盘快捷键 Ctrl+K');
    console.log('8. 测试没有选中文本时的链接插入');
    
    console.log('\n🎉 链接功能测试完成！');
  };
  
  // 执行测试
  runAllTests();
}
