-- 知识库问答功能数据表

-- 知识库表（简化版，按需求定制）
CREATE TABLE public.knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[], -- 标签数组
    category VARCHAR(100), -- 分类
    author VARCHAR(100), -- 作者
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 知识库问答聊天会话表（扩展现有chat_sessions）
CREATE TABLE public.knowledge_qa_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) DEFAULT '知识库问答',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 知识库问答消息表（扩展现有chat_messages）
CREATE TABLE public.knowledge_qa_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.knowledge_qa_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'general', -- 问题类型
    related_knowledge_ids UUID[], -- 相关知识库条目ID数组
    processing_time INTEGER, -- AI处理时间（毫秒）
    confidence_score DECIMAL(3,2), -- 置信度 (0-1)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_knowledge_base_title ON public.knowledge_base(title);
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_qa_sessions_student_id ON public.knowledge_qa_sessions(student_id);
CREATE INDEX idx_knowledge_qa_messages_session_id ON public.knowledge_qa_messages(session_id);
CREATE INDEX idx_knowledge_qa_messages_created_at ON public.knowledge_qa_messages(created_at);

-- 添加更新时间触发器
CREATE TRIGGER trigger_knowledge_base_updated_at
    BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_knowledge_qa_sessions_updated_at
    BEFORE UPDATE ON public.knowledge_qa_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 启用RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_qa_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_qa_messages ENABLE ROW LEVEL SECURITY;

-- 知识库对所有认证用户可读
CREATE POLICY "Authenticated users can view knowledge base" ON public.knowledge_base
    FOR SELECT USING (auth.role() = 'authenticated');

-- 管理员可以管理知识库
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 学生只能管理自己的问答会话
CREATE POLICY "Students can manage own qa sessions" ON public.knowledge_qa_sessions
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own qa messages" ON public.knowledge_qa_messages
    FOR ALL USING (auth.uid() IN (
        SELECT student_id FROM public.knowledge_qa_sessions WHERE id = session_id
    ));

-- 插入示例知识库数据
INSERT INTO public.knowledge_base (title, content, tags, category, author) VALUES
('React Hooks 基础', 'React Hooks 是 React 16.8 引入的新特性，让你在不编写 class 的情况下使用 state 以及其他的 React 特性。常用的 hooks 包括：useState、useEffect、useContext 等。useState 用于在函数组件中添加状态管理...', 
 ARRAY['React', 'Hooks', '前端', 'JavaScript'], '前端开发', '技术团队'),

('数据库设计原则', '良好的数据库设计应该遵循以下原则：1. 数据规范化，避免数据冗余；2. 合理的索引设计，提升查询性能；3. 外键约束保证数据完整性；4. 选择合适的数据类型；5. 考虑业务扩展性...', 
 ARRAY['数据库', '设计', 'SQL', '后端'], '数据库', '技术团队'),

('算法复杂度分析', '时间复杂度和空间复杂度是评估算法效率的重要指标。时间复杂度表示算法执行时间随输入规模增长的变化趋势，常见的有：O(1)、O(log n)、O(n)、O(n log n)、O(n²)等。空间复杂度表示算法执行过程中所需要的存储空间...', 
 ARRAY['算法', '复杂度', '数据结构', '计算机科学'], '算法与数据结构', '技术团队');