# 富文本编辑器增强 - 图片和视频支持

## ✅ 完成的功能

### 1. **图片功能**
- ✅ 上传本地图片（文件选择）
- ✅ 通过URL插入图片
- ✅ 图片大小限制（5MB）
- ✅ 文件类型验证
- ✅ 图片自适应显示（max-width: 100%）
- ✅ 图片圆角美化（border-radius: 8px）
- ✅ 鼠标悬停效果

### 2. **视频功能**
- ✅ 上传本地视频（文件选择）
- ✅ 通过URL插入视频
- ✅ 视频大小限制（50MB）
- ✅ 文件类型验证
- ✅ 视频自适应显示（max-width: 100%）
- ✅ 自动添加播放控件
- ✅ 视频圆角美化

### 3. **用户体验优化**
- ✅ 上传进度指示（⏳图标）
- ✅ 上传时禁用按钮
- ✅ 错误提示（文件类型、大小、上传失败）
- ✅ 自动清空文件输入
- ✅ 智能光标位置插入

## 🎨 工具栏按钮布局

### 完整工具栏（从左到右）：
1. **B** - 粗体
2. **I** - 斜体
3. **U** - 下划线
4. **S** - 删除线
5. **|** 分隔线
6. **•** - 无序列表
7. **1.** - 有序列表
8. **|** 分隔线
9. **⊏** - 左对齐
10. **⊐** - 居中
11. **⊐** - 右对齐
12. **|** 分隔线
13. **🖼️** - 上传图片
14. **🎬** - 上传视频
15. **|** 分隔线
16. **✕** - 清除格式

### 已移除的功能：
- ❌ 标题选择下拉菜单（H1/H2/H3）
- ❌ 字体大小选择下拉菜单
- ❌ 插入链接按钮 (🔗)
- ❌ 图片URL按钮 (🏞️)
- ❌ 视频URL按钮 (📹)

### 上传状态：
- **正常**：显示对应图标 (🖼️ / 🎬)
- **上传中**：显示 ⏳ 图标，按钮禁用

## 📋 技术实现

### 文件上传
```typescript
// 使用现有的上传API
const UPLOAD_API = '/api/upload/form';

// 上传流程
1. 文件选择
2. 验证（类型、大小）
3. FormData上传
4. 获取URL
5. 插入编辑器
6. 触发onChange
```

### 文件验证

**图片限制：**
- 类型：`image/*`
- 大小：5MB
- 错误提示：`richEditor.invalidImageType`、`richEditor.imageTooLarge`

**视频限制：**
- 类型：`video/*`
- 大小：50MB
- 错误提示：`richEditor.invalidVideoType`、`richEditor.videoTooLarge`

### DOM插入逻辑

```typescript
// 创建元素
const img = document.createElement('img');
img.src = imageUrl;
img.style.maxWidth = '100%';
img.style.height = 'auto';
img.style.margin = '10px 0';

// 插入到光标位置
const selection = window.getSelection();
if (selection && selection.rangeCount > 0) {
  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(img);
  range.collapse(false);
} else {
  editorRef.current.appendChild(img);
}
```

## 🎯 样式优化

### CSS样式
```css
[contentEditable] img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 8px;
  display: block;
  cursor: pointer;
}

[contentEditable] img:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

[contentEditable] video {
  max-width: 100%;
  margin: 10px 0;
  border-radius: 8px;
  display: block;
}
```

## 🌐 国际化文本

需要添加到 `common.json`：

```json
{
  "richEditor": {
    // 现有翻译...
    "uploadImage": "上传图片",
    "uploadVideo": "上传视频",
    "insertImageUrl": "图片URL",
    "insertVideoUrl": "视频URL",
    "enterImageUrl": "请输入图片URL:",
    "enterVideoUrl": "请输入视频URL:",
    "invalidImageType": "请选择有效的图片文件",
    "invalidVideoType": "请选择有效的视频文件",
    "imageTooLarge": "图片大小不能超过5MB",
    "videoTooLarge": "视频大小不能超过50MB",
    "uploadFailed": "上传失败，请重试",
    "uploadError": "上传出错，请重试"
  }
}
```

## 📦 使用示例

### 在博客编辑器中使用
```tsx
<RichTextEditor
  value={form.content} 
  onChange={(value) => setForm({ ...form, content: value })}
  placeholder="请输入中文内容"
  minHeight="200px"
/>
```

### 功能流程

**上传图片：**
1. 点击 🖼️ 按钮
2. 选择图片文件
3. 自动验证并上传
4. 图片插入到编辑器
5. 可在编辑器中调整位置

**上传视频：**
1. 点击 🎬 按钮
2. 选择视频文件
3. 自动验证并上传
4. 视频插入到编辑器
5. 自动显示播放控件

## ⚠️ 注意事项

1. **文件大小限制**
   - 图片：最大5MB
   - 视频：最大50MB
   - 超过限制会弹窗提示

2. **文件类型验证**
   - 图片：只接受 `image/*` 类型
   - 视频：只接受 `video/*` 类型
   - 类型不符会弹窗提示

3. **上传API**
   - 使用现有的 `/api/upload/form` 接口
   - 需要返回格式：`{ success: true, data: { url: '...' } }`

4. **浏览器兼容性**
   - 使用标准的 `document.execCommand`
   - 支持现代浏览器
   - 图片和视频元素采用原生HTML5

## 🎉 优势

1. **简单易用**：一键上传，自动处理
2. **灵活多样**：支持上传和URL两种方式
3. **安全可靠**：文件验证，大小限制
4. **视觉美观**：圆角、阴影、悬停效果
5. **响应式**：图片和视频自适应容器宽度

## 🔄 后续可扩展

1. 图片裁剪功能
2. 图片压缩优化
3. 视频缩略图预览
4. 拖拽上传
5. 粘贴上传
6. 云存储集成
7. 图片Alt文本编辑
8. 视频播放器自定义

