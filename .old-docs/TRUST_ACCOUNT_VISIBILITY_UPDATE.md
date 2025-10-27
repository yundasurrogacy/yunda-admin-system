# 信托账户可见性字段更新总结

## ✅ 更新内容

### 🔄 可见性选项变更

根据数据库字段定义，将可见性选项从 `'true'/'false'` 更新为 `'all'/'intended_parents'`。

#### **数据库字段定义**
```sql
visibility - text, nullable, default: 'all'::text
-- 谁可见选项：
-- 1. 'intended_parents' - 仅准父母可见
-- 2. 'all' - 全部可见（准父母和代孕母都可见）
```

### 📊 选项对比

| 旧值 | 新值 | 中文 | English | 说明 |
|------|------|------|---------|------|
| `'true'` | `'all'` | 全部可见 | All | 准父母和代孕母都可见 |
| `'false'` | `'intended_parents'` | 仅准父母可见 | Intended Parents Only | 只有准父母可见 |

### 🎨 UI 显示效果

#### **表单选择器**
```tsx
<select name="visibility">
  <option value="all">全部可见 / All</option>
  <option value="intended_parents">仅准父母可见 / Intended Parents Only</option>
</select>
```

#### **表格显示**

**全部可见 (all)**
```
┌────────────────────┐
│ ✓ 全部可见         │  绿色
│ ✓ All              │
└────────────────────┘
```

**仅准父母可见 (intended_parents)**
```
┌────────────────────────┐
│ ⇄ 仅准父母可见         │  蓝色
│ ⇄ Intended Parents Only│
└────────────────────────┘
```

### 📁 更新的文件

#### **1. Admin 页面** (`src/app/admin/trust-account/page.tsx`)

**状态初始化**：
```typescript
// 修改前
const [formData, setFormData] = useState({ visibility: 'true' });

// 修改后
const [formData, setFormData] = useState({ visibility: 'all' });
```

**表单选项**：
```typescript
// 修改前
<option value="true">True</option>
<option value="false">False</option>

// 修改后
<option value="all">{t('trustAccount.visibilityAll', 'All')}</option>
<option value="intended_parents">{t('trustAccount.visibilityIntendedParents', 'Intended Parents Only')}</option>
```

**表格显示**：
```typescript
// 修改前
{change.visibility === 'true' ? <绿色勾选图标>True : <灰色图标>False}

// 修改后
{change.visibility === 'all' 
  ? <绿色勾选图标>全部可见 
  : <蓝色双向箭头图标>仅准父母可见
}
```

**默认值更新**：
- `handleAdd()`: `visibility: 'all'`
- `handleEdit()`: `visibility: item.visibility ?? 'all'`
- `handleBalanceEdit()`: `visibility: 'all'`

#### **2. Client Manager 页面** (`src/app/client-manager/trust-account/page.tsx`)

与 Admin 页面相同的更新内容（注意：字段名为大写 `Visibility`）

#### **3. Client 页面** (`src/app/client/trust-account/page.tsx`)

**过滤逻辑**：
```typescript
// 修改前
let arr = changes.filter(c => c.Visibility === 'true');

// 修改后
// Client 可以看到 'all' 和 'intended_parents' 的记录
let arr = changes.filter(c => 
  c.Visibility === 'all' || c.Visibility === 'intended_parents'
);
```

#### **4. Surrogacy 页面** (`src/app/surrogacy/trust-account/page.tsx`)

**过滤逻辑**：
```typescript
// 修改前
let arr = changes; // 看所有记录

// 修改后
// Surrogacy 只能看到 'all' 的记录
let arr = changes.filter(c => c.visibility === 'all');
```

#### **5. 翻译文件**

**中文** (`public/locales/zh-CN/common.json`)：
```json
{
  "trustAccount": {
    "visibilityAll": "全部可见",
    "visibilityIntendedParents": "仅准父母可见"
  }
}
```

**英文** (`public/locales/en/common.json`)：
```json
{
  "trustAccount": {
    "visibilityAll": "All",
    "visibilityIntendedParents": "Intended Parents Only"
  }
}
```

## 🔐 权限逻辑

### 可见性规则

| visibility 值 | Admin 可见 | Manager 可见 | Client (准父母) 可见 | Surrogacy (代孕母) 可见 |
|--------------|-----------|-------------|---------------------|----------------------|
| `'all'` | ✅ | ✅ | ✅ | ✅ |
| `'intended_parents'` | ✅ | ✅ | ✅ | ❌ |

### 业务场景

#### **场景 1：所有人可见 (all)**
```
使用场景：
- 公开的充值记录
- 双方都需要知道的消费
- 透明的账户变动

示例：
- 初始充值 $50,000
- 医疗费用支出 -$5,000
- 余额调整记录
```

#### **场景 2：仅准父母可见 (intended_parents)**
```
使用场景：
- 敏感的财务信息
- 仅需准父母知晓的费用
- 内部调整记录

示例：
- 管理费收费 -$2,000
- 特殊费用调整
- 仅客户需要知道的备注
```

## 🎨 视觉设计

### 图标和颜色

#### **全部可见 (all)**
```
颜色：绿色 (#22c55e)
图标：✓ (勾选标记)
含义：公开、透明
```

#### **仅准父母可见 (intended_parents)**
```
颜色：蓝色 (#3b82f6)
图标：⇄ (双向箭头)
含义：限制、特定对象
```

### SVG 图标

**全部可见**：
```svg
<svg width="14" height="14" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="8" fill="#22c55e"/>
  <path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="2"/>
</svg>
```

**仅准父母可见**：
```svg
<svg width="14" height="14" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="8" fill="#3b82f6"/>
  <path d="M8 12l-2-2 2-2M12 8l2 2-2 2" stroke="#fff" strokeWidth="2"/>
</svg>
```

## 📋 数据流程

### 创建新记录
```typescript
// 默认为 'all'
{
  change_type: 'RECHARGE',
  change_amount: 10000,
  visibility: 'all',  // ⭐ 默认全部可见
  remark: '初始充值'
}
```

### 修改可见性
```typescript
// 管理员可以在编辑时修改
{
  visibility: 'intended_parents'  // 改为仅准父母可见
}
```

### 自动余额调整
```typescript
// 直接修改余额时自动创建的记录
{
  change_type: 'OTHER',
  visibility: 'all',  // ⭐ 默认全部可见
  remark: '余额调整'
}
```

## 🔍 过滤逻辑对比

| 用户角色 | 过滤条件 | 可见记录 |
|---------|---------|---------|
| **Admin** | 无过滤 | 全部记录 |
| **Manager** | 无过滤 | 全部记录 |
| **Client (准父母)** | `visibility === 'all' OR 'intended_parents'` | 公开记录 + 准父母专属 |
| **Surrogacy (代孕母)** | `visibility === 'all'` | 仅公开记录 |

### 代码实现

**Admin & Manager**：
```typescript
// 不过滤，显示所有记录
const displayedChanges = useMemo(() => {
  let arr = changes; // 全部记录
  // ... 其他过滤和排序
}, [changes]);
```

**Client (准父母)**：
```typescript
// 过滤出 'all' 和 'intended_parents'
const displayedChanges = useMemo(() => {
  let arr = changes.filter(c => 
    c.Visibility === 'all' || c.Visibility === 'intended_parents'
  );
  // ... 其他过滤和排序
}, [changes]);
```

**Surrogacy (代孕母)**：
```typescript
// 只显示 'all'
const displayedChanges = useMemo(() => {
  let arr = changes.filter(c => c.visibility === 'all');
  // ... 其他过滤和排序
}, [changes]);
```

## 📊 更新统计

| 类型 | 修改项 | 数量 |
|------|--------|------|
| **代码文件** | 状态初始化 | 2 |
| | 表单默认值 | 4 |
| | 表单选项 | 2 |
| | 表格显示 | 2 |
| | 过滤逻辑 | 2 |
| **翻译文件** | 中文翻译 | 2 |
| | 英文翻译 | 2 |
| **总计** | | **16** |

## ✅ 质量保证

- ✅ 数据库字段定义一致
- ✅ 所有文件语法正确
- ✅ 无 Linter 错误
- ✅ 完整的国际化支持
- ✅ 权限逻辑清晰
- ✅ 视觉区分明确

## 🎯 使用示例

### 示例 1：公开充值
```typescript
// 创建一条所有人可见的充值记录
{
  change_type: 'RECHARGE',
  change_amount: 50000,
  visibility: 'all',  // ⭐ 准父母和代孕母都能看到
  remark: '初始资金充值'
}

显示效果：
- Admin/Manager 页面：✓ 全部可见 (绿色)
- Client 页面：可见
- Surrogacy 页面：可见
```

### 示例 2：私密费用
```typescript
// 创建一条仅准父母可见的费用记录
{
  change_type: 'CONSUMPTION',
  change_amount: -2000,
  visibility: 'intended_parents',  // ⭐ 仅准父母可见
  remark: '管理服务费'
}

显示效果：
- Admin/Manager 页面：⇄ 仅准父母可见 (蓝色)
- Client 页面：可见
- Surrogacy 页面：不可见 ❌
```

## 🎉 总结

信托账户可见性系统已完全更新：
- ✅ 符合数据库字段定义
- ✅ 支持两种可见性选项（`'all'`, `'intended_parents'`）
- ✅ 清晰的权限控制
- ✅ 直观的视觉区分
- ✅ 完整的国际化支持
- ✅ 4 个页面逻辑一致

现在管理员可以精确控制每条交易记录的可见性！🔐✨

