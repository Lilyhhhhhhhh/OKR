import { createClient } from '@supabase/supabase-js';

// ✅ 正确写法：使用环境变量名
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量配置');
}

// 移除类型约束，让TypeScript自动推断
export const supabase = createClient(supabaseUrl, supabaseAnonKey);