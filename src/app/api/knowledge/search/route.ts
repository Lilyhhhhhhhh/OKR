import { NextRequest, NextResponse } from 'next/server'

// Knowledge Search API 已暂时移除，等待工作流接入后重新开发
export async function GET() {
  return NextResponse.json({ 
    message: 'Knowledge Search API is under development' 
  }, { status: 503 })
}