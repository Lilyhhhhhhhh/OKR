// API响应类型定义
import { Student, Objective, KeyResult, ChatSession, ChatMessage } from './database'

// 基础API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 认证相关类型
export interface AuthData {
  user: any
  session: any
}

export interface SignUpData {
  email: string
  password: string
  metadata?: Record<string, any>
}

export interface SignInData {
  email: string
  password: string
}

// 学生档案类型
export interface StudentProfileData {
  full_name: string
  student_id?: string
  grade?: string
  major?: string
  class_name?: string
  phone?: string
  avatar_url?: string
}

export interface StudentProfileResponse extends ApiResponse<Student> {}

// OKR相关类型
export interface ObjectiveCreateData {
  title: string
  description?: string
  category?: string
  priority: 'low' | 'medium' | 'high'
  target_date?: string
  key_results?: KeyResultCreateData[]
}

export interface KeyResultCreateData {
  title: string
  description?: string
  metric_type: 'percentage' | 'number' | 'boolean'
  target_value?: number
}

export interface ProgressUpdateData {
  current_value: number
  note?: string
}

export interface ObjectivesFilters {
  status?: 'draft' | 'active' | 'completed' | 'archived'
  limit?: number
}

// AI聊天相关类型
export interface ChatMessageData {
  message: string
  session_id?: string
  session_type?: 'general' | 'okr' | 'learning'
}

export interface ChatResponse extends ApiResponse {
  data: {
    message: string
    session_id: string
    timestamp: string
  }
}

export interface ChatHistoryResponse extends ApiResponse {
  data: ChatMessage[]
}

// API Service 类型
export interface ApiServiceInterface {
  // 认证方法
  signUp(email: string, password: string, metadata?: any): Promise<ApiResponse<AuthData>>
  signIn(email: string, password: string): Promise<ApiResponse<AuthData>>
  signOut(): Promise<ApiResponse>
  getCurrentUser(): Promise<ApiResponse<any>>

  // 学生档案方法
  getStudentProfile(): Promise<ApiResponse<Student>>
  updateStudentProfile(profileData: StudentProfileData): Promise<ApiResponse<Student>>
  createStudentProfile(profileData: StudentProfileData): Promise<ApiResponse<Student>>

  // OKR方法
  getObjectives(filters?: ObjectivesFilters): Promise<ApiResponse<Objective[]>>
  createObjective(objectiveData: ObjectiveCreateData): Promise<ApiResponse<Objective>>
  updateKeyResultProgress(keyResultId: string, progressData: ProgressUpdateData): Promise<ApiResponse<KeyResult>>

  // AI聊天方法
  sendChatMessage(message: string, sessionId?: string, sessionType?: string): Promise<ChatResponse>
  getChatHistory(sessionId?: string): Promise<ChatHistoryResponse>
  deleteChatSession(sessionId: string): Promise<ApiResponse>
}

// Fetch响应类型
export interface FetchResponse<T = any> {
  ok: boolean
  status: number
  statusText: string
  json(): Promise<T>
}

// 错误类型
export interface ApiError {
  code: string
  message: string
  details?: any
}

// 分页相关类型
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}