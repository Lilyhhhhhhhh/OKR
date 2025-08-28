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

  // 获取认证头
  private async getAuthHeaders() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
    }
  }

  // 学生信息相关
  async getStudentProfile() {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/students/profile', { headers })
    if (!response.ok) {
      throw new Error('获取学生信息失败')
    }
    return response.json()
  }

  async updateStudentProfile(profileData: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/students/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData)
    })
    if (!response.ok) {
      throw new Error('更新学生信息失败')
    }
    return response.json()
  }

  async createStudentProfile(profileData: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/students/profile', {
      method: 'POST',
      headers,
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
    
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/okr/objectives?${params.toString()}`, { headers })
    if (!response.ok) {
      throw new Error('获取目标失败')
    }
    return response.json()
  }

  async createObjective(objectiveData: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/okr/objectives', {
      method: 'POST',
      headers,
      body: JSON.stringify(objectiveData)
    })
    if (!response.ok) {
      throw new Error('创建目标失败')
    }
    return response.json()
  }

  async updateKeyResultProgress(keyResultId: string, progressData: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/okr/key-results/${keyResultId}/progress`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(progressData)
    })
    if (!response.ok) {
      throw new Error('更新进度失败')
    }
    return response.json()
  }

  async deleteObjective(objectiveId: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/okr/objectives/${objectiveId}`, {
      method: 'DELETE',
      headers
    })
    if (!response.ok) {
      throw new Error('删除目标失败')
    }
    return response.json()
  }

  // AI聊天相关
  async sendChatMessage(message: string, sessionId?: string, sessionType?: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
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
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/ai/chat/history${params}`, { headers })
    if (!response.ok) {
      throw new Error('获取聊天历史失败')
    }
    return response.json()
  }

  async deleteChatSession(sessionId: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/ai/chat/history', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ session_id: sessionId })
    })
    if (!response.ok) {
      throw new Error('删除聊天会话失败')
    }
    return response.json()
  }

  // 知识库相关
  async searchKnowledge(params?: { 
    query?: string; 
    category?: string; 
    tags?: string; 
    limit?: number 
  }) {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.append('q', params.query)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.tags) searchParams.append('tags', params.tags)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/knowledge/search?${searchParams.toString()}`, { headers })
    if (!response.ok) {
      throw new Error('搜索知识库失败')
    }
    return response.json()
  }

  async sendKnowledgeQuestion(question: string, sessionId?: string) {
    const headers = await this.getAuthHeaders()
    const response = await fetch('/api/knowledge/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question,
        session_id: sessionId
      })
    })
    if (!response.ok) {
      throw new Error('发送知识库问题失败')
    }
    return response.json()
  }

  async getKnowledgeChatHistory(sessionId?: string, limit?: number) {
    const params = new URLSearchParams()
    if (sessionId) params.append('session_id', sessionId)
    if (limit) params.append('limit', limit.toString())
    
    const headers = await this.getAuthHeaders()
    const response = await fetch(`/api/knowledge/chat?${params.toString()}`, { headers })
    if (!response.ok) {
      throw new Error('获取知识库聊天历史失败')
    }
    return response.json()
  }
}

// 导出单例实例
export const apiService = ApiService.getInstance()