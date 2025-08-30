import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 不使用类型约束，直接创建客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    // 从params中获取ID参数
    const { id: keyResultId } = await props.params
    
    // 简化认证检查（在服务端API中）
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { current_value, note } = body
    
    // 获取当前关键结果信息
    const { data: keyResult, error: keyResultError } = await supabase
      .from('key_results')
      .select('*')
      .eq('id', keyResultId)
      .single()

    if (keyResultError || !keyResult) {
      return NextResponse.json({ error: '关键结果不存在' }, { status: 404 })
    }

    // 计算进度百分比
    const targetValue = keyResult.target_value
    const progressPercentage = targetValue 
      ? (current_value / targetValue) * 100 
      : 0

    // 更新进度
    const { error: updateError } = await supabase
      .from('key_results')
      .update({
        current_value,
        progress: Math.min(progressPercentage, 100),
        updated_at: new Date().toISOString()
      })
      .eq('id', keyResultId)

    if (updateError) {
      console.error('更新关键结果失败:', updateError)
      return NextResponse.json({ error: '更新失败' }, { status: 500 })
    }

    // 记录进度更新历史
    const { error: historyError } = await supabase
      .from('progress_logs')
      .insert({
        key_result_id: keyResultId,
        previous_value: keyResult.current_value,
        new_value: current_value,
        progress_change: progressPercentage - (keyResult.progress || 0),
        update_type: 'manual',
        note: note || '手动更新进度'
      })

    if (historyError) {
      console.error('记录历史失败:', historyError)
    }

    // 更新目标的整体进度
    await updateObjectiveProgress(keyResult.objective_id, supabase)

    return NextResponse.json({ 
      success: true, 
      message: '进度更新成功',
      data: {
        current_value,
        progress: Math.min(progressPercentage, 100),
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

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    // 从params中获取ID参数
    const { id: keyResultId } = await props.params
    
    // 简化认证检查（在服务端API中）
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }
    
    // 获取关键结果进度历史
    const { data: progressHistory, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('key_result_id', keyResultId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取进度历史失败:', error)
      return NextResponse.json({ error: '获取进度历史失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: progressHistory
    })
    
  } catch (error) {
    console.error('获取进度历史错误:', error)
    return NextResponse.json(
      { error: '内部服务器错误' }, 
      { status: 500 }
    )
  }
}

// 更新目标的整体进度
async function updateObjectiveProgress(objectiveId: string, supabase: any) {
  try {
    // 获取目标下的所有关键结果
    const { data: keyResults, error } = await supabase
      .from('key_results')
      .select('progress')
      .eq('objective_id', objectiveId)

    if (error || !keyResults) {
      console.error('获取关键结果失败:', error)
      return
    }

    // 计算平均进度
    const totalProgress = keyResults.reduce((sum: number, kr: any) => sum + (kr.progress || 0), 0)
    const averageProgress = keyResults.length > 0 ? totalProgress / keyResults.length : 0

    // 更新目标的进度
    const { error: updateError } = await supabase
      .from('objectives')
      .update({ 
        progress: Math.round(averageProgress),
        updated_at: new Date().toISOString() 
      })
      .eq('id', objectiveId)

    if (updateError) {
      console.error('更新目标进度失败:', updateError)
    }
  } catch (error) {
    console.error('更新目标进度错误:', error)
  }
}