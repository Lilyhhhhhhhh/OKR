'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MessageSquare
} from 'lucide-react'

export default function StudentDashboard() {
  const [currentOKRs] = useState([
    {
      id: 1,
      objective: "提升前端开发技能",
      progress: 75,
      status: "on_track",
      keyResults: [
        { title: "完成React项目3个", progress: 100, completed: true },
        { title: "学习TypeScript并应用", progress: 80, completed: false },
        { title: "掌握Tailwind CSS", progress: 45, completed: false }
      ]
    },
    {
      id: 2,
      objective: "算法与数据结构强化",
      progress: 60,
      status: "at_risk",
      keyResults: [
        { title: "LeetCode刷题100道", progress: 65, completed: false },
        { title: "完成数据结构课程项目", progress: 30, completed: false },
        { title: "参加算法竞赛", progress: 0, completed: false }
      ]
    }
  ])

  const [recentActivities] = useState([
    { 
      type: 'okr_update', 
      content: '更新了"提升前端开发技能"的进度', 
      time: '2小时前',
      icon: Target
    },
    { 
      type: 'ai_suggestion', 
      content: 'AI助手推荐了3个React学习资源', 
      time: '4小时前',
      icon: Brain
    },
    { 
      type: 'achievement', 
      content: '完成了TypeScript基础学习里程碑', 
      time: '1天前',
      icon: Award
    },
    { 
      type: 'resource', 
      content: '保存了新的学习资料到收藏夹', 
      time: '2天前',
      icon: BookOpen
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-50'
      case 'at_risk': return 'text-yellow-600 bg-yellow-50'
      case 'behind': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_track': return '进展良好'
      case 'at_risk': return '存在风险'
      case 'behind': return '进度滞后'
      default: return '状态未知'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">欢迎回来，张小明！</h1>
        <p className="text-blue-100">让我们一起继续你的学习之旅，距离期末还有 45 天</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">本月完成任务</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-green-600">↗ +12% 较上月</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">学习时长</p>
              <p className="text-2xl font-bold text-gray-900">45.2h</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-green-600">本周 +8.5h</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">OKR完成率</p>
              <p className="text-2xl font-bold text-gray-900">67%</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-yellow-600">需要加速</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">技能成长</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-green-600">成长指数</div>
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
          
          <div className="space-y-4">
            {currentOKRs.map((okr) => (
              <div key={okr.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{okr.objective}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(okr.status)}`}>
                    {getStatusText(okr.status)}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>整体进度</span>
                    <span>{okr.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${okr.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {okr.keyResults.slice(0, 2).map((kr, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        kr.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={kr.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {kr.title}
                      </span>
                      <span className="ml-auto text-gray-500">
                        {kr.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">最近动态</h2>
            <Link href="/student/activities" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.content}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center mb-6">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">AI学习助手</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
            <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">智能答疑</h3>
            <p className="text-sm text-gray-600">遇到学习问题？立即向AI助手提问</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group">
            <Target className="h-6 w-6 text-gray-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">目标规划</h3>
            <p className="text-sm text-gray-600">让AI帮你制定更科学的学习计划</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group">
            <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">资源推荐</h3>
            <p className="text-sm text-gray-600">获取个性化的学习资源推荐</p>
          </button>
        </div>
      </div>
    </div>
  )
}