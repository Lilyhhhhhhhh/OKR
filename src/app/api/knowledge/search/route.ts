import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, validateAuth } from '@/lib/supabase-server'

// 搜索知识库
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: authError || '未授权' }, { status: 401 })
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category')
    const tags = url.searchParams.get('tags')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const supabase = createServerClient(request)
    
    let dbQuery = supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false })

    // 全文搜索
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    }

    // 按分类筛选
    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    // 按标签筛选
    if (tags) {
      const tagArray = tags.split(',')
      dbQuery = dbQuery.overlaps('tags', tagArray)
    }

    // 限制结果数量
    if (limit > 0) {
      dbQuery = dbQuery.limit(limit)
    }

    const { data: knowledge, error } = await dbQuery

    if (error) {
      console.error('搜索知识库失败:', error)
      return NextResponse.json({ error: '搜索失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: knowledge,
      count: knowledge?.length || 0
    })
  } catch (error) {
    console.error('知识库搜索错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}