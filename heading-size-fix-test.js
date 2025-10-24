// 标题字体大小累积问题修复测试脚本
// 在浏览器控制台中运行此脚本来测试修复后的标题功能

console.log('🔧 标题字体大小累积问题修复测试开始...');

function testHeadingSizeFix() {
  console.log('\n📋 测试标题字体大小修复');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return false;
  }
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试标题大小修复';
  
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
        
        // 检查是否是正确的尺寸
        if (computedStyle.fontSize === '32px') {
          console.log('🎉 H1字体大小正确：32px');
        } else {
          console.log('❌ H1字体大小不正确:', computedStyle.fontSize);
        }
        
        // 测试多次点击是否会导致字体变大
        console.log('✅ 测试多次点击是否会导致字体变大...');
        
        // 再次选中H1文本
        const h1Range = document.createRange();
        h1Range.selectNodeContents(h1);
        selection.removeAllRanges();
        selection.addRange(h1Range);
        
        // 再次点击H1按钮
        h1Button.click();
        
        setTimeout(() => {
          const h1After = editor.querySelector('h1');
          if (h1After) {
            const computedStyleAfter = window.getComputedStyle(h1After);
            console.log('✅ 再次点击后的H1样式:');
            console.log('  - fontSize:', computedStyleAfter.fontSize);
            
            if (computedStyleAfter.fontSize === '32px') {
              console.log('🎉 多次点击后字体大小保持正确：32px');
            } else {
              console.log('❌ 多次点击后字体大小发生变化:', computedStyleAfter.fontSize);
            }
          }
        }, 200);
        
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
function testH2SizeFix() {
  console.log('\n📋 测试H2样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H2大小修复';
  
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
        
        if (computedStyle.fontSize === '24px') {
          console.log('🎉 H2字体大小正确：24px');
        } else {
          console.log('❌ H2字体大小不正确:', computedStyle.fontSize);
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
function testH3SizeFix() {
  console.log('\n📋 测试H3样式');
  
  const editor = document.querySelector('[contentEditable]');
  if (!editor) return false;
  
  // 清空编辑器
  editor.innerHTML = '';
  
  // 添加测试文本
  editor.innerHTML = '测试H3大小修复';
  
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
        
        if (computedStyle.fontSize === '18px') {
          console.log('🎉 H3字体大小正确：18px');
        } else {
          console.log('❌ H3字体大小不正确:', computedStyle.fontSize);
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
function runAllSizeFixTests() {
  console.log('🚀 开始运行所有字体大小修复测试...\n');
  
  const results = {
    h1: testHeadingSizeFix(),
    h2: testH2SizeFix(),
    h3: testH3SizeFix()
  };
  
  console.log('\n📊 字体大小修复测试结果汇总:');
  console.log('✅ H1字体大小测试:', results.h1 ? '完成' : '失败');
  console.log('✅ H2字体大小测试:', results.h2 ? '完成' : '失败');
  console.log('✅ H3字体大小测试:', results.h3 ? '完成' : '失败');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 总体结果: ${passedTests}/${totalTests} 测试完成`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有字体大小修复测试完成！');
  } else {
    console.log('⚠️ 部分字体大小修复测试完成，请检查相关功能。');
  }
  
  return results;
}

// 自动运行测试
runAllSizeFixTests();

console.log('\n💡 字体大小累积问题修复说明:');
console.log('1. 问题：使用em单位会导致字体大小累积');
console.log('2. 修复：改用px单位，避免累积计算');
console.log('3. H1: 32px, H2: 24px, H3: 18px, P: 16px');
console.log('4. 多次点击标题按钮不会导致字体变大');
console.log('5. 字体大小保持稳定和一致');
