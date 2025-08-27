-- =====================================================
-- 启明星OKR平台 - 完整数据库创建脚本
-- 直接复制此代码到 Supabase SQL Editor 中执行
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 创建数据库表
-- =====================================================

-- 学生信息表
CREATE TABLE IF NOT EXISTS public.students (
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

-- 目标表
CREATE TABLE IF NOT EXISTS public.objectives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'active',
    target_date DATE,
    progress DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 关键结果表
CREATE TABLE IF NOT EXISTS public.key_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    objective_id UUID REFERENCES public.objectives(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    metric_type VARCHAR(50) DEFAULT 'percentage',
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0.00,
    progress DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    is_auto_tracked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 进度记录表
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_result_id UUID REFERENCES public.key_results(id) ON DELETE CASCADE NOT NULL,
    previous_value DECIMAL(10,2),
    new_value DECIMAL(10,2) NOT NULL,
    progress_change DECIMAL(5,2),
    update_type VARCHAR(20) DEFAULT 'manual',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 聊天会话表
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200),
    session_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 聊天消息表
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学习活动表
CREATE TABLE IF NOT EXISTS public.learning_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_name VARCHAR(300),
    description TEXT,
    duration_minutes INTEGER,
    score DECIMAL(5,2),
    metadata JSONB,
    related_objective_id UUID REFERENCES public.objectives(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学生个人设置表
CREATE TABLE IF NOT EXISTS public.student_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, setting_key)
);

-- 知识库文档表
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. 创建索引以优化查询性能
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_major ON public.students(grade, major);
CREATE INDEX IF NOT EXISTS idx_objectives_student_id ON public.objectives(student_id);
CREATE INDEX IF NOT EXISTS idx_objectives_status ON public.objectives(status);
CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON public.key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_key_result_id ON public.progress_logs(key_result_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_student_id ON public.chat_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_student_id ON public.learning_activities(student_id);

-- =====================================================
-- 3. 创建更新时间触发器函数
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
DROP TRIGGER IF EXISTS trigger_students_updated_at ON public.students;
CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_objectives_updated_at ON public.objectives;
CREATE TRIGGER trigger_objectives_updated_at
    BEFORE UPDATE ON public.objectives
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_key_results_updated_at ON public.key_results;
CREATE TRIGGER trigger_key_results_updated_at
    BEFORE UPDATE ON public.key_results
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trigger_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_student_settings_updated_at ON public.student_settings;
CREATE TRIGGER trigger_student_settings_updated_at
    BEFORE UPDATE ON public.student_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. 启用 Row Level Security (RLS)
-- =====================================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. 创建 RLS 策略
-- =====================================================

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Students can manage own profile" ON public.students;
DROP POLICY IF EXISTS "Students can manage own objectives" ON public.objectives;
DROP POLICY IF EXISTS "Students can manage own key results" ON public.key_results;
DROP POLICY IF EXISTS "Students can view own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Students can manage own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Students can manage own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Students can manage own learning activities" ON public.learning_activities;
DROP POLICY IF EXISTS "Students can manage own settings" ON public.student_settings;
DROP POLICY IF EXISTS "Authenticated users can view knowledge documents" ON public.knowledge_documents;

-- 创建新策略
CREATE POLICY "Students can manage own profile" ON public.students
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Students can manage own objectives" ON public.objectives
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own key results" ON public.key_results
    FOR ALL USING (auth.uid() IN (
        SELECT student_id FROM public.objectives WHERE id = objective_id
    ));

CREATE POLICY "Students can view own progress logs" ON public.progress_logs
    FOR ALL USING (auth.uid() IN (
        SELECT o.student_id FROM public.objectives o
        JOIN public.key_results kr ON o.id = kr.objective_id
        WHERE kr.id = key_result_id
    ));

CREATE POLICY "Students can manage own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own chat messages" ON public.chat_messages
    FOR ALL USING (auth.uid() IN (
        SELECT student_id FROM public.chat_sessions WHERE id = session_id
    ));

CREATE POLICY "Students can manage own learning activities" ON public.learning_activities
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own settings" ON public.student_settings
    FOR ALL USING (auth.uid() = student_id);

-- 知识库文档对所有认证用户可读
CREATE POLICY "Authenticated users can view knowledge documents" ON public.knowledge_documents
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. 插入知识库示例数据
-- =====================================================
INSERT INTO public.knowledge_documents (title, content, category, tags) VALUES
(
    '软件工程学习指南',
    '## 软件工程基础知识

### 什么是软件工程？
软件工程是一门研究用工程化方法构建和维护有效的、实用的和高质量的软件的学科。

### 核心原则
1. **模块化设计** - 将复杂系统分解为更小、可管理的模块
2. **代码复用** - 通过复用现有代码提高开发效率
3. **版本控制** - 使用Git等工具管理代码变更
4. **测试驱动开发** - 先写测试，后写实现代码
5. **持续集成** - 频繁集成代码变更并自动化测试

### 学习建议
- 掌握至少一门编程语言（如Java、Python、JavaScript）
- 学习数据结构和算法
- 了解设计模式
- 实践项目开发
- 学习团队协作工具',
    '学习资源',
    ARRAY['软件工程', '编程基础', '学习指南']
),
(
    'Java编程基础',
    '## Java编程入门

### Java特点
- **面向对象** - 支持封装、继承、多态
- **平台无关** - "一次编写，处处运行"
- **安全性高** - 内置安全机制
- **自动内存管理** - 垃圾回收机制

### 基础语法
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 学习路径
1. **基础语法** - 变量、数据类型、控制结构
2. **面向对象** - 类、对象、继承、封装、多态
3. **集合框架** - List、Set、Map等数据结构
4. **异常处理** - try-catch-finally
5. **文件I/O** - 文件读写操作
6. **多线程** - 并发编程基础

### 实践项目建议
- 计算器应用
- 学生管理系统
- 简单的Web应用',
    '编程语言',
    ARRAY['Java', '编程', '面向对象']
),
(
    '数据结构与算法',
    '## 数据结构与算法学习指南

### 基础数据结构
1. **数组 (Array)** - 连续存储的数据集合
2. **链表 (Linked List)** - 通过指针连接的节点序列
3. **栈 (Stack)** - 后进先出(LIFO)的数据结构
4. **队列 (Queue)** - 先进先出(FIFO)的数据结构
5. **树 (Tree)** - 层次化的数据结构
6. **图 (Graph)** - 节点和边的集合

### 常见算法
1. **排序算法** - 冒泡排序、快速排序、归并排序
2. **搜索算法** - 线性搜索、二分搜索
3. **图算法** - BFS、DFS、最短路径
4. **动态规划** - 斐波那契数列、背包问题

### 学习策略
- 理解概念和原理
- 手写代码实现
- 分析时间和空间复杂度
- 刷题练习（LeetCode等平台）
- 应用到实际项目中

### 推荐资源
- 《算法导论》
- LeetCode刷题平台
- 可视化算法网站',
    '算法基础',
    ARRAY['数据结构', '算法', '编程基础']
),
(
    'Web开发基础',
    '## Web开发入门指南

### 前端技术栈
1. **HTML** - 网页结构标记语言
2. **CSS** - 样式和布局
3. **JavaScript** - 交互逻辑编程
4. **React/Vue** - 现代前端框架

### 后端技术栈
1. **Node.js** - JavaScript运行环境
2. **Express.js** - Web应用框架
3. **数据库** - MySQL、MongoDB、PostgreSQL
4. **API设计** - RESTful API、GraphQL

### 学习路径
#### 第一阶段：前端基础
- HTML标签和语义化
- CSS选择器、布局（Flexbox、Grid）
- JavaScript基础语法和DOM操作

#### 第二阶段：前端进阶
- 现代JavaScript (ES6+)
- 前端框架 (React/Vue)
- 包管理工具 (npm/yarn)
- 构建工具 (Webpack/Vite)

#### 第三阶段：全栈开发
- 后端开发基础
- 数据库设计和操作
- API开发和测试
- 部署和运维基础

### 实践项目
- 个人博客网站
- 待办事项应用
- 电商网站
- 社交媒体应用',
    'Web开发',
    ARRAY['Web开发', '前端', '后端', 'JavaScript']
),
(
    'Git版本控制指南',
    '## Git使用指南

### Git基础概念
- **仓库(Repository)** - 存储项目代码的地方
- **提交(Commit)** - 代码变更的快照
- **分支(Branch)** - 代码的平行开发线
- **合并(Merge)** - 将分支变更合并到主分支

### 常用命令
```bash
# 初始化仓库
git init

# 添加文件到暂存区
git add .

# 提交变更
git commit -m "提交信息"

# 查看状态
git status

# 查看提交历史
git log

# 创建分支
git branch feature-name

# 切换分支
git checkout feature-name

# 合并分支
git merge feature-name
```

### 工作流程
1. 克隆或初始化仓库
2. 创建功能分支
3. 开发功能并提交
4. 推送到远程仓库
5. 创建Pull Request
6. 代码评审和合并

### 最佳实践
- 提交信息要清晰明确
- 频繁提交，每个提交解决一个问题
- 使用分支开发新功能
- 定期同步远程仓库
- 代码合并前进行测试',
    '开发工具',
    ARRAY['Git', '版本控制', '协作开发']
);

-- =====================================================
-- 7. 创建实用函数
-- =====================================================

-- 函数：更新目标进度（根据关键结果平均值）
CREATE OR REPLACE FUNCTION public.update_objective_progress(objective_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.objectives
    SET progress = (
        SELECT COALESCE(AVG(progress), 0)
        FROM public.key_results
        WHERE objective_id = objective_uuid
    ),
    updated_at = NOW()
    WHERE id = objective_uuid;
END;
$$ LANGUAGE plpgsql;

-- 函数：为新注册用户自动创建学生档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.students (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Student'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：用户注册时自动创建学生档案
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 8. 显示创建结果
-- =====================================================
SELECT 
    '🎉 数据库创建完成！' as status,
    'Tables: ' || (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as table_count,
    'Knowledge docs: ' || (SELECT COUNT(*) FROM public.knowledge_documents) as knowledge_count,
    NOW() as created_at;