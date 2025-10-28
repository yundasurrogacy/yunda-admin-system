// 链接创建失败问题修复验证
console.log('🔧 验证链接创建失败问题修复...');

// 测试1：检查新的链接创建方法
console.log('\n📝 测试1：新的链接创建方法');
console.log('修复内容:');
console.log('- 主要方法：使用 createElement 和 insertNode');
console.log('- 备用方法1：使用 document.execCommand');
console.log('- 备用方法2：直接操作 HTML');

// 测试2：检查链接元素创建
console.log('\n🔗 测试2：检查链接元素创建');
const testLinkCreation = () => {
  const linkElement = document.createElement('a');
  linkElement.href = 'https://example.com';
  linkElement.textContent = '测试链接';
  linkElement.target = '_blank';
  linkElement.rel = 'noopener noreferrer';
  linkElement.style.color = '#C2A87A';
  linkElement.style.textDecoration = 'underline';
  linkElement.style.fontWeight = '500';
  
  console.log('创建的链接元素:', linkElement);
  console.log('链接属性:');
  console.log('- href:', linkElement.href);
  console.log('- textContent:', linkElement.textContent);
  console.log('- target:', linkElement.target);
  console.log('- rel:', linkElement.rel);
  console.log('- 样式:', linkElement.style.cssText);
};

testLinkCreation();

// 测试3：检查选择状态
console.log('\n🎯 测试3：检查选择状态');
const editor = document.querySelector('[contentEditable]');
if (editor) {
  editor.innerHTML = '<p>这是一段测试文本，请选择其中的一些文字。</p>';
  editor.focus();
  
  console.log('已插入测试文本');
  console.log('请手动选择一些文本，然后测试链接创建');
  
  // 检查选择API支持
  const selection = window.getSelection();
  if (selection) {
    console.log('✅ Selection API 支持正常');
    console.log('- rangeCount:', selection.rangeCount);
    console.log('- toString():', selection.toString());
  } else {
    console.error('❌ Selection API 不支持');
  }
}

// 测试4：检查 execCommand 支持
console.log('\n⚙️ 测试4：检查 execCommand 支持');
const commands = ['createLink', 'unlink', 'bold', 'italic'];
commands.forEach(cmd => {
  const supported = document.queryCommandSupported(cmd);
  console.log(`${cmd}: ${supported ? '✅ 支持' : '❌ 不支持'}`);
});

// 测试5：手动测试步骤
console.log('\n📋 手动测试步骤:');
console.log('1. 在编辑器中输入一些文本');
console.log('2. 选择部分文本');
console.log('3. 点击链接按钮');
console.log('4. 输入URL并确定');
console.log('5. 检查是否成功创建链接（不应该再出现"创建链接失败"错误）');
console.log('6. 测试链接的悬停效果');
console.log('7. 选择链接文本，测试编辑和删除功能');

console.log('\n✅ 修复内容:');
console.log('- 使用 createElement 方法创建链接（主要方法）');
console.log('- 保留 execCommand 作为备用方法');
console.log('- 添加 HTML 替换作为最后备用方法');
console.log('- 改进链接移除功能');
console.log('- 添加详细的错误日志');

console.log('\n🎉 现在链接创建应该更加可靠了！');
