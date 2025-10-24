// 富文本编辑器功能验证脚本
// 在浏览器控制台中运行此脚本来测试富文本编辑器功能

console.log('🚀 开始富文本编辑器功能验证...');

// 获取富文本编辑器元素
const editor = document.querySelector('[contentEditable]');
if (!editor) {
  console.error('❌ 未找到富文本编辑器元素');
} else {
  console.log('✅ 找到富文本编辑器元素');
  
  // 测试基础功能
  const testBasicFunctions = () => {
    console.log('\n📝 测试基础格式化功能...');
    
    // 测试粗体
    try {
      document.execCommand('bold', false);
      console.log('✅ 粗体功能正常');
    } catch (e) {
      console.error('❌ 粗体功能异常:', e);
    }
    
    // 测试斜体
    try {
      document.execCommand('italic', false);
      console.log('✅ 斜体功能正常');
    } catch (e) {
      console.error('❌ 斜体功能异常:', e);
    }
    
    // 测试下划线
    try {
      document.execCommand('underline', false);
      console.log('✅ 下划线功能正常');
    } catch (e) {
      console.error('❌ 下划线功能异常:', e);
    }
  };
  
  // 测试链接功能
  const testLinkFunctions = () => {
    console.log('\n🔗 测试链接功能...');
    
    // 检查是否有选中的文本
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      try {
        document.execCommand('createLink', false, 'https://example.com');
        console.log('✅ 创建链接功能正常');
      } catch (e) {
        console.error('❌ 创建链接功能异常:', e);
      }
    } else {
      console.log('⚠️ 请先选择一些文本来测试链接功能');
    }
  };
  
  // 测试命令状态检查
  const testCommandStates = () => {
    console.log('\n🔍 测试命令状态检查...');
    
    const commands = ['bold', 'italic', 'underline', 'strikeThrough'];
    commands.forEach(cmd => {
      try {
        const state = document.queryCommandState(cmd);
        console.log(`✅ ${cmd} 状态检查正常: ${state}`);
      } catch (e) {
        console.error(`❌ ${cmd} 状态检查异常:`, e);
      }
    });
  };
  
  // 测试撤销/重做
  const testUndoRedo = () => {
    console.log('\n↶↷ 测试撤销/重做功能...');
    
    try {
      const undoSupported = document.queryCommandSupported('undo');
      const redoSupported = document.queryCommandSupported('redo');
      console.log(`✅ 撤销支持: ${undoSupported}`);
      console.log(`✅ 重做支持: ${redoSupported}`);
    } catch (e) {
      console.error('❌ 撤销/重做功能异常:', e);
    }
  };
  
  // 测试字体大小
  const testFontSizes = () => {
    console.log('\n📏 测试字体大小功能...');
    
    const sizes = ['1', '2', '3', '4', '5', '6', '7'];
    sizes.forEach(size => {
      try {
        document.execCommand('fontSize', false, size);
        console.log(`✅ 字体大小 ${size} 功能正常`);
      } catch (e) {
        console.error(`❌ 字体大小 ${size} 功能异常:`, e);
      }
    });
  };
  
  // 测试颜色功能
  const testColors = () => {
    console.log('\n🎨 测试颜色功能...');
    
    const colors = ['#000000', '#C2A87A', '#dc2626', '#059669', '#2563eb'];
    colors.forEach(color => {
      try {
        document.execCommand('foreColor', false, color);
        console.log(`✅ 文字颜色 ${color} 功能正常`);
      } catch (e) {
        console.error(`❌ 文字颜色 ${color} 功能异常:`, e);
      }
    });
    
    const bgColors = ['#ffffff', '#fef3c7', '#fecaca', '#bbf7d0', '#bfdbfe'];
    bgColors.forEach(color => {
      try {
        document.execCommand('backColor', false, color);
        console.log(`✅ 背景颜色 ${color} 功能正常`);
      } catch (e) {
        console.error(`❌ 背景颜色 ${color} 功能异常:`, e);
      }
    });
  };
  
  // 测试对齐功能
  const testAlignment = () => {
    console.log('\n📐 测试对齐功能...');
    
    const alignments = ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
    alignments.forEach(align => {
      try {
        document.execCommand(align, false);
        console.log(`✅ ${align} 功能正常`);
      } catch (e) {
        console.error(`❌ ${align} 功能异常:`, e);
      }
    });
  };
  
  // 测试列表功能
  const testLists = () => {
    console.log('\n📋 测试列表功能...');
    
    try {
      document.execCommand('insertUnorderedList', false);
      console.log('✅ 无序列表功能正常');
    } catch (e) {
      console.error('❌ 无序列表功能异常:', e);
    }
    
    try {
      document.execCommand('insertOrderedList', false);
      console.log('✅ 有序列表功能正常');
    } catch (e) {
      console.error('❌ 有序列表功能异常:', e);
    }
  };
  
  // 测试标题功能
  const testHeadings = () => {
    console.log('\n📑 测试标题功能...');
    
    const headings = ['h1', 'h2', 'h3', 'p'];
    headings.forEach(heading => {
      try {
        document.execCommand('formatBlock', false, heading);
        console.log(`✅ ${heading} 标题功能正常`);
      } catch (e) {
        console.error(`❌ ${heading} 标题功能异常:`, e);
      }
    });
  };
  
  // 测试特殊功能
  const testSpecialFunctions = () => {
    console.log('\n⭐ 测试特殊功能...');
    
    try {
      document.execCommand('insertHorizontalRule', false);
      console.log('✅ 分割线功能正常');
    } catch (e) {
      console.error('❌ 分割线功能异常:', e);
    }
    
    try {
      document.execCommand('removeFormat', false);
      console.log('✅ 清除格式功能正常');
    } catch (e) {
      console.error('❌ 清除格式功能异常:', e);
    }
  };
  
  // 检查编辑器属性
  const checkEditorProperties = () => {
    console.log('\n🔧 检查编辑器属性...');
    
    console.log(`✅ contentEditable: ${editor.contentEditable}`);
    console.log(`✅ 最小高度: ${editor.style.minHeight || '未设置'}`);
    console.log(`✅ 占位符: ${editor.getAttribute('data-placeholder') || '未设置'}`);
    console.log(`✅ 类名: ${editor.className}`);
  };
  
  // 检查工具栏按钮
  const checkToolbarButtons = () => {
    console.log('\n🎛️ 检查工具栏按钮...');
    
    const buttons = document.querySelectorAll('[contentEditable] + div button');
    console.log(`✅ 找到 ${buttons.length} 个工具栏按钮`);
    
    buttons.forEach((button, index) => {
      const title = button.getAttribute('title');
      const disabled = button.disabled;
      console.log(`按钮 ${index + 1}: ${title || '无标题'} ${disabled ? '(禁用)' : '(启用)'}`);
    });
  };
  
  // 运行所有测试
  const runAllTests = () => {
    console.log('🎯 开始全面功能测试...\n');
    
    checkEditorProperties();
    checkToolbarButtons();
    testCommandStates();
    testBasicFunctions();
    testLinkFunctions();
    testUndoRedo();
    testFontSizes();
    testColors();
    testAlignment();
    testLists();
    testHeadings();
    testSpecialFunctions();
    
    console.log('\n🎉 功能验证完成！');
    console.log('📋 请查看上面的测试结果，确保所有功能都正常工作。');
  };
  
  // 执行测试
  runAllTests();
  
  // 提供手动测试指导
  console.log('\n📖 手动测试指导:');
  console.log('1. 在编辑器中输入一些文本');
  console.log('2. 选择文本并尝试各种格式化功能');
  console.log('3. 测试键盘快捷键 (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+K)');
  console.log('4. 尝试上传图片和视频');
  console.log('5. 测试链接的创建、编辑和删除');
  console.log('6. 测试路由标识的插入');
  console.log('7. 检查按钮的活动状态显示');
  console.log('8. 测试撤销/重做功能');
}
