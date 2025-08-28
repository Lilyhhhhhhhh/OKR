import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, validateAuth } from '@/lib/supabase-server'

// 发送问答消息到n8n webhook
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { question, session_id } = body

    if (!question?.trim()) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 })
    }

    const supabase = createServerClient(request)
    let currentSessionId = session_id

    // 如果没有会话ID，创建新会话
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('knowledge_qa_sessions')
        .insert({
          student_id: user.id,
          title: question.length > 50 ? question.substring(0, 50) + '...' : question
        })
        .select()
        .single()

      if (sessionError) {
        console.error('创建聊天会话失败:', sessionError)
        return NextResponse.json({ error: '创建聊天会话失败' }, { status: 500 })
      }

      currentSessionId = newSession.id
    }

    // 保存用户问题
    const { error: messageError } = await supabase
      .from('knowledge_qa_messages')
      .insert({
        session_id: currentSessionId,
        sender_type: 'user',
        content: question,
        question_type: 'knowledge_query'
      })

    if (messageError) {
      console.error('保存用户消息失败:', messageError)
      return NextResponse.json({ error: '保存消息失败' }, { status: 500 })
    }

    // 调用n8n webhook
    const startTime = Date.now()
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/knowledge-qa'
    
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          user_id: user.id,
          session_id: currentSessionId,
          timestamp: new Date().toISOString()
        }),
        // 30秒超时
        signal: AbortSignal.timeout(30000)
      })

      if (!n8nResponse.ok) {
        throw new Error(`n8n响应错误: ${n8nResponse.status}`)
      }

      const aiResult = await n8nResponse.json()
      const processingTime = Date.now() - startTime

      // 保存AI回答
      const { error: aiMessageError } = await supabase
        .from('knowledge_qa_messages')
        .insert({
          session_id: currentSessionId,
          sender_type: 'ai',
          content: aiResult.answer || aiResult.response || '抱歉，我无法回答这个问题。',
          related_knowledge_ids: aiResult.related_knowledge_ids || [],
          processing_time: processingTime,
          confidence_score: aiResult.confidence || null
        })

      if (aiMessageError) {
        console.error('保存AI消息失败:', aiMessageError)
        // 即使保存失败，也要返回AI回答给用户
      }

      return NextResponse.json({
        success: true,
        session_id: currentSessionId,
        answer: aiResult.answer || aiResult.response,
        confidence: aiResult.confidence,
        processing_time: processingTime,
        related_knowledge: aiResult.related_knowledge || []
      })

    } catch (n8nError) {
      console.error('调用n8n失败:', n8nError)
      
      // 保存错误响应
      await supabase
        .from('knowledge_qa_messages')
        .insert({
          session_id: currentSessionId,
          sender_type: 'ai',
          content: '抱歉，AI服务暂时不可用，请稍后再试。',
          processing_time: Date.now() - startTime
        })

      return NextResponse.json({
        success: false,
        session_id: currentSessionId,
        answer: '抱歉，AI服务暂时不可用，请稍后再试。',
        error: 'AI服务错误'
      }, { status: 503 })
    }

  } catch (error) {
    console.error('知识库问答错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 获取聊天历史
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const supabase = createServerClient(request)

    if (sessionId) {
      // 获取特定会话的消息历史
      const { data: messages, error } = await supabase
        .from('knowledge_qa_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('获取聊天历史失败:', error)
        return NextResponse.json({ error: '获取聊天历史失败' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        session_id: sessionId,
        messages: messages || []
      })
    } else {
      // 获取用户的所有会话
      const { data: sessions, error } = await supabase
        .from('knowledge_qa_sessions')
        .select('*')
        .eq('student_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('获取会话列表失败:', error)
        return NextResponse.json({ error: '获取会话列表失败' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        sessions: sessions || []
      })
    }

  } catch (error) {
    console.error('获取聊天历史错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}