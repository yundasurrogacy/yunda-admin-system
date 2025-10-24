// 简单列表切换测试
// 在浏览器控制台中运行此脚本来快速测试列表切换功能

console.log('🔧 简单列表切换测试开始...');

function quickListToggleTest() {
  const editor = document.querySelector('[contentEditable]');
  if (!editor) {
    console.error('❌ 未找到富文本编辑器');
    return;
  }
  
  console.log('\n📋 快速测试列表切换功能');
  
  // 清空编辑器并添加测试文本
  editor.innerHTML = '测试列表切换功能';
  
  // 选中文本
  const textNode = editor.firstChild;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  console.log('✅ 选中文本:', selection.toString());
  
  // 查找按钮
  const ulButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('无序列表') || btn.title.includes('bulletList'))
  );
  const olButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.title && (btn.title.includes('有序列表') || btn.title.includes('numberList'))
  );
  
  if (ulButton && olButton) {
    console.log('✅ 找到列表按钮');
    
    // 测试无序列表切换
    console.log('\n📋 测试无序列表切换:');
    console.log('1. 创建无序列表...');
    ulButton.click();
    
    setTimeout(() => {
      const ul = editor.querySelector('ul');
      if (ul) {
        console.log('✅ 无序列表创建成功');
        console.log('2. 取消无序列表...');
        ulButton.click();
        
        setTimeout(() => {
          const ulAfter = editor.querySelector('ul');
          const p = editor.querySelector('p');
          if (!ulAfter && p) {
            console.log('✅ 无序列表取消成功，转换为段落');
          } else {
            console.log('❌ 无序列表取消失败');
          }
          
          // 测试有序列表切换
          console.log('\n📋 测试有序列表切换:');
          console.log('1. 创建有序列表...');
          olButton.click();
          
          setTimeout(() => {
            const ol = editor.querySelector('ol');
            if (ol) {
              console.log('✅ 有序列表创建成功');
              console.log('2. 取消有序列表...');
              olButton.click();
              
              setTimeout(() => {
                const olAfter = editor.querySelector('ol');
                const p2 = editor.querySelector('p');
                if (!olAfter && p2) {
                  console.log('✅ 有序列表取消成功，转换为段落');
                } else {
                  console.log('❌ 有序列表取消失败');
                }
                
                // 测试列表类型切换
                console.log('\n📋 测试列表类型切换:');
                console.log('1. 创建无序列表...');
                ulButton.click();
                
                setTimeout(() => {
                  const ul2 = editor.querySelector('ul');
                  if (ul2) {
                    console.log('✅ 无序列表创建成功');
                    console.log('2. 切换到有序列表...');
                    olButton.click();
                    
                    setTimeout(() => {
                      const ol2 = editor.querySelector('ol');
                      const ul2After = editor.querySelector('ul');
                      if (!ul2After && ol2) {
                        console.log('✅ 列表类型切换成功：无序列表 → 有序列表');
                      } else {
                        console.log('❌ 列表类型切换失败');
                      }
                      
                      console.log('\n🎯 测试完成！');
                      console.log('✅ 如果看到"✅"消息，说明切换功能正常');
                      console.log('✅ 列表应该可以正确创建、取消和切换');
                      
                    }, 200);
                  } else {
                    console.log('❌ 无序列表创建失败');
                  }
                }, 200);
                
              }, 200);
            } else {
              console.log('❌ 有序列表创建失败');
            }
          }, 200);
          
        }, 200);
      } else {
        console.log('❌ 无序列表创建失败');
      }
    }, 200);
  } else {
    console.log('❌ 未找到列表按钮');
  }
}

// 运行测试
quickListToggleTest();
