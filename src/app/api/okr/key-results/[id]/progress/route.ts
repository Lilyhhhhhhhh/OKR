import { NextRequest } from 'next/server'

type Params = Promise<{ id: string }>

export async function PUT(
  request: NextRequest,
  props: { params: Params }
) {
  try {
    const params = await props.params
    const { id } = params
    
    // 获取请求体数据
    const body = await request.json()
    
    // 这里添加你的业务逻辑
    // 例如：更新 OKR key-result 的进度
    
    // 示例响应
    return Response.json({
      success: true,
      message: `Key result ${id} progress updated`,
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