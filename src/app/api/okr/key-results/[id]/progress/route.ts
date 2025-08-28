// import { supabase } from '@/lib/supabase'
// import { NextRequest, NextResponse } from 'next/server'

// type Params = Promise<{ id: string }>

// export async function PUT(
//   request: NextRequest,
//   props: { params: Params }
// ) {
//   try {
//     const params = await props.params
//     const { id: keyResultId } = params
    
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
//     if (authError || !user) {
//       return NextResponse.json({ error: '未授权' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { current_value, note } = body

//     // 获取当前关键结果信息
//     const { data: keyResult, error: keyResultError } = await supabase
//       .from('key_results')
//       .select('*')
//       .eq('id', keyResultId)
//       .single()

//     if (keyResultError || !keyResult) {
//       return NextResponse.json({ error: '关键结果不存在' }, { status: 404 })
//     }

//     // 更新进度
//     const { error: updateError } = await supabase
//       .from('key_results')
//       .update({
//         current_value,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', keyResultId)

//     if (updateError) {
//       return NextResponse.json({ error: '更新失败' }, { status: 500 })
//     }

//     // 记录进度更新历史
//     if (note) {
//       const { error: historyError } = await supabase
//         .from('progress_history')
//         .insert({
//           key_result_id: keyResultId,
//           user_id: user.id,
//           previous_value: keyResult.current_value,
//           new_value: current_value,
//           note,
//           created_at: new Date().toISOString()
//         })

//       if (historyError) {
//         console.error('记录历史失败:', historyError)
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: '进度更新成功',
//       data: {
//         current_value,
//         note
//       }
//     })
    
//   } catch (error) {
//     console.error('更新进度错误:', error)
//     return NextResponse.json(
//       { error: '内部服务器错误' }, 
//       { status: 500 }
//     )
//   }
// }

// export async function GET(
//   request: NextRequest,
//   props: { params: Params }
// ) {
//   try {
//     const params = await props.params
//     const { id: keyResultId } = params
    
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
//     if (authError || !user) {
//       return NextResponse.json({ error: '未授权' }, { status: 401 })
//     }

//     // 获取关键结果进度历史
//     const { data: progressHistory, error } = await supabase
//       .from('progress_history')
//       .select('*')
//       .eq('key_result_id', keyResultId)
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error('获取进度历史失败:', error)
//       return NextResponse.json({ error: '获取进度历史失败' }, { status: 500 })
//     }

//     return NextResponse.json({
//       success: true,
//       data: progressHistory
//     })
    
//   } catch (error) {
//     console.error('获取进度历史错误:', error)
//     return NextResponse.json(
//       { error: '内部服务器错误' }, 
//       { status: 500 }
//     )
//   }
// }











import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// 将主要逻辑提取到单独的函数中
async function handlePUTRequest(request: NextRequest, keyResultId: string) {
  try {    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
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

async function handleGETRequest(request: NextRequest, keyResultId: string) {
  try {    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取关键结果进度历史
    const { data: progressHistory, error } = await supabase
      .from('progress_history')
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

// 使用 RouteHandlerContext 类型
interface RouteHandlerContext {
  params: Promise<{ id: string }>;
}

// 分别导出每个 HTTP 方法，使用正确的类型
export const PUT = async (
  request: NextRequest,
  context: RouteHandlerContext
) => {
  const params = await context.params;
  return handlePUTRequest(request, params.id);
}

export const GET = async (
  request: NextRequest,
  context: RouteHandlerContext
) => {
  const params = await context.params;
  return handleGETRequest(request, params.id);
}

// 添加其他 HTTP 方法支持
export const POST = async () => {
  return NextResponse.json({ error: '方法不允许' }, { status: 405 });
}

export const DELETE = async () => {
  return NextResponse.json({ error: '方法不允许' }, { status: 405 });
}

export const PATCH = async () => {
  return NextResponse.json({ error: '方法不允许' }, { status: 405 });
}

export const OPTIONS = async () => {
  return NextResponse.json({ error: '方法不允许' }, { status: 405 });
}

export const HEAD = async () => {
  return NextResponse.json({ error: '方法不允许' }, { status: 405 });
}