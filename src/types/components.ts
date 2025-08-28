import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'
import { User } from '@supabase/supabase-js'
import { Student, Objective, KeyResult } from './database'

// 基础组件props类型
export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

// Button组件类型
export interface ButtonVariants {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: ReactNode
  loading?: boolean
}

// Input组件类型
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

// 认证Context类型
export interface AuthContextType {
  user: User | null
  student: Student | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, profileData: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: any) => Promise<void>
  refreshProfile: () => Promise<void>
}

// OKR组件相关类型
export interface ObjectiveCardProps {
  objective: Objective & { key_results?: KeyResult[] }
  onUpdate?: (objective: Objective) => void
  onDelete?: (objectiveId: string) => void
}

export interface KeyResultItemProps {
  keyResult: KeyResult
  onUpdateProgress?: (keyResultId: string, progress: number, note?: string) => void
}

export interface ProgressChartProps {
  data: Array<{
    date: string
    value: number
    target?: number
  }>
  title?: string
  height?: number
}

// 表单相关类型
export interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  helperText?: string
}

export interface FormProps {
  fields: FormFieldProps[]
  onSubmit: (data: Record<string, any>) => void
  submitText?: string
  loading?: boolean
  initialValues?: Record<string, any>
}

// Modal/Dialog相关类型
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

// 导航相关类型
export interface NavItem {
  name: string
  href: string
  icon?: ReactNode
  badge?: string | number
  children?: NavItem[]
}

export interface SidebarProps {
  navItems: NavItem[]
  currentPath?: string
  user?: User
  onSignOut?: () => void
}

// 数据表格相关类型
export interface TableColumn<T = any> {
  key: keyof T | string
  title: string
  render?: (value: any, record: T, index: number) => ReactNode
  sortable?: boolean
  width?: string | number
}

export interface TableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize?: number) => void
  }
  rowKey?: string | ((record: T) => string)
}

// 错误边界类型
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

// 布局相关类型
export interface LayoutProps extends BaseComponentProps {
  title?: string
  description?: string
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

// 状态管理相关类型
export interface LoadingState {
  loading: boolean
  error?: string | null
}

export interface DataState<T> extends LoadingState {
  data: T | null
}

// 事件处理器类型
export type EventHandler<T = void> = (event?: any) => T | Promise<T>
export type AsyncEventHandler<T = void> = (event?: any) => Promise<T>

// 页面组件Props类型
export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}