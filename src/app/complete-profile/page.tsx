'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Star, User, GraduationCap, Phone, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'
import { apiService } from '@/lib/api'

interface FormData {
  full_name: string
  student_id: string
  grade: string
  major: string
  class_name: string
  phone: string
}

const grades = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博士']

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    student_id: '',
    grade: '',
    major: '',
    class_name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user, setStudent } = useAuth()

  // 确保组件在客户端挂载后才执行认证检查
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login')
    }
  }, [mounted, user, router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 验证必填字段
      if (!formData.full_name.trim() || !formData.student_id.trim() || 
          !formData.grade || !formData.major.trim() || !formData.class_name.trim()) {
        throw new Error('请填写所有必填字段')
      }

      // 创建学生档案
      const profileData = {
        full_name: formData.full_name.trim(),
        student_id: formData.student_id.trim(),
        grade: formData.grade,
        major: formData.major.trim(),
        class_name: formData.class_name.trim(),
        phone: formData.phone.trim()
      }

      const studentData = await apiService.createStudentProfile(profileData)
      setStudent(studentData)
      
      router.push('/student') // 完善档案后跳转到学生端
    } catch (error: any) {
      setError(error.message || '完善档案失败，请重试')
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
            <span className="text-4xl font-bold text-white">启明星</span>
          </Link>
          <p className="text-gray-300 mt-2 text-lg">完善你的学生档案信息</p>
        </div>

        {/* Complete Profile Form */}
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">完善个人档案</h2>
            <p className="text-gray-300 text-sm">
              为了更好地为您提供服务，请完善您的学生档案信息
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                基本信息
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  姓名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入真实姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  学号 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入学号"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  手机号
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>
            </div>

            {/* 学业信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                学业信息
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  年级 <span className="text-red-400">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>请选择年级</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade} className="bg-gray-800 text-white">
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  专业 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="如：计算机科学与技术"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  班级 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="如：计科2021-1班"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>完善中...</span>
                  </>
                ) : (
                  <span>完善档案</span>
                )}
              </button>
            </div>
          </form>

          {/* 返回登录 */}
          <div className="text-center mt-6">
            <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}