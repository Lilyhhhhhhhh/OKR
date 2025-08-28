import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, validateAuth } from '@/lib/supabase-server'

// 获取学生个人资料
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const supabase = createServerClient(request)
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('获取学生信息失败:', error)
      return NextResponse.json({ error: '获取学生信息失败' }, { status: 500 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 更新学生个人资料
export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, student_id, grade, major, class_name, phone } = body

    const supabase = createServerClient(request)
    const { data: student, error } = await supabase
      .from('students')
      .update({
        full_name,
        student_id,
        grade,
        major,
        class_name,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('更新学生信息失败:', error)
      return NextResponse.json({ error: '更新学生信息失败' }, { status: 500 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 创建新学生资料 (注册时调用)
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, student_id, grade, major, class_name, phone } = body

    const supabase = createServerClient(request)
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        id: user.id,
        full_name,
        student_id,
        grade,
        major,
        class_name,
        phone
      })
      .select()
      .single()

    if (error) {
      console.error('创建学生信息失败:', error)
      console.error('错误详情:', error)
      
      // 检查是否是重复学号错误
      if (error.code === '23505' && error.details?.includes('student_id')) {
        return NextResponse.json({ error: '学号已存在，请使用其他学号' }, { status: 409 })
      }
      
      // 检查是否是重复用户ID错误
      if (error.code === '23505' && error.details?.includes('students_pkey')) {
        return NextResponse.json({ error: '用户档案已存在' }, { status: 409 })
      }
      
      return NextResponse.json({ 
        error: '创建学生信息失败',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}