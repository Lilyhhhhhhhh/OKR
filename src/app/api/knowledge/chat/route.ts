import { NextRequest, NextResponse } from 'next/server'

// Knowledge Chat API 已暂时移除，等待工作流接入后重新开发
export async function GET() {
  return NextResponse.json({ 
    message: 'Knowledge Chat API is under development' 
  }, { status: 503 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Knowledge Chat API is under development' 
  }, { status: 503 })
}