# 信托账户"余额调整"国际化修复

## 🔍 问题描述

用户反馈："Balance Adjustment 和 余额调整似乎没有实现国际化"

### 问题根源

当管理员或客户经理修改信托账户余额时，系统会自动创建一条交易记录，其 `remark` 字段被设置为 `t('trustAccount.balanceAdjustment', 'Balance Adjustment')`。

这个国际化后的值会被**保存到数据库**中（例如保存为 "余额调整" 或 "Balance Adjustment"）。

但是在表格中显示时，代码直接显示了数据库中存储的原始字符串，而没有重新进行国际化转换。这导致：

- **中文环境下保存的记录**：remark 存储为 "余额调整"
- **英文环境下保存的记录**：remark 存储为 "Balance Adjustment"
- **切换语言后**：显示的仍然是数据库中存储的原始语言，而不会跟随当前语言切换

### 问题示例

```typescript
// 保存余额调整记录时（在中文环境）
const payload = {
  remark: t('trustAccount.balanceAdjustment', 'Balance Adjustment'), // → "余额调整"
  // ... 其他字段
};
// 保存到数据库：remark = "余额调整"

// 显示时（无论当前语言）
<td>{change.remark ?? '-'}</td>  // ❌ 直接显示 "余额调整"，不会跟随语言切换
```

## ✅ 修复方案

### 解决思路

在显示 `remark` 字段时，检查其值是否为特殊的"余额调整"关键字（中文或英文），如果是，则重新进行国际化转换，否则直接显示原值。

### 修复代码

```typescript
// ✅ 修复后
<td className="py-2 px-4 whitespace-nowrap">
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    : (change.remark ?? '-')}
</td>
```

### 工作原理

1. **检查 remark 值**：判断是否为 `'余额调整'` 或 `'Balance Adjustment'`
2. **重新国际化**：如果匹配，调用 `t('trustAccount.balanceAdjustment', 'Balance Adjustment')` 获取当前语言的翻译
3. **直接显示**：如果不匹配，说明是用户手动输入的备注，直接显示原值

## 📁 修复的文件

### 1. Admin 页面 (`src/app/admin/trust-account/page.tsx`)

**修改位置**：Line 674-678

```typescript
// 修复前
<td className="py-2 px-4 whitespace-nowrap">{change.remark ?? '-'}</td>

// 修复后
<td className="py-2 px-4 whitespace-nowrap">
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    : (change.remark ?? '-')}
</td>
```

### 2. Client Manager 页面 (`src/app/client-manager/trust-account/page.tsx`)

**修改位置**：Line 667-671

```typescript
// 修复前
<td className="py-2 px-4 whitespace-nowrap">{change.remark ?? '-'}</td>

// 修复后
<td className="py-2 px-4 whitespace-nowrap">
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    : (change.remark ?? '-')}
</td>
```

### 3. Client 页面 (`src/app/client/trust-account/page.tsx`)

**修改位置**：Line 350-354

```typescript
// 修复前
<td className="py-2 px-4 whitespace-nowrap">{change.remark ?? '-'}</td>

// 修复后
<td className="py-2 px-4 whitespace-nowrap">
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    : (change.remark ?? '-')}
</td>
```

### 4. Surrogacy 页面 (`src/app/surrogacy/trust-account/page.tsx`)

**修改位置**：Line 212-216

```typescript
// 修复前
<td className="py-2 px-4 whitespace-nowrap">{change.remark ?? '-'}</td>

// 修复后
<td className="py-2 px-4 whitespace-nowrap">
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    : (change.remark ?? '-')}
</td>
```

## 🎯 修复效果

### 修复前

| 保存语言 | 数据库存储 | 中文显示 | 英文显示 |
|---------|-----------|---------|---------|
| 中文 | "余额调整" | ✅ 余额调整 | ❌ 余额调整 (没有翻译) |
| 英文 | "Balance Adjustment" | ❌ Balance Adjustment (没有翻译) | ✅ Balance Adjustment |

### 修复后

| 保存语言 | 数据库存储 | 中文显示 | 英文显示 |
|---------|-----------|---------|---------|
| 中文 | "余额调整" | ✅ 余额调整 | ✅ Balance Adjustment |
| 英文 | "Balance Adjustment" | ✅ 余额调整 | ✅ Balance Adjustment |

### 实际效果

#### **场景 1：在中文环境下保存的余额调整记录**
```typescript
// 数据库中的记录
{
  remark: "余额调整",
  change_type: "OTHER",
  change_amount: 1000
}

// 中文环境显示
remark: "余额调整" ✅

// 切换到英文环境显示
remark: "Balance Adjustment" ✅  // 自动翻译
```

#### **场景 2：在英文环境下保存的余额调整记录**
```typescript
// 数据库中的记录
{
  remark: "Balance Adjustment",
  change_type: "OTHER",
  change_amount: 1000
}

// 英文环境显示
remark: "Balance Adjustment" ✅

// 切换到中文环境显示
remark: "余额调整" ✅  // 自动翻译
```

#### **场景 3：用户手动输入的备注**
```typescript
// 数据库中的记录
{
  remark: "客户要求的特殊调整",
  change_type: "OTHER",
  change_amount: 500
}

// 任何语言环境显示
remark: "客户要求的特殊调整" ✅  // 保持原样
```

## 📊 国际化配置验证

### 中文配置 (`public/locales/zh-CN/common.json`)

```json
{
  "trustAccount": {
    "balanceAdjustment": "余额调整",
    // ... 其他字段
  }
}
```

### 英文配置 (`public/locales/en/common.json`)

```json
{
  "trustAccount": {
    "balanceAdjustment": "Balance Adjustment",
    // ... 其他字段
  }
}
```

## 🔄 完整的数据流

### 1. 保存余额调整

```typescript
// Admin/Manager 点击余额进行编辑
handleSaveBalance() {
  const payload = {
    // ... 其他字段
    remark: t('trustAccount.balanceAdjustment', 'Balance Adjustment'),
    // 中文环境 → "余额调整"
    // 英文环境 → "Balance Adjustment"
  };
  
  // 保存到数据库
  fetch('/api/trust-account/change', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
```

### 2. 显示余额调整

```typescript
// 从数据库读取记录
const change = {
  remark: "余额调整" // 或 "Balance Adjustment"
};

// 显示在表格中
<td>
  {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
    ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
    // 中文环境 → "余额调整"
    // 英文环境 → "Balance Adjustment"
    : (change.remark ?? '-')}
</td>
```

## ✅ 验证结果

### 语法检查
```bash
✅ No linter errors found.
```

### 影响范围
- ✅ Admin 页面：余额调整记录国际化显示正常
- ✅ Client Manager 页面：余额调整记录国际化显示正常
- ✅ Client 页面：余额调整记录国际化显示正常（只读）
- ✅ Surrogacy 页面：余额调整记录国际化显示正常（只读）

### 兼容性
- ✅ 向后兼容：现有数据库中的 "余额调整" 和 "Balance Adjustment" 记录都能正确显示
- ✅ 用户备注：用户手动输入的其他备注不受影响
- ✅ 语言切换：切换语言后，余额调整记录能正确翻译

## 🎉 总结

### 修复内容
- ✅ **4 个页面**全部修复
- ✅ 检测数据库中存储的 "余额调整" 或 "Balance Adjustment"
- ✅ 在显示时重新进行国际化转换
- ✅ 保持用户自定义备注不变

### 解决的问题
- ✅ "余额调整" 和 "Balance Adjustment" 现在可以跟随语言切换
- ✅ 中文环境保存的记录在英文环境下显示为 "Balance Adjustment"
- ✅ 英文环境保存的记录在中文环境下显示为 "余额调整"
- ✅ 所有页面显示一致

### 技术方案优势
1. **简单高效**：只需在显示层做判断，不需要修改数据库
2. **向后兼容**：现有数据不需要迁移
3. **易于维护**：逻辑清晰，容易理解和扩展
4. **性能良好**：简单的字符串比较，性能开销可忽略

现在"余额调整"记录会根据当前语言环境正确显示对应的翻译！🎊✨

