-- 启明星OKR教育平台数据库设计
-- Database Schema for Morning Star OKR Education Platform

-- =====================================================
-- 1. 用户认证和学生信息表
-- =====================================================

-- 学生扩展信息表 (Supabase自带auth.users表，这里扩展学生特有信息)
CREATE TABLE public.students (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) UNIQUE, -- 学号
    grade VARCHAR(20), -- 年级 (大一、大二等)
    major VARCHAR(100), -- 专业
    class_name VARCHAR(50), -- 班级
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. OKR目标管理相关表
-- =====================================================

-- 目标(Objectives)表
CREATE TABLE public.objectives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL, -- 目标标题
    description TEXT, -- 目标描述
    category VARCHAR(100), -- 目标分类 (学习、技能、项目等)
    priority VARCHAR(20) DEFAULT 'medium', -- 优先级 (high, medium, low)
    status VARCHAR(20) DEFAULT 'active', -- 状态 (active, paused, completed, cancelled)
    target_date DATE, -- 目标完成日期
    progress DECIMAL(5,2) DEFAULT 0.00, -- 总体进度 (0-100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 关键结果(Key Results)表
CREATE TABLE public.key_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    objective_id UUID REFERENCES public.objectives(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL, -- KR标题
    description TEXT, -- KR描述
    metric_type VARCHAR(50) DEFAULT 'percentage', -- 度量类型 (percentage, number, boolean)
    target_value DECIMAL(10,2), -- 目标值
    current_value DECIMAL(10,2) DEFAULT 0.00, -- 当前值
    progress DECIMAL(5,2) DEFAULT 0.00, -- 进度百分比 (0-100)
    status VARCHAR(20) DEFAULT 'active', -- 状态
    is_auto_tracked BOOLEAN DEFAULT FALSE, -- 是否AI自动追踪
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OKR进度记录表
CREATE TABLE public.progress_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_result_id UUID REFERENCES public.key_results(id) ON DELETE CASCADE NOT NULL,
    previous_value DECIMAL(10,2),
    new_value DECIMAL(10,2) NOT NULL,
    progress_change DECIMAL(5,2), -- 进度变化
    update_type VARCHAR(20) DEFAULT 'manual', -- 更新类型 (manual, auto_ai, system)
    note TEXT, -- 更新说明
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. AI聊天历史记录相关表
-- =====================================================

-- 聊天会话表
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200), -- 会话标题
    session_type VARCHAR(50) DEFAULT 'general', -- 会话类型 (general, okr_coaching, knowledge_qa)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 聊天消息表
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')), -- 发送者类型
    content TEXT NOT NULL, -- 消息内容
    message_type VARCHAR(50) DEFAULT 'text', -- 消息类型 (text, image, file, suggestion)
    metadata JSONB, -- 额外元数据 (如AI响应的置信度、相关文档等)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. 知识库管理相关表
-- =====================================================

-- 知识库文档表
CREATE TABLE public.knowledge_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50), -- PDF, Markdown, TXT等
    file_size BIGINT,
    file_url TEXT, -- 文件存储URL
    content TEXT, -- 提取的文本内容
    vector_embedding VECTOR(1536), -- 向量嵌入 (用于RAG)
    category VARCHAR(100), -- 文档分类
    tags TEXT[], -- 标签数组
    is_processed BOOLEAN DEFAULT FALSE, -- 是否已处理为向量
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 知识库文档块表 (用于RAG检索)
CREATE TABLE public.document_chunks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.knowledge_documents(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, -- 文档块内容
    chunk_index INTEGER NOT NULL, -- 块索引
    token_count INTEGER, -- token数量
    vector_embedding VECTOR(1536), -- 向量嵌入
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. 学习活动和数据追踪表 (用于AI自动更新OKR进度)
-- =====================================================

-- 学习活动表
CREATE TABLE public.learning_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 活动类型 (study_session, quiz_completed, project_submitted等)
    activity_name VARCHAR(300),
    description TEXT,
    duration_minutes INTEGER, -- 活动时长(分钟)
    score DECIMAL(5,2), -- 分数(如果适用)
    metadata JSONB, -- 活动相关元数据
    related_objective_id UUID REFERENCES public.objectives(id), -- 关联的目标
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. 系统配置和设置表
-- =====================================================

-- 系统设置表
CREATE TABLE public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学生个人设置表
CREATE TABLE public.student_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, setting_key)
);

-- =====================================================
-- 7. 创建索引以优化查询性能
-- =====================================================

-- 学生表索引
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_students_grade_major ON public.students(grade, major);

-- OKR相关索引
CREATE INDEX idx_objectives_student_id ON public.objectives(student_id);
CREATE INDEX idx_objectives_status ON public.objectives(status);
CREATE INDEX idx_key_results_objective_id ON public.key_results(objective_id);
CREATE INDEX idx_progress_logs_key_result_id ON public.progress_logs(key_result_id);

-- 聊天历史索引
CREATE INDEX idx_chat_sessions_student_id ON public.chat_sessions(student_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- 知识库索引
CREATE INDEX idx_knowledge_documents_category ON public.knowledge_documents(category);
CREATE INDEX idx_document_chunks_document_id ON public.document_chunks(document_id);

-- 学习活动索引
CREATE INDEX idx_learning_activities_student_id ON public.learning_activities(student_id);
CREATE INDEX idx_learning_activities_type ON public.learning_activities(activity_type);
CREATE INDEX idx_learning_activities_created_at ON public.learning_activities(created_at);

-- =====================================================
-- 8. 创建更新时间触发器
-- =====================================================

-- 通用更新时间触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_objectives_updated_at
    BEFORE UPDATE ON public.objectives
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_key_results_updated_at
    BEFORE UPDATE ON public.key_results
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_knowledge_documents_updated_at
    BEFORE UPDATE ON public.knowledge_documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 9. Row Level Security (RLS) 配置
-- =====================================================

-- 启用RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_settings ENABLE ROW LEVEL SECURITY;

-- 学生只能访问自己的数据
CREATE POLICY "Students can view own profile" ON public.students
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

CREATE POLICY "Authenticated users can view document chunks" ON public.document_chunks
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 10. 插入初始数据
-- =====================================================

-- 插入系统设置
INSERT INTO public.system_settings (key, value, description) VALUES
('ai_model', 'gpt-4', 'AI模型配置'),
('max_chat_history', '100', '最大聊天历史记录数'),
('okr_auto_update_enabled', 'true', '是否启用OKR自动更新'),
('knowledge_base_enabled', 'true', '是否启用知识库功能');

-- 插入示例知识库文档分类
-- (实际的文档内容需要通过管理界面上传)