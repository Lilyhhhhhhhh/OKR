import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// 更新关键结果进度
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { current_value, note } = body
    const keyResultId = params.id

    // 获取当前关键结果信息
    const { data: currentKR, error: fetchError } = await supabase
      .from('key_results')
      .select(`
        *,
        objectives!inner(student_id)
      `)
      .eq('id', keyResultId)
      .single()

    if (fetchError || !currentKR) {
      return NextResponse.json({ error: '关键结果不存在' }, { status: 404 })
    }

    // 验证权限
    if (currentKR.objectives.student_id !== user.id) {
      return NextResponse.json({ error: '无权限修改此关键结果' }, { status: 403 })
    }

    // 计算新的进度百分比
    const newProgress = currentKR.target_value > 0 
      ? Math.min((current_value / currentKR.target_value) * 100, 100)
      : 0

    // 更新关键结果
    const { data: updatedKR, error: updateError } = await supabase
      .from('key_results')
      .update({
        current_value,
        progress: newProgress,
        updated_at: new Date().toISOString()
      })
      .eq('id', keyResultId)
      .select()
      .single()

    if (updateError) {
      console.error('更新关键结果失败:', updateError)
      return NextResponse.json({ error: '更新关键结果失败' }, { status: 500 })
    }

    // 记录进度日志
    await supabase.from('progress_logs').insert({
      key_result_id: keyResultId,
      previous_value: currentKR.current_value,
      new_value: current_value,
      progress_change: newProgress - currentKR.progress,
      update_type: 'manual',
      note
    })

    // 更新目标整体进度
    await updateObjectiveProgress(supabase, currentKR.objective_id)

    return NextResponse.json(updatedKR)
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 辅助函数：更新目标整体进度
async function updateObjectiveProgress(supabase: any, objectiveId: string) {
  try {
    // 获取目标下所有关键结果的进度
    const { data: keyResults, error } = await supabase
      .from('key_results')
      .select('progress')
      .eq('objective_id', objectiveId)

    if (error || !keyResults) return

    // 计算平均进度
    const totalProgress = keyResults.reduce((sum: number, kr: any) => sum + kr.progress, 0)
    const averageProgress = keyResults.length > 0 ? totalProgress / keyResults.length : 0

    // 更新目标进度
    await supabase
      .from('objectives')
      .update({
        progress: averageProgress,
        updated_at: new Date().toISOString()
      })
      .eq('id', objectiveId)
  } catch (error) {
    console.error('更新目标进度失败:', error)
  }
}