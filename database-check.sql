-- 数据库检查脚本
-- 在 Supabase SQL Editor 中运行此脚本来验证数据库设置

-- =====================================================
-- 1. 检查所有表是否创建成功
-- =====================================================
SELECT 
    '📋 表创建检查' as check_type,
    tablename as table_name,
    '✅ 存在' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'students', 'objectives', 'key_results', 'progress_logs',
    'chat_sessions', 'chat_messages', 'learning_activities',
    'student_settings', 'knowledge_documents'
)
ORDER BY tablename;

-- =====================================================
-- 2. 检查知识库数据
-- =====================================================
SELECT 
    '📚 知识库数据检查' as check_type,
    COUNT(*) as document_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ 有数据'
        ELSE '❌ 无数据'
    END as status
FROM public.knowledge_documents;

-- 显示知识库文档标题
SELECT 
    '📖 知识库文档' as type,
    title,
    category,
    array_length(tags, 1) as tag_count
FROM public.knowledge_documents
ORDER BY created_at;

-- =====================================================
-- 3. 检查索引
-- =====================================================
SELECT 
    '🔍 索引检查' as check_type,
    indexname as index_name,
    tablename as table_name,
    '✅ 已创建' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- 4. 检查触发器
-- =====================================================
SELECT 
    '⚡ 触发器检查' as check_type,
    trigger_name,
    event_object_table as table_name,
    '✅ 已创建' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name LIKE 'trigger_%'
ORDER BY event_object_table;

-- =====================================================
-- 5. 检查RLS策略
-- =====================================================
SELECT 
    '🔒 RLS策略检查' as check_type,
    schemaname,
    tablename,
    policyname,
    '✅ 已启用' as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 6. 检查函数
-- =====================================================
SELECT 
    '🔧 函数检查' as check_type,
    routine_name as function_name,
    routine_type,
    '✅ 已创建' as status
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('handle_updated_at', 'handle_new_user', 'update_objective_progress', 'get_student_stats')
ORDER BY routine_name;

-- =====================================================
-- 7. 数据库统计
-- =====================================================
SELECT 
    '📊 数据库统计' as info,
    'public' as schema_name,
    COUNT(DISTINCT tablename) as total_tables
FROM pg_tables 
WHERE schemaname = 'public';

-- 显示每个表的记录数
SELECT 
    '📈 表记录统计' as type,
    'students' as table_name,
    COUNT(*) as record_count
FROM public.students
UNION ALL
SELECT 
    '📈 表记录统计' as type,
    'objectives' as table_name,
    COUNT(*) as record_count
FROM public.objectives
UNION ALL
SELECT 
    '📈 表记录统计' as type,
    'key_results' as table_name,
    COUNT(*) as record_count
FROM public.key_results
UNION ALL
SELECT 
    '📈 表记录统计' as type,
    'knowledge_documents' as table_name,
    COUNT(*) as record_count
FROM public.knowledge_documents
ORDER BY table_name;

-- =====================================================
-- 8. 权限检查
-- =====================================================
SELECT 
    '🔐 RLS状态检查' as check_type,
    schemaname,
    tablename,
    CASE rowsecurity 
        WHEN true THEN '✅ RLS已启用'
        ELSE '❌ RLS未启用'
    END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.schemaname = 'public'
AND t.tablename IN ('students', 'objectives', 'key_results', 'chat_sessions', 'chat_messages')
ORDER BY tablename;

-- =====================================================
-- 成功消息
-- =====================================================
SELECT 
    '🎉 检查完成！' as status,
    '如果上面显示的项目都有 ✅ 标记，说明数据库配置正确！' as message,
    NOW() as check_time;