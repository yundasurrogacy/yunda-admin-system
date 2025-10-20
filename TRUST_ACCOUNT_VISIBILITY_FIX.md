# 信托账户 Visibility 字段名称修复

## 🔧 发现的问题

### 问题描述
Client 和 Manager 页面无法正确渲染数据，原因是接口定义中使用了大写的 `Visibility`，但 API 返回的是小写的 `visibility`，导致字段名不匹配。

### 根本原因
```typescript
// ❌ 错误：接口定义使用大写
interface BalanceChange {
  Visibility?: string;  // 大写
}

// ✅ API 返回使用小写
query {
  trust_account_balance_changes {
    visibility  // 小写
  }
}

// ❌ 导致过滤失败
changes.filter(c => c.Visibility === 'all')  // undefined === 'all' → false
```

## ✅ 修复内容

### 统一字段名为小写 `visibility`

根据数据库字段和 GraphQL API 定义，字段名应该是小写的 `visibility`。

#### **修复前**
```typescript
// 接口定义
interface BalanceChange {
  Visibility?: string;  // ❌ 大写
}

// 代码使用
formData.Visibility
item.Visibility
change.Visibility
```

#### **修复后**
```typescript
// 接口定义
interface BalanceChange {
  visibility?: string;  // ✅ 小写
}

// 代码使用
formData.visibility
item.visibility
change.visibility
```

## 📁 修复的文件

### 1. Client Manager 页面 (`src/app/client-manager/trust-account/page.tsx`)

**接口定义**：
```typescript
// Line 30
Visibility?: string;  →  visibility?: string;
```

**状态初始化**：
```typescript
// Line 53
{ Visibility: 'all' }  →  { visibility: 'all' }
```

**表单初始化**：
```typescript
// Line 155
Visibility: 'all'  →  visibility: 'all'
```

**编辑加载**：
```typescript
// Line 167
Visibility: item.Visibility ?? 'all'  →  visibility: item.visibility ?? 'all'
```

**余额调整**：
```typescript
// Line 314
Visibility: 'all'  →  visibility: 'all'
```

**表单字段**：
```typescript
// Line 521-522
name="Visibility"  →  name="visibility"
value={formData.Visibility || 'all'}  →  value={formData.visibility || 'all'}
```

**表格显示**：
```typescript
// Line 658
change.Visibility === 'all'  →  change.visibility === 'all'
```

### 2. Client 页面 (`src/app/client/trust-account/page.tsx`)

**接口定义**：
```typescript
// Line 30
Visibility?: string;  →  visibility?: string;
```

**状态初始化**：
```typescript
// Line 50
{ Visibility: 'all' }  →  { visibility: 'all' }
```

**表单初始化**：
```typescript
// Line 159
Visibility: 'all'  →  visibility: 'all'
```

**编辑加载**：
```typescript
// Line 170
Visibility: item.Visibility ?? 'all'  →  visibility: item.visibility ?? 'all'
```

**过滤逻辑**：
```typescript
// Line 113
c.Visibility === 'all' || c.Visibility === 'intended_parents'
  ↓
c.visibility === 'all' || c.visibility === 'intended_parents'
```

**表单字段**：
```typescript
// Line 424-425
name="Visibility"  →  name="visibility"
value={formData.Visibility || 'all'}  →  value={formData.visibility || 'all'}
```

## 🎯 修复详情

### 修复统计

| 文件 | 修复位置 | 类型 |
|------|---------|------|
| Client Manager | 接口定义 | 1 处 |
| | 状态/表单 | 4 处 |
| | 表单字段 | 2 处 |
| | 表格显示 | 1 处 |
| Client | 接口定义 | 1 处 |
| | 状态/表单 | 3 处 |
| | 过滤逻辑 | 1 处 |
| | 表单字段 | 2 处 |
| **总计** | | **15 处** |

### 问题影响

#### **修复前的症状**
```typescript
// API 返回数据
{
  id: 1,
  visibility: 'all',  // 小写
  change_amount: 1000,
  ...
}

// 接口定义期望
interface BalanceChange {
  Visibility?: string;  // 大写
}

// 结果：change.Visibility === undefined
// 导致过滤失败，数据无法显示
```

#### **修复后的效果**
```typescript
// API 返回数据
{
  id: 1,
  visibility: 'all',  // 小写
  change_amount: 1000,
  ...
}

// 接口定义
interface BalanceChange {
  visibility?: string;  // 小写 ✅ 匹配
}

// 结果：change.visibility === 'all'
// 过滤成功，数据正常显示 ✅
```

## 🔍 数据库字段规范

### 标准字段名
```sql
visibility - text, nullable, default: 'all'::text
```

### GraphQL 查询
```graphql
query TrustAccount($caseId: bigint!) {
  trust_account_balance_changes(...) {
    visibility  # ⭐ 小写
  }
}
```

### API 响应
```json
{
  "changes": [
    {
      "id": 1,
      "visibility": "all"  // ⭐ 小写
    }
  ]
}
```

### TypeScript 接口
```typescript
interface BalanceChange {
  visibility?: string;  // ⭐ 小写，与 API 一致
}
```

## ✅ 验证结果

### 字段名一致性检查

| 层级 | 字段名 | 状态 |
|------|--------|------|
| 数据库 | `visibility` | ✅ |
| GraphQL | `visibility` | ✅ |
| API 响应 | `visibility` | ✅ |
| TypeScript (Admin) | `visibility` | ✅ |
| TypeScript (Manager) | `visibility` | ✅ ✅ 已修复 |
| TypeScript (Client) | `visibility` | ✅ ✅ 已修复 |
| TypeScript (Surrogacy) | `visibility` | ✅ |

### 数据流验证

```
数据库 (visibility: 'all')
    ↓
GraphQL 查询 (visibility)
    ↓
API 返回 { visibility: 'all' }
    ↓
TypeScript 接口 (visibility?: string) ✅ 匹配
    ↓
过滤逻辑 (c.visibility === 'all') ✅ 成功
    ↓
数据正常显示 ✅
```

## 🎯 修复效果

### Client 页面
```typescript
// 修复前
changes.filter(c => c.Visibility === 'all')  // undefined === 'all' → 空数组
结果：页面显示 "No records"

// 修复后
changes.filter(c => c.visibility === 'all')  // 'all' === 'all' → 正确过滤
结果：正常显示交易记录 ✅
```

### Manager 页面
```typescript
// 修复前
change.Visibility === 'all'  // undefined === 'all' → false
结果：表格显示异常

// 修复后
change.visibility === 'all'  // 'all' === 'all' → true
结果：表格正常显示可见性状态 ✅
```

## 📊 完整的字段使用规范

### 所有 4 个页面统一使用

```typescript
// ✅ 统一标准
interface BalanceChange {
  id: number;
  case_cases: number;
  change_type: string;
  change_amount: number;
  balance_before: number | null;
  balance_after: number | null;
  remark: string | null;
  receiver: string | null;
  created_at: string;
  visibility?: string;  // ⭐ 统一使用小写
}
```

### 使用方式统一

```typescript
// ✅ 表单
formData.visibility
name="visibility"
value={formData.visibility || 'all'}

// ✅ 编辑
visibility: item.visibility ?? 'all'

// ✅ 过滤
c.visibility === 'all'

// ✅ 显示
change.visibility === 'all'
```

## ✅ 质量保证

- ✅ 字段名与数据库一致
- ✅ 字段名与 API 一致
- ✅ 4 个页面全部统一
- ✅ 无语法错误
- ✅ 无 Linter 错误
- ✅ 数据过滤逻辑正确

## 🎉 总结

成功修复了 visibility 字段名不一致的问题：
- ✅ 统一为小写 `visibility`
- ✅ 与数据库和 API 保持一致
- ✅ 修复了 Client 和 Manager 页面的数据显示问题
- ✅ 15 处修复，全部验证通过

现在所有页面都能正确显示和过滤信托账户数据！🎊✨

