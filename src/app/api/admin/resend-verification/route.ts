import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 使用服务角色密钥来发送验证邮件
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

    // 重新发送验证邮件
    const { error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error('重新发送验证邮件失败:', error)
      return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `验证邮件已发送至 ${email}` 
    })

  } catch (error) {
    console.error('重新发送验证邮件错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}