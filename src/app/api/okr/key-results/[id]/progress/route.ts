import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { current_value, note } = body

    const { id: keyResultId } = await params

    // 获取当前关键结果信息
    const { data: keyResult, error: keyResultError } = await supabase
      .from('key_results')
      .select('*')
      .eq('id', keyResultId)
      .single()

    if (keyResultError || !keyResult) {
      return NextResponse.json({ error: '关键结果不存在' }, { status: 404 })
    }

    // 更新进度
    const { error: updateError } = await supabase
      .from('key_results')
      .update({
        current_value,
        updated_at: new Date().toISOString()
      })
      .eq('id', keyResultId)

    if (updateError) {
      return NextResponse.json({ error: '更新失败' }, { status: 500 })
    }

    // 记录进度更新历史
    if (note) {
      const { error: historyError } = await supabase
        .from('progress_history')
        .insert({
          key_result_id: keyResultId,
          user_id: user.id,
          previous_value: keyResult.current_value,
          new_value: current_value,
          note,
          created_at: new Date().toISOString()
        })

      if (historyError) {
        console.error('记录历史失败:', historyError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: '进度更新成功',
      data: {
        current_value,
        note
      }
    })

  } catch (error) {
    console.error('更新进度错误:', error)
    return NextResponse.json(
      { error: '内部服务器错误' }, 
      { status: 500 }
    )
  }
}