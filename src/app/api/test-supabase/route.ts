import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 测试基本连接
    const { data, error } = await supabase.from('students').select('count').limit(1);
    
    if (error) {
      console.error('Supabase 连接错误:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        database: 'Connection failed',
        tablesAccessible: false,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // 测试表访问
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);

    return NextResponse.json({
      success: true,
      message: 'Supabase 连接成功',
      database: 'Connected',
      tablesAccessible: !tableError,
      tableCount: tables?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      database: 'Connection failed',
      tablesAccessible: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}