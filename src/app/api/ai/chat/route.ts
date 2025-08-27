import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// 发送消息给AI并保存聊天记录
export async function POST(request: NextRequest) {
  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { message, session_id, session_type = 'general' } = body

    let sessionId = session_id

    // 如果没有提供session_id，创建新的聊天会话
    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          student_id: user.id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          session_type
        })
        .select()
        .single()

      if (sessionError) {
        console.error('创建聊天会话失败:', sessionError)
        return NextResponse.json({ error: '创建聊天会话失败' }, { status: 500 })
      }

      sessionId = newSession.id
    }

    // 保存用户消息
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'user',
        content: message,
        message_type: 'text'
      })

    if (userMsgError) {
      console.error('保存用户消息失败:', userMsgError)
      return NextResponse.json({ error: '保存用户消息失败' }, { status: 500 })
    }

    // 生成AI回复
    const aiResponse = await generateAIResponse(message, session_type, user.id, supabase)

    // 保存AI消息
    const { data: aiMessage, error: aiMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'ai',
        content: aiResponse.content,
        message_type: 'text',
        metadata: {
          suggestions: aiResponse.suggestions,
          confidence: aiResponse.confidence
        }
      })
      .select()
      .single()

    if (aiMsgError) {
      console.error('保存AI消息失败:', aiMsgError)
      return NextResponse.json({ error: '保存AI消息失败' }, { status: 500 })
    }

    return NextResponse.json({
      session_id: sessionId,
      ai_message: aiMessage,
      suggestions: aiResponse.suggestions
    })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// AI回复生成函数 (目前使用规则引擎，可以替换为真实的AI API调用)
async function generateAIResponse(message: string, sessionType: string, userId: string, supabase: any) {
  try {
    // 获取用户的OKR信息用于个性化回复
    const { data: objectives } = await supabase
      .from('objectives')
      .select('title, status, progress')
      .eq('student_id', userId)
      .eq('status', 'active')
      .limit(3)

    const userContext = {
      activeObjectives: objectives || []
    }

    // 根据不同类型的会话和消息内容生成回复
    if (sessionType === 'okr_coaching') {
      return generateOKRCoachingResponse(message, userContext)
    } else if (sessionType === 'knowledge_qa') {
      return await generateKnowledgeQAResponse(message, supabase)
    } else {
      return generateGeneralResponse(message, userContext)
    }
  } catch (error) {
    console.error('生成AI回复失败:', error)
    return {
      content: '抱歉，我现在无法回复您的消息。请稍后再试。',
      suggestions: ['重新提问', '查看学习计划', '联系技术支持'],
      confidence: 0.1
    }
  }
}

function generateOKRCoachingResponse(message: string, userContext: any) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('目标') || lowerMessage.includes('okr')) {
    const activeCount = userContext.activeObjectives.length
    return {
      content: `我看到您目前有${activeCount}个活跃目标。让我来帮您分析一下：\n\n${
        activeCount > 0 
          ? `您的目标包括：${userContext.activeObjectives.map((obj: any) => `"${obj.title}" (进度: ${obj.progress.toFixed(1)}%)`).join('、')}\n\n建议您：\n1. 专注于进度较低的目标\n2. 将大目标分解为小的行动步骤\n3. 定期回顾和调整目标`
          : '建议您先设定一些具体的学习目标，比如掌握某项技能或完成某个项目。'
      }`,
      suggestions: ['查看目标详情', '设定新目标', '更新进度'],
      confidence: 0.9
    }
  }

  return {
    content: '作为您的OKR教练，我可以帮您制定目标、追踪进度、提供改进建议。请告诉我您想要在哪个方面得到帮助？',
    suggestions: ['目标设定', '进度追踪', '学习计划'],
    confidence: 0.8
  }
}

async function generateKnowledgeQAResponse(message: string, supabase: any) {
  // 这里可以实现RAG功能，搜索知识库文档
  // 目前提供模拟回复
  
  const { data: documents } = await supabase
    .from('knowledge_documents')
    .select('title, content')
    .eq('is_processed', true)
    .limit(5)

  if (documents && documents.length > 0) {
    return {
      content: `基于我的知识库，我为您找到了相关信息：\n\n${
        message.includes('算法') 
          ? '算法学习建议：\n1. 从基础数据结构开始\n2. 刷题要有针对性\n3. 理解原理比记忆更重要\n\n相关文档：《数据结构与算法基础》'
          : '很抱歉，我需要更具体的问题才能提供准确的答案。请告诉我您想了解的具体内容。'
      }`,
      suggestions: ['算法学习', '数据结构', '编程基础'],
      confidence: 0.7
    }
  }

  return {
    content: '知识库正在建设中，目前我可以为您提供一般性的学习建议。您有什么具体的学习问题吗？',
    suggestions: ['学习方法', '时间管理', '技能提升'],
    confidence: 0.6
  }
}

function generateGeneralResponse(message: string, userContext: any) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('学习') || lowerMessage.includes('提升')) {
    return {
      content: '很高兴您想要提升自己！根据您的情况，我建议：\n\n1. **制定明确目标**：设定具体、可衡量的学习目标\n2. **制定学习计划**：安排合理的学习时间\n3. **持续追踪进度**：定期检查和调整\n\n您希望在哪个领域提升呢？',
      suggestions: ['制定学习计划', '推荐学习资源', '分析学习障碍'],
      confidence: 0.8
    }
  }

  if (lowerMessage.includes('计划') || lowerMessage.includes('安排')) {
    return {
      content: '制定好的学习计划是成功的一半！建议您：\n\n📋 **明确目标**：确定要达成什么\n⏰ **时间规划**：合理分配学习时间\n📊 **进度追踪**：定期检查完成情况\n🔄 **灵活调整**：根据实际情况优化\n\n需要我帮您制定具体的计划吗？',
      suggestions: ['制定学习计划', '时间管理技巧', '设定学习目标'],
      confidence: 0.9
    }
  }

  return {
    content: '您好！我是您的AI学习伴侣，可以帮助您制定学习计划、设定目标、追踪进度。有什么可以为您做的吗？',
    suggestions: ['制定学习计划', '推荐学习资源', '分析学习障碍'],
    confidence: 0.7
  }
}