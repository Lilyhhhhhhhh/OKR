'use client'

import { useState } from 'react'
import { Star, User, Lock, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [userType, setUserType] = useState<'student' | 'teacher' | 'admin'>('student')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据用户类型重定向
    const dashboardRoutes = {
      student: '/student',
      teacher: '/teacher',
      admin: '/admin'
    }
    
    router.push(dashboardRoutes[userType])
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
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="请输入邮箱地址"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="请输入密码"
                required
              />
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