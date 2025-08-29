'use client'

import { useState, useEffect } from 'react'
import { Star, User, Lock, GraduationCap, Mail, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [userType, setUserType] = useState<'student' | 'teacher' | 'admin'>('student')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showResendButton, setShowResendButton] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
      // 5秒后清除成功消息
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn(formData.email, formData.password)
      
      // 检查是否需要完善学生档案
      if (userType === 'student' && !result.student) {
        // 如果是学生但没有学生档案，跳转到完善档案页面
        router.push('/complete-profile')
        return
      }
      
      // 根据用户类型重定向 (目前主要支持学生端)
      const dashboardRoutes = {
        student: '/student',
        teacher: '/teacher',
        admin: '/admin'
      }
      
      router.push(dashboardRoutes[userType])
    } catch (error: any) {
      const errorMessage = error.message || '登录失败，请检查邮箱和密码'
      
      // 检查是否是邮箱未验证错误
      if (errorMessage.includes('Email not confirmed') || errorMessage.includes('邮箱未确认')) {
        setError(`请先验证您的邮箱地址。我们已向 ${formData.email} 发送了验证邮件，请检查您的收件箱（包括垃圾邮件文件夹）并点击验证链接。`)
        setShowResendButton(true)
      } else {
        setError(errorMessage)
        setShowResendButton(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('请先输入邮箱地址')
      return
    }
    
    setIsResending(true)
    try {
      // 使用管理API重新发送验证邮件
      const response = await fetch('/api/admin/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccessMessage(`验证邮件已重新发送至 ${formData.email}，请检查您的收件箱。`)
        setError('')
        setShowResendButton(false)
      } else {
        setError(result.error || '重新发送失败，请稍后重试')
      }
    } catch (error) {
      setError('重新发送验证邮件失败，请稍后重试')
    } finally {
      setIsResending(false)
    }
  }

  const userTypes = [
    { id: 'student' as const, label: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'teacher' as const, label: '教师', icon: User, color: 'bg-green-500' },
    { id: 'admin' as const, label: '管理员', icon: Lock, color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Star className="h-10 w-10 text-yellow-400" />
            <span className="text-3xl font-bold text-white">启明星</span>
          </Link>
          <p className="text-gray-300 mt-2">AI智慧教育平台</p>
        </div>

        {/* Login Form */}
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-200 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
                {showResendButton && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-4 py-2 rounded text-white transition-colors"
                    >
                      {isResending ? '发送中...' : '重新发送验证邮件'}
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                选择身份
              </label>
              <div className="grid grid-cols-3 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      userType === type.id
                        ? 'border-blue-400 bg-blue-400/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mx-auto mb-1 ${
                      userType === type.id ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <div className={`text-xs ${
                      userType === type.id ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="请输入邮箱地址"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                '登录'
              )}
            </button>

            {/* Additional Links */}
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-400">
                首次使用？
                <Link href="/register" className="text-blue-400 hover:text-blue-300 ml-1">
                  注册账号
                </Link>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="text-gray-400 hover:text-white">
                  忘记密码？
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          河北师范大学软件学院 · AI智慧教育平台
        </div>
      </div>
    </div>
  )
}