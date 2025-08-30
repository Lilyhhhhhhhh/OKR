import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 不使用类型约束，直接创建客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 获取学生的所有目标
export async function GET(request: NextRequest) {
  try {
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

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const limit = url.searchParams.get('limit')
    let query = supabase
      .from('objectives')
      .select(`
        *,
        key_results (*)
      `)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: objectives, error } = await query

    if (error) {
      console.error('获取目标失败:', error)
      return NextResponse.json({ error: '获取目标失败' }, { status: 500 })
    }

    return NextResponse.json(objectives)
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 创建新目标
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { title, description, category, priority, target_date, key_results } = body
    // 创建目标
    const { data: objective, error: objError } = await supabase
      .from('objectives')
      .insert({
        student_id: user.id,
        title,
        description,
        category,
        priority,
        target_date
      })
      .select()
      .single()

    if (objError) {
      console.error('创建目标失败:', objError)
      return NextResponse.json({ error: '创建目标失败' }, { status: 500 })
    }

    // 创建关键结果
    if (key_results && key_results.length > 0) {
      const keyResultsData = key_results.map((kr: any) => ({
        objective_id: objective.id,
        title: kr.title,
        description: kr.description,
        metric_type: kr.metric_type || 'percentage',
        target_value: kr.target_value
      }))

      const { error: krError } = await supabase
        .from('key_results')
        .insert(keyResultsData)

      if (krError) {
        console.error('创建关键结果失败:', krError)
        // 回滚：删除已创建的目标
        await supabase.from('objectives').delete().eq('id', objective.id)
        return NextResponse.json({ error: '创建关键结果失败' }, { status: 500 })
      }
    }

    // 返回完整的目标信息
    const { data: completeObjective, error: fetchError } = await supabase
      .from('objectives')
      .select(`
        *,
        key_results (*)
      `)
      .eq('id', objective.id)
      .single()

    if (fetchError) {
      console.error('获取完整目标信息失败:', fetchError)
      return NextResponse.json(objective, { status: 201 })
    }

    return NextResponse.json(completeObjective, { status: 201 })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

