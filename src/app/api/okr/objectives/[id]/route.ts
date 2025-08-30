import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 删除指定目标
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    // 从params中获取ID参数
    const { id: objectiveId } = await props.params
    
    // 简化认证检查
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    
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
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    // 从params中获取ID参数
    const { id: objectiveId } = await props.params
    
    // 简化认证检查
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    
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