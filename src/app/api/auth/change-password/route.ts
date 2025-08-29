import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '当前密码和新密码都不能为空' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少需要6个字符' }, { status: 400 })
    }

    // 获取当前用户的token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 设置用户session到客户端
    const { data: { user }, error: sessionError } = await supabaseClient.auth.getUser(token)
    
    if (sessionError || !user) {
      return NextResponse.json({ error: '无效的身份验证' }, { status: 401 })
    }

    // 验证当前密码
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError) {
      console.error('密码验证失败:', signInError)
      return NextResponse.json({ error: '当前密码不正确' }, { status: 400 })
    }

    // 直接使用updateUser更新密码
    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('密码更新失败:', updateError)
      return NextResponse.json({ error: `密码更新失败: ${updateError.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: '密码更新成功' 
    })

  } catch (error) {
    console.error('密码更改错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}