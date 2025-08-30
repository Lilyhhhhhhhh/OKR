import { NextRequest, NextResponse } from 'next/server'

// AI Chat History API 已暂时移除，等待工作流接入后重新开发
export async function GET() {
  return NextResponse.json({ 
    message: 'AI Chat History API is under development' 
  }, { status: 503 })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ 
    error: 'AI Chat History API is under development' 
  }, { status: 503 })
}