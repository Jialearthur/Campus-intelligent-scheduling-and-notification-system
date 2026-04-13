此次合并添加了完整的校园排班系统，包括后端API服务和前端React界面，实现了用户认证、智能排班、考勤管理、请假申请等核心功能。系统使用SQLite数据库存储数据，提供了完整的RESTful API接口，并支持跨部门成员调配和时间冲突检查。
| 文件 | 变更 |
|------|------|
| campus-scheduling-system/backend/index.js | - 新建Express.js后端服务，配置CORS和body-parser中间件<br>- 实现API路由管理，包括认证、成员、任务、排班、通知、统计、请假和考勤等模块<br>- 添加错误处理中间件 |
| campus-scheduling-system/backend/package.json | - 配置项目依赖，包括express、cors、bcryptjs、jsonwebtoken、sqlite3等<br>- 设置项目类型为commonjs |
| campus-scheduling-system/backend/database.js | - 新建SQLite数据库，创建用户、部门、成员、空闲时间、特长、任务、排班、通知、请假申请、考勤等表结构<br>- 实现数据库初始化和表创建功能 |
| campus-scheduling-system/backend/routes/auth.js | - 实现用户注册和登录功能<br>- 使用bcrypt进行密码哈希，jwt生成认证令牌<br>- 支持事务处理，确保用户和成员信息的一致性 |
| campus-scheduling-system/backend/routes/schedules.js | - 实现排班生成算法，支持时间冲突检查、空闲时间检查、值班次数计算<br>- 提供排班列表查询、更新和替换成员功能<br>- 支持跨部门成员调配和核心成员优先排序 |
| campus-scheduling-system/backend/routes/tasks.js | - 实现任务的创建、查询、更新和删除功能<br>- 支持事务处理，确保任务和相关排班的一致性 |
| campus-scheduling-system/frontend/package.json | - 配置React前端项目依赖，包括react、react-dom、react-router-dom、tailwindcss等<br>- 设置开发和构建脚本 |
| campus-scheduling-system/frontend/src/App.jsx | - 实现前端路由管理，包括登录、注册、仪表盘、成员管理、排班管理等页面<br>- 集成认证上下文，实现路由保护 |