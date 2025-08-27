'use client'

import { useState } from 'react'
import { Star, User, Lock, GraduationCap, Mail, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [userType, setUserType] = useState<'student' | 'teacher' | 'admin'>('student')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const userTypes = [
    { id: 'student' as const, label: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'teacher' as const, label: '教师', icon: User, color: 'bg-green-500' },
    { id: 'admin' as const, label: '管理员', icon: Lock, color: 'bg-purple-500' },
  ]

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // 模拟注册API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟注册成功，将用户信息存储到localStorage
    const userData = {
      email: formData.email,
      userType: userType,
      registeredAt: new Date().toISOString()
    }
    
    localStorage.setItem('registeredUser', JSON.stringify(userData))
    
    // 显示注册成功消息并跳转到登录页
    alert('注册成功！请使用您的邮箱和密码登录。')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Star className="h-10 w-10 text-yellow-400" />
            <span className="text-3xl font-bold text-white">启明星</span>
          </Link>
          <p className="text-gray-300 mt-2">创建您的账户</p>
        </div>

        {/* Register Form */}
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                  placeholder="请输入邮箱地址"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                  placeholder="请输入密码（至少6位）"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                '注册账户'
              )}
            </button>

            {/* Additional Links */}
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-400">
                已有账户？
                <Link href="/login" className="text-blue-400 hover:text-blue-300 ml-1">
                  立即登录
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