// 标题样式测试脚本
// 在浏览器控制台中运行此脚本来测试标题样式

console.log('🎨 标题样式测试开始...');

function testHeadingStyles() {
  console.log('\n📋 测试标题样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试标题样式';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 测试H1样式
  console.log('✅ 测试H1样式...');
  
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
        
        // 检查样式
        const computedStyle = window.getComputedStyle(h1);
        console.log('✅ H1样式检查:');
        console.log('  - fontSize:', computedStyle.fontSize);
        console.log('  - fontWeight:', computedStyle.fontWeight);
        console.log('  - color:', computedStyle.color);
        console.log('  - margin:', computedStyle.margin);
        console.log('  - display:', computedStyle.display);
        
        // 检查内联样式
        console.log('✅ H1内联样式:');
        console.log('  - style.fontSize:', h1.style.fontSize);
        console.log('  - style.fontWeight:', h1.style.fontWeight);
        console.log('  - style.color:', h1.style.color);
        console.log('  - style.margin:', h1.style.margin);
        console.log('  - style.display:', h1.style.display);
        
        // 检查是否可见
        if (computedStyle.fontSize !== '16px' && computedStyle.fontWeight !== '400') {
          console.log('🎉 H1样式应用成功！');
        } else {
          console.log('❌ H1样式没有生效');
        }
      } else {
        console.log('❌ H1标题创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H1按钮');
  }
  
  return true;
}

// 测试H2样式
function testH2Styles() {
  console.log('\n📋 测试H2样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H2样式';
  
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
    console.log('✅ 找到H2按钮，点击...');
    
    // 点击按钮
    h2Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h2 = editor.querySelector('h2');
      if (h2) {
        console.log('✅ H2标题创建成功！');
        
        // 检查样式
        const computedStyle = window.getComputedStyle(h2);
        console.log('✅ H2样式检查:');
        console.log('  - fontSize:', computedStyle.fontSize);
        console.log('  - fontWeight:', computedStyle.fontWeight);
        console.log('  - color:', computedStyle.color);
        
        if (computedStyle.fontSize !== '16px' && computedStyle.fontWeight !== '400') {
          console.log('🎉 H2样式应用成功！');
        } else {
          console.log('❌ H2样式没有生效');
        }
      } else {
        console.log('❌ H2标题创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H2按钮');
  }
  
  return true;
}

// 测试H3样式
function testH3Styles() {
  console.log('\n📋 测试H3样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H3样式';
  
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
    console.log('✅ 找到H3按钮，点击...');
    
    // 点击按钮
    h3Button.click();
    
    // 检查结果
    setTimeout(() => {
      const h3 = editor.querySelector('h3');
      if (h3) {
        console.log('✅ H3标题创建成功！');
        
        // 检查样式
        const computedStyle = window.getComputedStyle(h3);
        console.log('✅ H3样式检查:');
        console.log('  - fontSize:', computedStyle.fontSize);
        console.log('  - fontWeight:', computedStyle.fontWeight);
        console.log('  - color:', computedStyle.color);
        
        if (computedStyle.fontSize !== '16px' && computedStyle.fontWeight !== '400') {
          console.log('🎉 H3样式应用成功！');
        } else {
          console.log('❌ H3样式没有生效');
        }
      } else {
        console.log('❌ H3标题创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到H3按钮');
  }
  
  return true;
}

// 运行所有测试
function runAllStyleTests() {
  console.log('🚀 开始运行所有样式测试...\n');
  
  const results = {
    h1: testHeadingStyles(),
    h2: testH2Styles(),
    h3: testH3Styles()
  };
  
  console.log('\n📊 样式测试结果汇总:');
  console.log('✅ H1样式测试:', results.h1 ? '完成' : '失败');
  console.log('✅ H2样式测试:', results.h2 ? '完成' : '失败');
  console.log('✅ H3样式测试:', results.h3 ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有样式测试完成！');
  } else {
    console.log('⚠️ 部分样式测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllStyleTests();

console.log('\n💡 样式修复说明:');
console.log('1. 添加了CSS样式规则，使用!important确保优先级');
console.log('2. 在创建元素时直接添加内联样式');
console.log('3. 确保样式立即生效，不依赖外部CSS');
console.log('4. H1: 2em, H2: 1.5em, H3: 1.17em 字体大小');
console.log('5. 所有标题都设置为粗体和适当的颜色');
