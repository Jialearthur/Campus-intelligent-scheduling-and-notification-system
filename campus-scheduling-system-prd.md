## 1. 产品概述
校园智能排班与通知系统是一款面向大学生社团、学生会、班级的智能排班工具，解决传统排班效率低、通知不及时等问题。
- 主要功能包括成员管理、排班管理、通知管理和数据统计，旨在提高组织运营效率，确保任务顺利完成。
- 目标用户为高校学生组织，市场价值在于提升组织管理水平，减少人工排班工作量。

## 2. 核心功能

### 2.1 用户角色
| 角色 | 注册方式 | 核心权限 |
|------|---------------------|------------------|
| 普通成员 | 邮箱注册 | 查看排班、提交空闲时间、查看个人统计 |
| 部门管理员 | 邀请码注册 | 管理部门成员、创建值班任务、审批排班 |
| 系统管理员 | 后台创建 | 管理所有部门、用户和系统配置 |

### 2.2 功能模块
1. **登录/注册页面**：用户认证、角色区分
2. **成员管理页面**：成员信息管理、空闲时间录入、特长标注
3. **排班管理页面**：任务创建、自动排班、冲突校验
4. **通知管理页面**：多渠道通知设置、通知历史
5. **数据统计页面**：值班次数统计、出勤情况、志愿时长导出

### 2.3 页面详情
| 页面名称 | 模块名称 | 功能描述 |
|-----------|-------------|---------------------|
| 登录/注册页面 | 登录模块 | 支持邮箱登录、密码找回 |
| 登录/注册页面 | 注册模块 | 支持邮箱注册、邀请码验证 |
| 成员管理页面 | 成员列表 | 查看部门成员信息、编辑成员状态 |
| 成员管理页面 | 个人信息 | 编辑个人资料、录入空闲时间、标注特长和优先级 |
| 排班管理页面 | 任务创建 | 手动输入值班任务类型、时间、人数要求 |
| 排班管理页面 | 自动排班 | 系统根据成员空闲时间自动匹配，进行冲突校验 |
| 排班管理页面 | 排班结果 | 查看排班详情、手动调整、确认发布 |
| 通知管理页面 | 通知设置 | 配置微信、企业微信、校园邮箱通知渠道 |
| 通知管理页面 | 通知历史 | 查看历史通知记录、发送状态 |
| 数据统计页面 | 部门统计 | 统计各部门值班次数、出勤率 |
| 数据统计页面 | 个人统计 | 统计成员出勤情况、志愿时长 |
| 数据统计页面 | 导出功能 | 导出Excel表格格式的统计数据 |

## 3. 核心流程
### 成员注册与信息完善流程
1. 用户通过邮箱注册账号
2. 系统根据邀请码分配角色
3. 成员完善个人资料，录入空闲时间和特长
4. 管理员审核成员信息

### 排班流程
1. 管理员创建值班任务，设置任务类型、时间、人数要求
2. 系统根据成员空闲时间、特长和优先级自动匹配
3. 系统进行冲突校验，避免重复排班和时间冲突
4. 管理员确认排班结果
5. 系统通过多渠道发送通知给相关成员

### 数据统计流程
1. 系统自动记录值班情况
2. 管理员查看部门和个人统计数据
3. 导出Excel表格用于分析和存档

```mermaid
flowchart TD
    A[成员注册] --> B[完善个人信息]
    B --> C[管理员审核]
    D[创建值班任务] --> E[自动排班]
    E --> F[冲突校验]
    F --> G[管理员确认]
    G --> H[多渠道通知]
    I[记录值班情况] --> J[数据统计]
    J --> K[导出Excel]
```

## 4. 用户界面设计
### 4.1 设计风格
- 主色调：蓝色系 (#1E88E5) 和白色 (#FFFFFF)，体现校园青春活力
- 辅助色：浅灰 (#F5F5F5)、深灰 (#424242)
- 按钮样式：圆角矩形，有轻微阴影效果
- 字体：系统默认无衬线字体，标题16-20px，正文14px
- 布局风格：卡片式布局，顶部导航栏
- 图标风格：线性图标，简洁明了

### 4.2 页面设计概览
| 页面名称 | 模块名称 | UI元素 |
|-----------|-------------|-------------|
| 登录/注册页面 | 登录模块 | 简洁表单，包含邮箱、密码输入框，登录按钮，忘记密码链接 |
| 登录/注册页面 | 注册模块 | 包含邮箱、密码、确认密码输入框，邀请码输入框，注册按钮 |
| 成员管理页面 | 成员列表 | 表格形式展示成员信息，支持搜索和筛选，每行包含编辑、删除按钮 |
| 成员管理页面 | 个人信息 | 表单形式，包含基本信息、空闲时间选择器、特长标签选择、优先级设置 |
| 排班管理页面 | 任务创建 | 表单形式，包含任务类型下拉选择、时间选择器、人数输入框、任务描述 |
| 排班管理页面 | 排班结果 | 日历视图展示排班情况，支持拖拽调整，冲突显示为红色 |
| 通知管理页面 | 通知设置 | 开关按钮控制各通知渠道，输入框配置通知模板 |
| 通知管理页面 | 通知历史 | 表格形式展示通知记录，包含发送时间、渠道、状态 |
| 数据统计页面 | 部门统计 | 饼图和柱状图展示各部门值班情况，支持时间范围选择 |
| 数据统计页面 | 个人统计 | 表格形式展示成员出勤情况和志愿时长，支持排序 |
| 数据统计页面 | 导出功能 | 导出按钮，支持选择导出范围和格式 |

### 4.3 响应性
- 设计采用桌面端优先，同时支持移动端自适应
- 移动端采用底部导航栏，简化操作流程
- 触摸优化：按钮和可点击元素尺寸不小于44px×44px

## 5. 技术架构

### 5.1 架构设计
```mermaid
flowchart TD
    Frontend[前端 React] --> Backend[后端 Express]
    Backend --> Database[数据库 SQLite]
    Backend --> Notification[通知服务]
    Backend --> Excel[Excel导出服务]
```

### 5.2 技术描述
- 前端：React@18 + tailwindcss@3 + vite
- 后端：Express@4 + Node.js
- 数据库：SQLite
- 认证：JWT
- 通知：微信API、企业微信API、邮件服务
- 导出：ExcelJS

### 5.3 路由定义
| 路由 | 用途 |
|-------|---------|
| /login | 登录页面 |
| /register | 注册页面 |
| /dashboard | 仪表盘 |
| /members | 成员管理 |
| /scheduling | 排班管理 |
| /notifications | 通知管理 |
| /statistics | 数据统计 |

### 5.4 API定义
| API路径 | 方法 | 功能 |
|---------|------|------|
| /api/auth/login | POST | 用户登录 |
| /api/auth/register | POST | 用户注册 |
| /api/members | GET | 获取成员列表 |
| /api/members | POST | 创建成员 |
| /api/members/:id | PUT | 更新成员信息 |
| /api/members/:id | DELETE | 删除成员 |
| /api/tasks | GET | 获取任务列表 |
| /api/tasks | POST | 创建值班任务 |
| /api/tasks/:id | PUT | 更新任务信息 |
| /api/tasks/:id | DELETE | 删除任务 |
| /api/schedules | GET | 获取排班列表 |
| /api/schedules | POST | 生成排班 |
| /api/schedules/:id | PUT | 更新排班 |
| /api/notifications | GET | 获取通知列表 |
| /api/notifications | POST | 发送通知 |
| /api/statistics | GET | 获取统计数据 |
| /api/statistics/export | GET | 导出统计数据 |

### 5.5 数据模型
#### 5.5.1 数据模型定义
```mermaid
erDiagram
    USER ||--o{ MEMBER : has
    MEMBER ||--o{ AVAILABILITY : has
    MEMBER ||--o{ SKILL : has
    DEPARTMENT ||--o{ MEMBER : contains
    TASK ||--o{ SCHEDULE : generates
    MEMBER ||--o{ SCHEDULE : assigned
    SCHEDULE ||--o{ NOTIFICATION : triggers
    DEPARTMENT ||--o{ TASK : creates
```

#### 5.5.2 数据定义语言
```sql
-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 部门表
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成员表
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    priority VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 空闲时间表
CREATE TABLE availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER REFERENCES members(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 特长表
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER REFERENCES members(id),
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 任务表
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER REFERENCES departments(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    required_count INTEGER NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 排班表
CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    member_id INTEGER REFERENCES members(id),
    status VARCHAR(20) DEFAULT 'assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知表
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schedule_id INTEGER REFERENCES schedules(id),
    member_id INTEGER REFERENCES members(id),
    channel VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 考勤表
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schedule_id INTEGER REFERENCES schedules(id),
    member_id INTEGER REFERENCES members(id),
    status VARCHAR(20) DEFAULT 'absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```