import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, validateAuth } from '@/lib/supabase-server'

type Params = Promise<{ id: string }>

// 删除指定目标
export async function DELETE(
  request: NextRequest,
  props: { params: Params }
) {
  try {
    const params = await props.params
    const { id: objectiveId } = params
    
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const supabase = createServerClient(request)
    // 验证目标是否属于当前用户
    const { data: objective, error: fetchError } = await supabase
      .from('objectives')
      .select('id, student_id')
      .eq('id', objectiveId)
      .eq('student_id', user.id)
      .single()

    if (fetchError || !objective) {
      return NextResponse.json({ error: '目标不存在或无权限删除' }, { status: 404 })
    }

    // 删除目标（关键结果会由于外键约束自动删除）
    const { error: deleteError } = await supabase
      .from('objectives')
      .delete()
      .eq('id', objectiveId)
      .eq('student_id', user.id)

    if (deleteError) {
      console.error('删除目标失败:', deleteError)
      return NextResponse.json({ error: '删除目标失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '目标删除成功' })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 获取单个目标详情
export async function GET(
  request: NextRequest,
  props: { params: Params }
) {
  try {
    const params = await props.params
    const { id: objectiveId } = params
    
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const supabase = createServerClient(request)
    const { data: objective, error } = await supabase
      .from('objectives')
      .select(`
        *,
        key_results (*)
      `)
      .eq('id', objectiveId)
      .eq('student_id', user.id)
      .single()

    if (error) {
      console.error('获取目标详情失败:', error)
      return NextResponse.json({ error: '目标不存在' }, { status: 404 })
    }

    return NextResponse.json(objective)
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}