import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 使用服务角色密钥来绕过RLS，不约束类型
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: '邮箱地址不能为空' }, { status: 400 })
    }

    // 查找用户
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()

    if (getUserError) {
      console.error('查找用户失败:', getUserError)
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const user = users.users?.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 更新用户邮箱确认状态
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('更新用户失败:', updateError)
      return NextResponse.json({ error: '确认邮箱失败' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `邮箱 ${email} 已成功确认，现在可以正常登录了` 
    })

  } catch (error) {
    console.error('确认邮箱错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}