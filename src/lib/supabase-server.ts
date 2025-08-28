import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量配置');
}

// 创建用于服务端的Supabase客户端
export function createServerClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// 验证请求认证并返回用户信息
export async function validateAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: '未授权' }
  }

  const token = authHeader.substring(7)
  const supabase = createServerClient(request)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    return { user, error: error?.message }
  } catch (error) {
    console.error('认证验证错误:', error)
    return { user: null, error: '认证验证失败' }
  }
}