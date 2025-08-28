import { NextRequest } from 'next/server'

type Params = Promise<{ id: string }>

export async function PUT(
  request: NextRequest,
<<<<<<< HEAD
  { params }: { params: { id: string } }
=======
  props: { params: Params }
>>>>>>> 696b303cabceedfe1ab3a2b6c99ae4536e103c23
) {
  try {
    const params = await props.params
    const { id } = params
    
    // 获取请求体数据
    const body = await request.json()
<<<<<<< HEAD
    const { current_value, note } = body

    const { id: keyResultId } = params

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
=======
    
    // 这里添加你的业务逻辑
    // 例如：更新 OKR key-result 的进度
    
    // 示例响应
    return Response.json({
      success: true,
      message: `Key result ${id} progress updated`,
>>>>>>> 696b303cabceedfe1ab3a2b6c99ae4536e103c23
      data: {
        id,
        ...body
      }
    })
    
  } catch (error) {
    console.error('Error updating key result progress:', error)
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update key result progress' 
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  props: { params: Params }
) {
  try {
    const params = await props.params
    const { id } = params
    
    // 获取进度数据的逻辑
    
    return Response.json({
      success: true,
      data: {
        id,
        // 你的数据
      }
    })
    
  } catch (error) {
    console.error('Error fetching key result progress:', error)
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch key result progress' 
      },
      { status: 500 }
    )
  }
}