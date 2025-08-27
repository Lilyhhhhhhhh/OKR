import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// 获取学生个人资料
export async function GET() {
  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, student_id, grade, major, class_name, phone } = body

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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, student_id, grade, major, class_name, phone } = body

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
      return NextResponse.json({ error: '创建学生信息失败' }, { status: 500 })
    }

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('服务器错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}