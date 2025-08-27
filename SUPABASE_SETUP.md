# Supabase 设置详细指南

## 🚀 步骤1：创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project" 或 "New Project"
3. 选择组织（或创建新组织）
4. 填写项目信息：
   - **Name**: `okr-platform`（或你喜欢的名字）
   - **Database Password**: 设置一个强密码（请记住）
   - **Region**: 选择离你最近的区域
5. 点击 "Create new project"
6. 等待项目创建完成（约2分钟）

## 📋 步骤2：获取项目配置信息

1. 进入项目仪表板
2. 点击左侧菜单 **Settings** → **API**
3. 记录以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJ0eXAiOi...` (很长的字符串)

## 🗄️ 步骤3：执行数据库脚本

### 方法1：完整初始化（推荐）

1. 在 Supabase 仪表板中，点击左侧 **SQL Editor**
2. 点击 **New query**
3. 复制 `database-with-sample-data.sql` 文件的完整内容
4. 粘贴到编辑器中
5. 点击 **Run** 执行脚本
6. 看到成功消息后，数据库就设置完成了！

### 方法2：分步执行

如果完整脚本执行有问题，可以分步执行：

1. 先执行基础表结构：
```sql
-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建学生表
CREATE TABLE public.students (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50),
    grade VARCHAR(20),
    major VARCHAR(100),
    class_name VARCHAR(50),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. 然后执行其他表（复制相应部分）

## 🔒 步骤4：配置认证设置

1. 点击左侧 **Authentication** → **Settings**
2. 在 **Auth Providers** 部分确保 **Email** 已启用
3. 可选：配置其他登录方式（Google、GitHub等）
4. 在 **URL Configuration** 部分：
   - **Site URL**: `http://localhost:3001`（开发环境）
   - **Redirect URLs**: `http://localhost:3001/auth/callback`

## ⚙️ 步骤5：配置本地环境变量

1. 在项目根目录复制环境变量文件：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，填入从步骤2获取的信息：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3001
```

## 🧪 步骤6：测试连接

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问测试端点：
```
http://localhost:3001/api/test-supabase
```

如果看到类似这样的响应，说明成功：
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "database": "Connected",
  "tablesAccessible": true,
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 👤 步骤7：测试用户注册

1. 访问 http://localhost:3001/register
2. 填写表单注册新用户
3. 检查邮箱确认邮件（如果启用了邮箱验证）
4. 登录系统测试功能

## 📊 步骤8：查看数据（可选）

1. 在 Supabase 仪表板，点击左侧 **Table Editor**
2. 你应该能看到以下表：
   - `students` - 学生信息
   - `objectives` - 学习目标  
   - `key_results` - 关键结果
   - `chat_sessions` - 聊天会话
   - `chat_messages` - 聊天消息
   - `knowledge_documents` - 知识库（含示例数据）

3. 点击任何表查看数据结构和内容

## 🎯 步骤9：添加示例OKR数据

注册用户后，如果想添加示例OKR数据：

1. 在 **Table Editor** → **students** 中找到你的用户ID
2. 复制 `insert-sample-data.sql` 内容
3. 将脚本中的 `sample_student_id` 替换为你的真实用户ID
4. 在 SQL Editor 中执行修改后的脚本

## 🔧 常见问题解决

### 问题1：RLS策略错误
如果遇到权限问题，在SQL Editor中执行：
```sql
-- 临时禁用RLS进行测试
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
```

### 问题2：表不存在
确保已正确执行了完整的数据库脚本

### 问题3：连接失败
- 检查环境变量是否正确设置
- 确认 Supabase 项目状态正常
- 检查网络连接

### 问题4：认证问题
- 检查 Authentication 设置
- 确认邮箱提供商设置（如果使用邮箱验证）
- 检查 URL 配置

## 📈 生产环境配置

部署到生产环境时：

1. 更新 **URL Configuration**：
   - **Site URL**: 你的域名
   - **Redirect URLs**: 你的域名 + `/auth/callback`

2. 更新环境变量为生产环境值

3. 启用必要的安全设置

---

完成这些步骤后，你的 Supabase 数据库就完全配置好了！🎉