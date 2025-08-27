# 启明星OKR平台 - 部署指南

## 📋 项目概述

启明星是一个为河北师范大学软件学院打造的AI智慧教育平台，支持OKR目标管理、AI学习伴侣、知识库问答等功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装基础依赖
npm install

# 安装Supabase依赖 (Pages Router兼容)
npm install @supabase/supabase-js

# 安装其他依赖
npm install uuid
npm install @types/uuid --save-dev
```

### 2. 数据库设置

#### 创建Supabase项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 记录项目URL和API密钥

#### 执行数据库初始化脚本

在Supabase SQL编辑器中执行 `database-schema.sql` 文件中的所有SQL语句：

```sql
-- 复制并执行 database-schema.sql 中的所有内容
-- 这将创建所有必要的表、索引、触发器和RLS策略
```

### 3. 环境配置

复制 `.env.example` 为 `.env.local` 并填入配置：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI服务配置（可选，用于真实AI功能）
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4

# 其他配置
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3001
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001

## 📚 功能特性

### ✅ 已实现功能

#### 🔐 用户认证系统
- ✅ 邮箱密码注册登录
- ✅ 学生信息管理
- ✅ 安全的认证状态管理

#### 🎯 OKR目标管理
- ✅ 创建目标和关键结果
- ✅ 进度追踪和更新
- ✅ 可视化进度展示
- ✅ 自动计算目标完成度

#### 🤖 AI学习伴侣
- ✅ 智能聊天对话
- ✅ 聊天历史记录保存
- ✅ 个性化学习建议
- ✅ 支持RAG知识库问答

#### 📊 数据管理
- ✅ 完整的数据库结构
- ✅ Row Level Security (RLS)
- ✅ 数据完整性约束
- ✅ 自动时间戳更新

### 🔧 技术架构

```
Frontend (Next.js 14.2.5)
├── React 18
├── TypeScript
├── Tailwind CSS
├── Lucide React Icons
└── Framer Motion

Backend (Supabase)
├── PostgreSQL数据库
├── 实时订阅
├── 认证服务
├── Row Level Security
└── 自动API生成

API Layer
├── Next.js API Routes
├── RESTful接口
├── 类型安全
└── 错误处理
```

### 📱 页面结构

```
src/app/
├── page.tsx                    # 首页
├── login/page.tsx              # 登录页面  
├── register/page.tsx           # 注册页面
├── student/                    # 学生端
│   ├── page.tsx               # 学生仪表盘
│   ├── okr/page.tsx           # OKR管理
│   ├── ai-companion/page.tsx   # AI学习伴侣
│   ├── resources/page.tsx      # 学习资源
│   └── settings/page.tsx      # 个人设置
├── teacher/                    # 教师端
└── admin/                     # 管理端
```

## 🗄️ 数据库结构

### 核心数据表

#### 👥 用户相关
- `students` - 学生信息表
- `student_settings` - 学生个人设置

#### 🎯 OKR相关
- `objectives` - 目标表
- `key_results` - 关键结果表  
- `progress_logs` - 进度记录表

#### 💬 AI聊天相关
- `chat_sessions` - 聊天会话表
- `chat_messages` - 聊天消息表

#### 📚 知识库相关
- `knowledge_documents` - 知识库文档表
- `document_chunks` - 文档片段表（用于RAG）

#### 📈 学习数据
- `learning_activities` - 学习活动记录

## 🔑 API接口

### 认证相关
- `POST /api/auth/callback` - 认证回调
- `GET|PUT|POST /api/students/profile` - 学生信息管理

### OKR相关  
- `GET|POST /api/okr/objectives` - 目标管理
- `PUT /api/okr/key-results/[id]/progress` - 进度更新

### AI聊天相关
- `POST /api/ai/chat` - 发送聊天消息
- `GET|DELETE /api/ai/chat/history` - 聊天历史管理

## 🧪 使用指南

### 注册新用户
1. 访问 `/register`
2. 填写邮箱、密码和基本信息
3. 提交注册
4. 自动登录并跳转到学生端

### 创建OKR目标
1. 进入学生端OKR管理页面
2. 点击"创建新目标"
3. 填写目标信息和关键结果
4. 保存并开始追踪进度

### 使用AI学习伴侣
1. 进入AI学习伴侣页面
2. 输入问题或需求
3. AI将基于知识库和个人情况提供建议
4. 所有对话都会保存到历史记录

## 🚀 生产部署

### Vercel部署（推荐）

1. 推送代码到GitHub
2. 在Vercel连接GitHub仓库
3. 设置环境变量
4. 部署

### 其他部署方式

支持所有支持Next.js的平台：
- Netlify
- AWS Amplify  
- 腾讯云
- 阿里云等

## 🔒 安全特性

- ✅ Row Level Security (RLS)
- ✅ JWT认证令牌
- ✅ 密码哈希存储
- ✅ CSRF保护
- ✅ XSS防护
- ✅ SQL注入防护

## 📋 待开发功能

### 🔮 后续规划
- [ ] 教师端功能完善
- [ ] 管理员面板
- [ ] 真实AI模型集成
- [ ] 移动端适配
- [ ] 通知推送系统
- [ ] 数据导出功能
- [ ] 多语言支持

## 🐛 问题排查

### 常见问题

1. **数据库连接失败**
   - 检查Supabase URL和API密钥
   - 确认项目已启动

2. **认证失败**
   - 检查环境变量配置
   - 确认RLS策略正确

3. **页面无法加载**
   - 检查Next.js版本兼容性
   - 确认依赖安装完整

## 📞 技术支持

如遇到问题，请：
1. 检查本文档的问题排查部分
2. 查看控制台错误信息
3. 检查Supabase数据库日志
4. 联系开发团队

---

## 📄 许可证

本项目仅供河北师范大学软件学院内部使用。

© 2024 河北师范大学软件学院 · AI智慧教育平台