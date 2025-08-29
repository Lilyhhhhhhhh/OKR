'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/lib/api'
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Plus,
  User
} from 'lucide-react'

interface KeyResult {
  id: string
  title: string
  target_value: number
  current_value: number
  progress: number
  status: string
  completed?: boolean
}

interface Objective {
  id: string
  title: string
  description: string
  category?: string
  priority: string
  status: string
  target_date?: string
  progress: number
  key_results: KeyResult[]
  created_at: string
  updated_at: string
}

export default function StudentDashboard() {
  const { user, student } = useAuth()
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalObjectives: 0,
    completedTasks: 0,
    averageProgress: 0,
    activeObjectives: 0
  })

  // 加载用户的OKR数据
  const loadData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await apiService.getObjectives()
      setObjectives(data)
      
      // 计算统计数据
      const totalObjectives = data.length
      const activeObjectives = data.filter(obj => obj.status === 'active').length
      const completedTasks = data.reduce((sum, obj) => 
        sum + obj.key_results.filter(kr => kr.progress >= 100).length, 0
      )
      const averageProgress = totalObjectives > 0 
        ? Math.round(data.reduce((sum, obj) => sum + obj.progress, 0) / totalObjectives)
        : 0
      
      setStats({
        totalObjectives,
        completedTasks,
        averageProgress,
        activeObjectives
      })
    } catch (error) {
      console.error('获取数据错误:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50'
      case 'paused': return 'text-yellow-600 bg-yellow-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中'
      case 'paused': return '已暂停'
      case 'completed': return '已完成'
      case 'cancelled': return '已取消'
      default: return '状态未知'
    }
  }

  const getProgressStatus = (progress: number) => {
    if (progress >= 80) return { text: '进展良好', color: 'text-green-600' }
    if (progress >= 60) return { text: '正常进行', color: 'text-blue-600' }
    if (progress >= 40) return { text: '需要关注', color: 'text-yellow-600' }
    return { text: '进度滞后', color: 'text-red-600' }
  }

  // 获取当前活跃的OKR
  const activeObjectives = objectives.filter(obj => obj.status === 'active')

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{student?.full_name || user?.email || '同学'}！
        </h1>
        <p className="text-blue-100">
          {objectives.length > 0 
            ? `您目前有 ${stats.activeObjectives} 个活跃目标正在进行中` 
            : '开始创建您的第一个OKR目标吧！'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总目标数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalObjectives}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              {stats.activeObjectives} 个活跃目标
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成任务</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-green-600">关键结果完成数</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均进度</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-sm ${getProgressStatus(stats.averageProgress).color}`}>
              {getProgressStatus(stats.averageProgress).text}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">本月活跃度</p>
              <p className="text-2xl font-bold text-gray-900">
                {objectives.length > 0 ? '高' : '待激活'}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-orange-600">参与度指数</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current OKRs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">当前目标 (OKR)</h2>
            <Link href="/student/okr" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </Link>
          </div>
          
          {activeObjectives.length > 0 ? (
            <div className="space-y-4">
              {activeObjectives.slice(0, 3).map((objective) => (
                <div key={objective.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{objective.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(objective.status)}`}>
                      {getStatusText(objective.status)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>整体进度</span>
                      <span>{objective.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${objective.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {objective.key_results.length > 0 && (
                    <div className="space-y-2">
                      {objective.key_results.slice(0, 2).map((kr) => (
                        <div key={kr.id} className="flex items-center text-sm">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            kr.progress >= 100 ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={kr.progress >= 100 ? 'text-gray-500 line-through' : 'text-gray-700'}>
                            {kr.title}
                          </span>
                          <span className="ml-auto text-gray-500">
                            {kr.progress}%
                          </span>
                        </div>
                      ))}
                      {objective.key_results.length > 2 && (
                        <div className="text-xs text-gray-500 pl-5">
                          还有 {objective.key_results.length - 2} 个关键结果...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">暂无活跃目标</h3>
              <p className="text-sm text-gray-500 mb-4">开始创建您的第一个OKR目标吧</p>
              <Link 
                href="/student/okr" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                创建目标
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">最近动态</h2>
          </div>
          
          {objectives.length > 0 ? (
            <div className="space-y-4">
              {objectives
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 4)
                .map((objective, index) => (
                  <div key={objective.id} className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {objective.status === 'completed' ? '完成了目标' : '更新了目标'} "{objective.title}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(objective.updated_at).toLocaleDateString('zh-CN', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">暂无动态</h3>
              <p className="text-sm text-gray-500">当您开始创建和更新OKR时，相关动态会显示在这里</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center mb-6">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">AI学习助手</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/student/ai-companion"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
          >
            <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">智能答疑</h3>
            <p className="text-sm text-gray-600">遇到学习问题？立即向AI助手提问</p>
          </Link>
          
          <Link 
            href="/student/ai-companion"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group"
          >
            <Target className="h-6 w-6 text-gray-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">目标规划</h3>
            <p className="text-sm text-gray-600">让AI帮你制定更科学的学习计划</p>
          </Link>
          
          <Link 
            href="/student/ai-companion"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group"
          >
            <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">资源推荐</h3>
            <p className="text-sm text-gray-600">获取个性化的学习资源推荐</p>
          </Link>
        </div>
      </div>
    </div>
  )
}