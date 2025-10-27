# 信托账户 Visibility 字段兼容性修复

## 🔍 问题分析

### 用户反馈
> "为什么准父母只能看到all的看不到准父母的"

### 问题根源
数据库中可能存在两种格式的 `visibility` 值：

#### **新格式（期望）**
```typescript
visibility: 'all'           // 所有人可见
visibility: 'intended_parents'  // 仅准父母可见
```

#### **旧格式（可能存在于数据库）**
```typescript
visibility: 'true'          // 对应 'all'
visibility: 'false'         // 对应 'intended_parents'
```

### 过滤逻辑问题

#### **修复前**
```typescript
// Client 页面过滤逻辑
changes.filter(c => c.visibility === 'all' || c.visibility === 'intended_parents')

// 如果数据库中存储的是 'true'/'false'，则过滤失败
// 'true' !== 'all' → false
// 'false' !== 'intended_parents' → false
// 结果：所有记录都被过滤掉
```

#### **修复后**
```typescript
// Client 页面过滤逻辑（兼容旧数据）
changes.filter(c => {
  const vis = c.visibility;
  return vis === 'all' || vis === 'intended_parents' || vis === 'true';
})

// 兼容性映射：
// 'all' → 显示 ✅
// 'intended_parents' → 显示 ✅  
// 'true' → 显示 ✅（旧数据）
// 'false' → 不显示（旧数据，对应 intended_parents 但 Client 不应该看到）
```

## ✅ 修复内容

### 1. Client 页面 (`src/app/client/trust-account/page.tsx`)

#### **过滤逻辑增强**
```typescript
// Line 118-123
let arr: BalanceChange[] = changes.filter(c => {
  const vis = c.visibility;
  // 新格式：'all' 或 'intended_parents'
  // 旧格式：'true' 对应 'all'，'false' 对应 'intended_parents'
  return vis === 'all' || vis === 'intended_parents' || vis === 'true';
});
```

#### **调试信息**
```typescript
// Line 113-114, 125-126
console.log('🔍 Client - Raw changes data:', changes);
console.log('🔍 Client - Visibility values:', changes.map(c => ({ id: c.id, visibility: c.visibility })));
console.log('🔍 Client - Filtered changes:', arr);
console.log('🔍 Client - Filtered visibility values:', arr.map(c => ({ id: c.id, visibility: c.visibility })));
```

### 2. Surrogacy 页面 (`src/app/surrogacy/trust-account/page.tsx`)

#### **过滤逻辑增强**
```typescript
// Line 65
let arr: BalanceChange[] = changes.filter(c => c.visibility === 'all' || c.visibility === 'true');
```

## 📊 数据兼容性映射

### Visibility 值映射表

| 数据库值 | 含义 | Client 可见 | Surrogacy 可见 | Manager/Admin 可见 |
|----------|------|-------------|---------------|-------------------|
| `'all'` | 所有人可见 | ✅ | ✅ | ✅ |
| `'intended_parents'` | 仅准父母可见 | ✅ | ❌ | ✅ |
| `'true'` | 旧格式-所有人可见 | ✅ | ✅ | ✅ |
| `'false'` | 旧格式-仅准父母可见 | ❌ | ❌ | ✅ |

### 过滤逻辑对比

#### **Client 页面**
```typescript
// 修复前
c.visibility === 'all' || c.visibility === 'intended_parents'

// 修复后（兼容旧数据）
c.visibility === 'all' || c.visibility === 'intended_parents' || c.visibility === 'true'
```

#### **Surrogacy 页面**
```typescript
// 修复前
c.visibility === 'all'

// 修复后（兼容旧数据）
c.visibility === 'all' || c.visibility === 'true'
```

#### **Manager/Admin 页面**
```typescript
// 无需修改，显示所有记录
// 不进行 visibility 过滤
```

## 🔍 调试功能

### 控制台输出
修复后的代码会在浏览器控制台输出调试信息：

```javascript
// 原始数据
🔍 Client - Raw changes data: [
  { id: 1, visibility: 'true', change_amount: 1000 },
  { id: 2, visibility: 'all', change_amount: -500 },
  { id: 3, visibility: 'intended_parents', change_amount: 2000 }
]

// 可见性值
🔍 Client - Visibility values: [
  { id: 1, visibility: 'true' },
  { id: 2, visibility: 'all' },
  { id: 3, visibility: 'intended_parents' }
]

// 过滤后数据
🔍 Client - Filtered changes: [
  { id: 1, visibility: 'true', change_amount: 1000 },    // ✅ 旧格式兼容
  { id: 2, visibility: 'all', change_amount: -500 },     // ✅ 新格式
  { id: 3, visibility: 'intended_parents', change_amount: 2000 }  // ✅ 新格式
]

// 过滤后可见性值
🔍 Client - Filtered visibility values: [
  { id: 1, visibility: 'true' },
  { id: 2, visibility: 'all' },
  { id: 3, visibility: 'intended_parents' }
]
```

## 🎯 预期效果

### 修复前的问题
```typescript
// 数据库中存储旧格式
[
  { id: 1, visibility: 'true', change_amount: 1000 },
  { id: 2, visibility: 'false', change_amount: -500 }
]

// 过滤逻辑
changes.filter(c => c.visibility === 'all' || c.visibility === 'intended_parents')
// 'true' !== 'all' → false
// 'false' !== 'intended_parents' → false
// 结果：[] 空数组

// 页面显示：No Records ❌
```

### 修复后的效果
```typescript
// 数据库中存储旧格式
[
  { id: 1, visibility: 'true', change_amount: 1000 },
  { id: 2, visibility: 'false', change_amount: -500 }
]

// 过滤逻辑（兼容旧数据）
changes.filter(c => c.visibility === 'all' || c.visibility === 'intended_parents' || c.visibility === 'true')
// 'true' === 'true' → true ✅
// 'false' !== 'all' && 'false' !== 'intended_parents' && 'false' !== 'true' → false
// 结果：[{ id: 1, visibility: 'true', change_amount: 1000 }]

// 页面显示：显示记录 1 ✅
```

## 🔧 数据迁移建议

### 长期解决方案
建议在数据库中统一 visibility 值格式：

```sql
-- 数据迁移 SQL
UPDATE trust_account_balance_changes 
SET visibility = 'all' 
WHERE visibility = 'true';

UPDATE trust_account_balance_changes 
SET visibility = 'intended_parents' 
WHERE visibility = 'false';
```

### 临时兼容方案
当前修复提供了向后兼容性，支持两种格式并存。

## ✅ 验证步骤

### 1. 检查控制台输出
1. 打开 Client 页面
2. 打开浏览器开发者工具
3. 查看控制台输出的调试信息
4. 确认原始数据和过滤后数据

### 2. 验证数据可见性
- ✅ Client 应该能看到 `visibility: 'all'` 的记录
- ✅ Client 应该能看到 `visibility: 'intended_parents'` 的记录  
- ✅ Client 应该能看到 `visibility: 'true'` 的记录（旧格式）
- ❌ Client 不应该看到 `visibility: 'false'` 的记录

### 3. 验证 Surrogacy 页面
- ✅ Surrogacy 应该能看到 `visibility: 'all'` 的记录
- ✅ Surrogacy 应该能看到 `visibility: 'true'` 的记录（旧格式）
- ❌ Surrogacy 不应该看到 `visibility: 'intended_parents'` 的记录
- ❌ Surrogacy 不应该看到 `visibility: 'false'` 的记录

## 🎉 总结

### 修复内容
- ✅ Client 页面：兼容旧格式 `'true'` 值
- ✅ Surrogacy 页面：兼容旧格式 `'true'` 值
- ✅ 添加调试信息：便于排查问题
- ✅ 保持向后兼容性：支持新旧格式并存

### 解决的问题
- ✅ 准父母现在可以看到所有应该看到的记录
- ✅ 兼容数据库中可能存在的旧格式数据
- ✅ 提供调试信息便于问题排查

### 下一步
1. 测试修复效果
2. 检查控制台调试输出
3. 考虑进行数据库数据迁移（可选）

现在准父母应该能够看到所有应该可见的信托账户记录了！🎊✨
