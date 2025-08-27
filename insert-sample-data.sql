-- 插入示例数据脚本
-- 注意：这个脚本需要在用户注册后手动执行，或者用于测试目的

-- =====================================================
-- 示例学生数据 (需要真实的 auth.users ID)
-- =====================================================

-- 请替换下面的 UUID 为实际注册用户的 ID
-- 可以从 Supabase Dashboard > Authentication > Users 获取真实的用户ID

-- 示例：为已存在的用户插入学生信息
-- INSERT INTO public.students (id, full_name, student_id, grade, major, class_name, phone) VALUES
-- ('你的真实用户UUID', '张三', '2024001', '大二', '软件工程', '软件2101', '13800138000');

-- =====================================================
-- 为测试用户创建示例OKR数据
-- =====================================================

-- 注意：以下是模板，实际使用时需要替换为真实的student_id
DO $$
DECLARE
    sample_student_id UUID;
    objective1_id UUID;
    objective2_id UUID;
    objective3_id UUID;
    session1_id UUID;
BEGIN
    -- 这里需要一个真实的学生ID，你可以手动替换
    -- sample_student_id := '你的真实学生UUID';
    
    -- 如果没有真实用户，跳过数据插入
    -- 以下代码仅作为示例结构，实际使用时取消注释并提供真实ID
    
    /*
    -- 插入示例目标1：提升编程能力
    INSERT INTO public.objectives (student_id, title, description, category, priority, target_date)
    VALUES (sample_student_id, '提升Java编程能力', '通过系统学习和实践项目，掌握Java核心技术和框架应用', '技能提升', 'high', '2024-06-30')
    RETURNING id INTO objective1_id;
    
    -- 为目标1添加关键结果
    INSERT INTO public.key_results (objective_id, title, description, target_value, current_value) VALUES
    (objective1_id, '完成Java基础课程学习', '完成Java SE核心技术学习，包括面向对象、集合框架、异常处理等', 100, 45),
    (objective1_id, '完成3个实践项目', '独立完成3个Java项目：计算器、学生管理系统、简单Web应用', 3, 1),
    (objective1_id, '通过Java认证考试', '获得Oracle Java SE 8 Programmer认证', 1, 0);
    
    -- 插入示例目标2：数据结构与算法
    INSERT INTO public.objectives (student_id, title, description, category, priority, target_date)
    VALUES (sample_student_id, '掌握数据结构与算法', '系统学习常用数据结构和算法，提升编程思维和解决问题能力', '学术学习', 'high', '2024-08-31')
    RETURNING id INTO objective2_id;
    
    -- 为目标2添加关键结果
    INSERT INTO public.key_results (objective_id, title, description, target_value, current_value) VALUES
    (objective2_id, '学习8种数据结构', '掌握数组、链表、栈、队列、树、图等数据结构', 8, 3),
    (objective2_id, '掌握10种算法', '学习排序、搜索、图算法、动态规划等经典算法', 10, 2),
    (objective2_id, '解决100道算法题', '在LeetCode等平台完成100道算法练习题', 100, 25);
    
    -- 插入示例目标3：Web开发项目
    INSERT INTO public.objectives (student_id, title, description, category, priority, target_date)
    VALUES (sample_student_id, '完成个人Web项目', '设计并开发一个完整的Web应用，包含前后端和数据库', '项目实践', 'medium', '2024-12-31')
    RETURNING id INTO objective3_id;
    
    -- 为目标3添加关键结果
    INSERT INTO public.key_results (objective_id, title, description, target_value, current_value) VALUES
    (objective3_id, '完成前端页面设计', '使用React和Tailwind CSS完成5个主要页面', 5, 2),
    (objective3_id, '实现后端API', '使用Node.js和Express开发RESTful API', 1, 0),
    (objective3_id, '部署上线项目', '将项目部署到云平台并能正常访问', 1, 0);
    
    -- 更新目标进度
    PERFORM public.update_objective_progress(objective1_id);
    PERFORM public.update_objective_progress(objective2_id);
    PERFORM public.update_objective_progress(objective3_id);
    
    -- 插入示例聊天会话
    INSERT INTO public.chat_sessions (student_id, title, session_type)
    VALUES (sample_student_id, '学习计划咨询', 'general')
    RETURNING id INTO session1_id;
    
    -- 插入示例聊天消息
    INSERT INTO public.chat_messages (session_id, sender_type, content) VALUES
    (session1_id, 'user', '我想制定一个Java学习计划，应该从哪里开始？'),
    (session1_id, 'ai', '很好的想法！Java学习建议按以下步骤进行：

1. **基础语法**：变量、数据类型、运算符、控制结构
2. **面向对象**：类、对象、继承、封装、多态
3. **核心API**：String、集合框架、异常处理
4. **实践项目**：从简单的控制台应用开始

建议每天学习1-2小时，理论与实践相结合。你目前的编程基础如何？'),
    (session1_id, 'user', '我有一点Python基础，但Java是第一次学'),
    (session1_id, 'ai', '有Python基础很好！这会帮你更快理解面向对象编程概念。

针对你的情况，我建议：

**第一周**：Java环境搭建 + 基础语法
- 安装JDK和IDE（推荐IntelliJ IDEA）
- 学习Java语法差异（如强类型、分号、花括号等）

**第二周**：面向对象编程
- 类和对象的概念
- 封装、继承、多态

**第三周**：Java核心API
- String处理
- ArrayList、HashMap等集合

要不要我帮你制定一个详细的学习OKR？');
    
    -- 插入学习活动记录
    INSERT INTO public.learning_activities (student_id, activity_type, activity_name, duration_minutes, related_objective_id) VALUES
    (sample_student_id, 'video_learning', 'Java基础语法视频课程', 120, objective1_id),
    (sample_student_id, 'coding_practice', '数组和链表练习题', 90, objective2_id),
    (sample_student_id, 'project_work', 'React组件开发', 150, objective3_id),
    (sample_student_id, 'reading', '《算法导论》第一章阅读', 60, objective2_id);
    
    RAISE NOTICE '示例数据插入完成！';
    */
    
    -- 提示信息
    RAISE NOTICE '此脚本包含示例数据结构，需要真实用户ID才能执行';
    RAISE NOTICE '请先注册用户，然后替换脚本中的sample_student_id';
    
END $$;