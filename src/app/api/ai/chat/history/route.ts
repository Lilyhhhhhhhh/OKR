import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// 获取聊天历史记录
export async function GET(request: NextRequest) {
  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id')
    const limit = url.searchParams.get('limit') || '50'

    if (sessionId) {
      // 获取特定会话的消息
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          chat_sessions!inner(student_id)
        `)
        .eq('session_id', sessionId)
        .eq('chat_sessions.student_id', user.id)
        .order('created_at', { ascending: true })
        .limit(parseInt(limit))

      if (error) {
        console.error('获取聊天消息失败:', error)
        return NextResponse.json({ error: '获取聊天消息失败' }, { status: 500 })
      }

      return NextResponse.json(messages)
    } else {
      // 获取用户的所有聊天会话
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages(content, created_at, sender_type)
        `)
        .eq('student_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('获取聊天会话失败:', error)
        return NextResponse.json({ error: '获取聊天会话失败' }, { status: 500 })
      }

      // 为每个会话添加最后一条消息作为预览
      const sessionsWithPreview = sessions.map((session: any) => {
        const lastMessage = session.chat_messages && session.chat_messages.length > 0
          ? session.chat_messages[session.chat_messages.length - 1]
          : null

        return {
          ...session,
          last_message: lastMessage,
          message_count: session.chat_messages ? session.chat_messages.length : 0
        }
      })

      return NextResponse.json(sessionsWithPreview)
    }
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 删除聊天会话
export async function DELETE(request: NextRequest) {
  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { session_id } = body

    // 验证会话所有权
    const { data: session, error: fetchError } = await supabase
      .from('chat_sessions')
      .select('student_id')
      .eq('id', session_id)
      .single()

    if (fetchError || !session) {
      return NextResponse.json({ error: '聊天会话不存在' }, { status: 404 })
    }

    if ((session as any).student_id !== user.id) {
      return NextResponse.json({ error: '无权限删除此会话' }, { status: 403 })
    }

    // 删除会话 (级联删除消息)
    const { error: deleteError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', session_id)

    if (deleteError) {
      console.error('删除聊天会话失败:', deleteError)
      return NextResponse.json({ error: '删除聊天会话失败' }, { status: 500 })
    }

    return NextResponse.json({ message: '聊天会话已删除' })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}