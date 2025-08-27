import { supabase } from '@/lib/supabase'

// API服务类
export class ApiService {
  private static instance: ApiService
  private supabase

  private constructor() {
    this.supabase = supabase
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // 用户认证相关
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    return { user, error }
  }

  // 学生信息相关
  async getStudentProfile() {
    const response = await fetch('/api/students/profile')
    if (!response.ok) {
      throw new Error('获取学生信息失败')
    }
    return response.json()
  }

  async updateStudentProfile(profileData: any) {
    const response = await fetch('/api/students/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    })
    if (!response.ok) {
      throw new Error('更新学生信息失败')
    }
    return response.json()
  }

  async createStudentProfile(profileData: any) {
    const response = await fetch('/api/students/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    })
    if (!response.ok) {
      throw new Error('创建学生信息失败')
    }
    return response.json()
  }

  // OKR相关
  async getObjectives(filters?: { status?: string; limit?: number }) {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await fetch(`/api/okr/objectives?${params.toString()}`)
    if (!response.ok) {
      throw new Error('获取目标失败')
    }
    return response.json()
  }

  async createObjective(objectiveData: any) {
    const response = await fetch('/api/okr/objectives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objectiveData)
    })
    if (!response.ok) {
      throw new Error('创建目标失败')
    }
    return response.json()
  }

  async updateKeyResultProgress(keyResultId: string, progressData: any) {
    const response = await fetch(`/api/okr/key-results/${keyResultId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(progressData)
    })
    if (!response.ok) {
      throw new Error('更新进度失败')
    }
    return response.json()
  }

  // AI聊天相关
  async sendChatMessage(message: string, sessionId?: string, sessionType?: string) {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        session_type: sessionType
      })
    })
    if (!response.ok) {
      throw new Error('发送消息失败')
    }
    return response.json()
  }

  async getChatHistory(sessionId?: string) {
    const params = sessionId ? `?session_id=${sessionId}` : ''
    const response = await fetch(`/api/ai/chat/history${params}`)
    if (!response.ok) {
      throw new Error('获取聊天历史失败')
    }
    return response.json()
  }

  async deleteChatSession(sessionId: string) {
    const response = await fetch('/api/ai/chat/history', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    })
    if (!response.ok) {
      throw new Error('删除聊天会话失败')
    }
    return response.json()
  }
}

// 导出单例实例
export const apiService = ApiService.getInstance()