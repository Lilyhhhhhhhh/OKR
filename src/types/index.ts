// 全局类型定义导出
export * from './database'
export * from './api'
export * from './components'

// 通用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>

// 状态管理类型
export interface LoadingState {
  loading: boolean
  error?: string | null
}

export interface AsyncState<T> extends LoadingState {
  data: T | null
}

// HTTP状态码类型
export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 422 | 500

// 环境变量类型
export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  DEEPSEEK_API_KEY?: string
}

// 日期格式类型
export type DateFormat = 'ISO' | 'locale' | 'relative'

// 排序类型
export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// 过滤类型
export interface FilterOptions {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'
  value: any
}

// 查询选项类型
export interface QueryOptions {
  sort?: SortOptions[]
  filter?: FilterOptions[]
  pagination?: {
    page: number
    limit: number
  }
}

// 表单验证类型
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FieldValidation {
  [key: string]: ValidationRule[]
}

// 通知类型
export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// 主题类型
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
}

// 用户偏好设置类型
export interface UserPreferences {
  theme: ThemeConfig
  language: 'zh-CN' | 'en-US'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  privacy: {
    profileVisible: boolean
    progressVisible: boolean
  }
}

// OKR特定类型
export type ObjectiveStatus = 'draft' | 'active' | 'completed' | 'archived'
export type KeyResultStatus = 'not_started' | 'in_progress' | 'completed' | 'at_risk'
export type MetricType = 'percentage' | 'number' | 'boolean'
export type Priority = 'low' | 'medium' | 'high'

// 聊天相关类型
export type SenderType = 'user' | 'ai'
export type SessionType = 'general' | 'okr' | 'learning'
export type MessageType = 'text' | 'image' | 'file'

// 学习活动类型
export type ActivityType = 'reading' | 'exercise' | 'quiz' | 'video' | 'discussion'

// 权限类型
export type Permission = 'read' | 'write' | 'delete' | 'admin'
export type Role = 'student' | 'teacher' | 'admin'

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp?: string
}