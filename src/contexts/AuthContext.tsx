'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { apiService } from '@/lib/api'
import { Student } from '@/types/database'

interface AuthContextType {
  user: User | null
  student: Student | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, profileData: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: any) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初始化时获取当前用户
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const { user: currentUser } = await apiService.getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        await loadStudentProfile()
      }
    } catch (error) {
      console.error('初始化认证失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudentProfile = async () => {
    try {
      const studentData = await apiService.getStudentProfile()
      setStudent(studentData)
      return studentData
    } catch (error) {
      console.error('加载学生信息失败:', error)
      // 如果学生信息不存在，可能是新注册用户或档案创建失败
      setStudent(null)
      return null
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await apiService.signIn(email, password)
      if (error) throw error

      setUser(data.user)
      const studentData = await loadStudentProfile()
      
      return { user: data.user, student: studentData }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, profileData: any) => {
    setLoading(true)
    try {
      const { data, error } = await apiService.signUp(email, password, {
        full_name: profileData.full_name
      })
      if (error) throw error

      if (data.user && data.session) {
        // 暂时设置用户状态来创建学生档案
        setUser(data.user)
        
        // 等待一下确保认证状态建立
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 创建学生档案
        try {
          await apiService.createStudentProfile(profileData)
          // 创建成功后立即登出，要求用户重新登录
          await apiService.signOut()
          setUser(null)
          setStudent(null)
        } catch (studentError: any) {
          console.error('创建学生档案失败:', studentError)
          
          // 如果是用户档案已存在的错误，说明这个用户之前注册过
          if (studentError.message?.includes('用户档案已存在')) {
            // 档案已存在，直接登出要求重新登录
            await apiService.signOut()
            setUser(null)
            setStudent(null)
            return
          }
          
          // 其他错误也要登出
          await apiService.signOut()
          setUser(null)
          setStudent(null)
          
          if (studentError.message?.includes('学号已存在')) {
            throw new Error('学号已存在，请使用不同的学号')
          }
          
          throw new Error('用户注册成功，但学生档案创建失败。请重新登录或联系管理员。')
        }
      }
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await apiService.signOut()
      if (error) throw error

      setUser(null)
      setStudent(null)
      
      // 跳转到登录页面
      window.location.href = '/login'
    } catch (error) {
      console.error('退出登录失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: any) => {
    try {
      const updatedStudent = await apiService.updateStudentProfile(profileData)
      setStudent(updatedStudent)
    } catch (error) {
      console.error('更新资料失败:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadStudentProfile()
    }
  }

  const value = {
    user,
    student,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}