# 🏷️ 等级价格管理功能实现文档

## 📋 功能概述

为随伴行管理后台新增了完整的等级价格管理功能，支持创建、编辑、删除价格模板，并为每个模板配置不同等级的服务价格。

## 🎯 实现的功能

### 1. 价格模板管理
- ✅ **模板列表页面** (`/service/price-template`)
  - 搜索模板名称
  - 添加新模板
  - 编辑现有模板
  - 删除模板
  - 查看模板详情

- ✅ **添加模板页面** (`/service/price-template/add`)
  - 设置模板基本信息
  - 批量配置6个等级价格
  - 支持小时/次/天三种计费单位
  - 设置模板级别的最小购买数量

- ✅ **编辑模板页面** (`/service/price-template/edit/:id`)
  - 修改模板名称和最小购买数量
  - 实时更新单个等级价格
  - 支持批量操作

- ✅ **模板详情页面** (`/service/price-template/detail/:id`)
  - 可视化展示所有等级价格
  - 卡片式布局设计
  - 快速编辑功能

### 2. 等级价格设置
- ✅ **6个服务等级**：小白、初级、中级、高级、专家、明星
- ✅ **灵活定价**：支持按小时、次、天三种计费单位
- ✅ **模板级别最小数量**：在价格模板表设置最小购买数量
- ✅ **价格验证**：完整的表单验证和错误提示

### 3. 精美界面设计
- ✅ **卡片布局**：等级价格以卡片形式展示
- ✅ **渐变色彩**：使用项目主题色系 (#FF6B9D → #4FACFE)
- ✅ **悬停效果**：卡片悬停动画和阴影效果
- ✅ **响应式设计**：适配不同屏幕尺寸
- ✅ **优化输入**：价格输入框带货币符号，无加减号

## 📁 文件结构

```
src/
├── router/modules/
│   └── service.js                    # 路由配置（已更新）
├── api/
│   └── service.js                    # API接口（已更新）
└── views/service/
    └── price-template/               # 等级价格管理页面
        ├── index.vue                 # 价格模板列表
        ├── add.vue                   # 添加价格模板
        ├── edit.vue                  # 编辑价格模板
        └── detail.vue                # 价格模板详情
```

## 🗄️ 数据库结构

### 价格模板表 (price_templates)
```sql
CREATE TABLE price_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '模板名称',
    unit VARCHAR(20) NOT NULL DEFAULT '小时' COMMENT '计费单位',
    min_quantity INT NOT NULL DEFAULT 1 COMMENT '最小购买数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 等级表 (service_levels)
```sql
CREATE TABLE service_levels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  level_name VARCHAR(50) NOT NULL UNIQUE, -- 小白、初级等
  level_order INT NOT NULL UNIQUE,        -- 1, 2, 3, 4...
  icon_url VARCHAR(255) DEFAULT NULL COMMENT '等级图标URL'
);
```

### 模板等级价格表 (price_template_levels)
```sql
CREATE TABLE price_template_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    price_template_id INT NOT NULL COMMENT '价格模板ID',
    service_level_id INT NOT NULL COMMENT '服务等级ID',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (price_template_id) REFERENCES price_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (service_level_id) REFERENCES service_levels(id)
);
```

## 🔧 API 接口

### 价格模板管理
```javascript
// 获取价格模板列表
getPriceTemplateList(params)

// 获取价格模板详情
getPriceTemplateDetail(id)

// 添加价格模板
addPriceTemplate(data) // data: { name, min_quantity }

// 编辑价格模板
editPriceTemplate(id, data) // data: { name, min_quantity }

// 删除价格模板
deletePriceTemplate(id)
```

### 等级价格管理
```javascript
// 获取服务等级列表
getServiceLevels()

// 添加模板等级价格
addPriceTemplateLevel(data) // data: { template_id, level_id, price, unit }

// 批量添加模板等级价格
batchAddPriceTemplateLevels(data) // data: { template_id, levels: [{ level_id, price, unit }] }

// 编辑模板等级价格
editPriceTemplateLevel(id, data) // data: { price, unit }

// 删除模板等级价格
deletePriceTemplateLevel(id)
```

## 🎨 界面设计特色

### 1. 主题色彩
- **主色调**：浪漫粉 (#FF6B9D) + 天空蓝 (#4FACFE)
- **渐变背景**：使用项目统一的渐变色彩
- **状态色彩**：成功绿、警告橙、错误红等

### 2. 交互效果
- **悬停动画**：卡片悬停时上浮和阴影效果
- **加载状态**：按钮和页面的加载动画
- **表单验证**：实时验证和错误提示
- **价格输入**：带货币符号的输入框，无加减号干扰

### 3. 响应式布局
- **网格布局**：使用CSS Grid自适应布局
- **弹性布局**：使用Flexbox确保对齐
- **移动适配**：支持不同屏幕尺寸

## 🚀 使用流程

### 1. 创建价格模板
1. 进入 `/service/price-template` 页面
2. 点击"添加模板"按钮
3. 填写模板名称和最小购买数量
4. 为每个等级设置价格和单位
5. 点击"保存"完成创建

### 2. 编辑价格模板
1. 在模板列表中点击"编辑"
2. 修改模板名称、最小购买数量或等级价格
3. 点击"更新"保存单个等级价格
4. 点击"保存"保存模板信息

### 3. 查看模板详情
1. 在模板列表中点击"详情"
2. 查看所有等级价格信息和最小购买数量
3. 可快速编辑单个等级价格

## 🔒 权限控制

根据用户权限数据，等级价格管理功能包含以下权限节点：

- `price-template-list`：价格模板列表查询
- `price-template-detail`：价格模板详情查询
- `price-template-add`：价格模板添加
- `price-template-edit`：价格模板编辑
- `price-template-delete`：价格模板删除
- `service-levels-list`：服务等级列表查询
- `price-template-level-add`：添加模板等级价格
- `price-template-level-batch-add`：批量添加模板等级价格
- `price-template-level-edit`：编辑模板等级价格
- `price-template-level-delete`：删除模板等级价格

## 🐛 技术细节

### 1. Vue3 Composition API 特性使用
- **`<script setup>`语法**：使用最新的Vue3语法糖
- **响应式数据**：使用 `ref` 和 `reactive` 管理状态
- **生命周期**：使用 `onMounted` 钩子初始化数据
- **组合式函数**：使用 `useRouter` 和 `useRoute` 获取路由信息

### 2. Element Plus 组件
- **表格组件**：使用 `el-table` 展示数据列表
- **表单组件**：使用 `el-form` 进行数据输入
- **对话框组件**：使用 `el-dialog` 进行弹窗交互
- **卡片组件**：使用 `el-card` 进行内容展示
- **输入组件**：使用 `el-input` 带货币符号的价格输入

### 3. 样式设计
- **SCSS 变量**：使用项目统一的主题变量
- **CSS Grid**：使用网格布局实现响应式设计
- **CSS 动画**：使用 transition 实现平滑过渡效果

## 📝 更新日志

### v3.1.1 (2024-01-15)
- 🔧 优化价格输入体验，移除加减号，添加货币符号
- 🗄️ 数据库结构调整，将最小购买数量移到模板级别
- 🎨 界面优化，简化等级价格设置
- ⚡ 使用Vue3 Composition API + `<script setup>`语法

### v3.1.0 (2024-01-15)
- ✨ 新增等级价格管理功能
- 🎨 精美的卡片式界面设计
- 🔧 完整的CRUD操作支持
- 📱 响应式布局适配
- 🔒 基于角色的权限控制

## 🎯 后续优化建议

1. **数据可视化**：添加价格趋势图表
2. **批量导入**：支持Excel批量导入价格数据
3. **价格历史**：记录价格变更历史
4. **模板复制**：支持复制现有模板
5. **价格对比**：不同模板间的价格对比功能

---

**开发完成时间**：2024年1月15日  
**开发人员**：AI Assistant  
**技术栈**：Vue 3.4 + Element Plus 2.4 + Vite 5  
**开发方式**：Vue3 Composition API + `<script setup>`语法

#### 2. 等级价格管理
- **批量设置**: 一次性设置所有服务等级的价格
- **统一单位**: 所有等级使用模板设置的计费单位
- **价格验证**: 确保价格输入的有效性
- **价格格式**: 支持最多8位数字，保留2位小数
- **分步处理**: 添加模板时先创建模板，再批量添加等级价格

#### 3. 用户体验优化
- **价格输入**: 使用带货币符号的数字输入框，移除增减按钮
- **单位显示**: 在价格输入框后显示计费单位
- **表单验证**: 完整的表单验证和错误提示
- **默认值**: 最小购买数量默认为1，计费单位默认为"小时"
- **编辑逻辑**: 编辑模板时只更新基本信息，等级价格通过详情页面单独编辑