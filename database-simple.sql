-- 启明星OKR平台 - 简化数据库结构
-- 适用于 Pages Router 和基础功能

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 学生信息表 (扩展 auth.users)
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

-- 2. 目标表
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

-- 3. 关键结果表
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 聊天会话表
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200),
    session_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 聊天消息表
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_objectives_student_id ON public.objectives(student_id);
CREATE INDEX IF NOT EXISTS idx_objectives_status ON public.objectives(status);
CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON public.key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_student_id ON public.chat_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为表添加更新时间触发器
DO $$
BEGIN
    -- students 表
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_students_updated_at') THEN
        CREATE TRIGGER trigger_students_updated_at
            BEFORE UPDATE ON public.students
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- objectives 表
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_objectives_updated_at') THEN
        CREATE TRIGGER trigger_objectives_updated_at
            BEFORE UPDATE ON public.objectives
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- key_results 表
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_key_results_updated_at') THEN
        CREATE TRIGGER trigger_key_results_updated_at
            BEFORE UPDATE ON public.key_results
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- chat_sessions 表
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_chat_sessions_updated_at') THEN
        CREATE TRIGGER trigger_chat_sessions_updated_at
            BEFORE UPDATE ON public.chat_sessions
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END
$$;

-- 启用 Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
-- 学生只能访问自己的数据
CREATE POLICY IF NOT EXISTS "Students can manage own profile" ON public.students
    FOR ALL USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Students can manage own objectives" ON public.objectives
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY IF NOT EXISTS "Students can manage own key results" ON public.key_results
    FOR ALL USING (auth.uid() IN (
        SELECT student_id FROM public.objectives WHERE id = objective_id
    ));

CREATE POLICY IF NOT EXISTS "Students can manage own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY IF NOT EXISTS "Students can manage own chat messages" ON public.chat_messages
    FOR ALL USING (auth.uid() IN (
        SELECT student_id FROM public.chat_sessions WHERE id = session_id
    ));

-- 插入示例数据（可选）
-- 注意：这些数据会在用户注册后自动创建，这里仅作为测试
/*
INSERT INTO public.students (id, full_name, student_id, grade, major, class_name) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', '测试学生', 'S2024001', '大二', '软件工程', '软件2101');
*/