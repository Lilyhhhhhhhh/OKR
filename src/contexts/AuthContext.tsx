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
    } catch (error) {
      console.error('加载学生信息失败:', error)
      // 如果学生信息不存在，可能是新注册用户
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await apiService.signIn(email, password)
      if (error) throw error

      setUser(data.user)
      await loadStudentProfile()
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

      if (data.user) {
        setUser(data.user)
        // 创建学生档案
        const studentData = await apiService.createStudentProfile(profileData)
        setStudent(studentData)
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