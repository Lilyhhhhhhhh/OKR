'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Mail, Lock, Eye, EyeOff, User, GraduationCap, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    student_id: '',
    grade: '',
    major: '',
    class_name: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 表单验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位')
      setLoading(false)
      return
    }

    if (!formData.full_name.trim()) {
      setError('请输入真实姓名')
      setLoading(false)
      return
    }

    try {
      const profileData = {
        full_name: formData.full_name.trim(),
        student_id: formData.student_id.trim(),
        grade: formData.grade,
        major: formData.major.trim(),
        class_name: formData.class_name.trim(),
        phone: formData.phone.trim()
      }

      await signUp(formData.email, formData.password, profileData)
      router.push('/student') // 注册成功后跳转到学生端
    } catch (error: any) {
      setError(error.message || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Star className="h-12 w-12 text-yellow-400" />
            <span className="text-3xl font-bold text-white">启明星</span>
          </Link>
          <p className="text-gray-300 mt-2">加入我们，开启您的AI学习之旅</p>
        </div>

        {/* Register Form */}
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* 账户信息 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">账户信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 邮箱 */}
                <div className="md:col-span-2">
                  <label className="block text-white text-sm font-medium mb-2">
                    邮箱地址 *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    密码 *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="至少6位密码"
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

                {/* 确认密码 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    确认密码 *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="再次输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 个人信息 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">个人信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 姓名 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    真实姓名 *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="请输入真实姓名"
                    />
                  </div>
                </div>

                {/* 学号 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    学号
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="请输入学号"
                    />
                  </div>
                </div>

                {/* 年级 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    年级
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  >
                    <option value="" className="bg-gray-800">请选择年级</option>
                    <option value="大一" className="bg-gray-800">大一</option>
                    <option value="大二" className="bg-gray-800">大二</option>
                    <option value="大三" className="bg-gray-800">大三</option>
                    <option value="大四" className="bg-gray-800">大四</option>
                    <option value="研一" className="bg-gray-800">研一</option>
                    <option value="研二" className="bg-gray-800">研二</option>
                    <option value="研三" className="bg-gray-800">研三</option>
                  </select>
                </div>

                {/* 专业 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    专业
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    placeholder="如：软件工程"
                  />
                </div>

                {/* 班级 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    班级
                  </label>
                  <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    placeholder="如：软件2101"
                  />
                </div>

                {/* 手机号 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    手机号
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {loading ? '注册中...' : '注册账号'}
            </button>

            {/* Agreement */}
            <div className="text-center text-sm text-gray-300">
              点击注册即表示您同意我们的
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                服务条款
              </Link>
              和
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                隐私政策
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-gray-300">
              已有账号？{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2024 河北师范大学软件学院 · 启明星平台
          </p>
        </div>
      </div>
    </div>
  )
}