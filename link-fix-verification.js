// 链接功能修复验证测试
console.log('🔗 验证链接功能修复...');

// 测试1：检查没有选中文本时的行为
console.log('\n📝 测试1：没有选中文本时点击链接按钮');
console.log('预期：应该显示提示"请先选择要添加链接的文本"');

// 测试2：检查链接样式
console.log('\n🎨 测试2：检查链接样式');
const editor = document.querySelector('[contentEditable]');
if (editor) {
  // 插入一个测试链接
  editor.innerHTML = '<p>这是一个<a href="https://example.com">测试链接</a></p>';
  
  const link = editor.querySelector('a');
  if (link) {
    const styles = window.getComputedStyle(link);
    console.log('链接样式检查:');
    console.log('- 颜色:', styles.color);
    console.log('- 字体粗细:', styles.fontWeight);
    console.log('- 下划线:', styles.textDecoration);
    console.log('- 边框:', styles.borderBottom);
    
    // 检查悬停效果
    console.log('\n🖱️ 悬停效果测试:');
    console.log('请将鼠标悬停在链接上，应该看到:');
    console.log('- 颜色变深');
    console.log('- 背景色变化');
    console.log('- 圆角效果');
  }
}

// 测试3：手动测试步骤
console.log('\n📋 手动测试步骤:');
console.log('1. 在编辑器中输入一些文本');
console.log('2. 不选择任何文本，直接点击链接按钮');
console.log('3. 应该看到提示"请先选择要添加链接的文本"');
console.log('4. 选择一些文本，然后点击链接按钮');
console.log('5. 输入URL并确定');
console.log('6. 检查选中的文本是否变成了明显的链接');

console.log('\n✅ 修复内容:');
console.log('- 必须选中文本才能创建链接');
console.log('- 链接有明显的视觉样式（颜色、下划线、悬停效果）');
console.log('- 没有选中文本时会显示提示');
