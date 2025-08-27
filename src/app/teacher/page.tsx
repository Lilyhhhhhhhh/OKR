'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  BookOpen,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react'

export default function TeacherDashboard() {
  const [classData] = useState({
    totalStudents: 145,
    activeStudents: 132,
    avgOKRCompletion: 73,
    atRiskStudents: 12
  })

  const [recentAlerts] = useState([
    {
      id: 1,
      type: 'at_risk',
      student: '张小明',
      message: '算法学习进度严重滞后，建议及时干预',
      time: '2小时前',
      severity: 'high'
    },
    {
      id: 2,
      type: 'achievement',
      student: '李小红',
      message: '提前完成React项目，表现优异',
      time: '4小时前',
      severity: 'low'
    },
    {
      id: 3,
      type: 'resource_request',
      student: '王小强',
      message: '请求额外的数据库学习资源',
      time: '6小时前',
      severity: 'medium'
    }
  ])

  const [topPerformers] = useState([
    { name: '李小红', progress: 95, improvement: '+12%' },
    { name: '陈小华', progress: 89, improvement: '+8%' },
    { name: '刘小东', progress: 85, improvement: '+15%' },
  ])

  const [courseOKRs] = useState([
    {
      id: 1,
      title: 'React前端开发',
      totalStudents: 45,
      avgProgress: 78,
      onTrack: 35,
      atRisk: 7,
      behind: 3
    },
    {
      id: 2,
      title: '算法与数据结构',
      totalStudents: 52,
      avgProgress: 65,
      onTrack: 28,
      atRisk: 15,
      behind: 9
    },
    {
      id: 3,
      title: '数据库系统',
      totalStudents: 48,
      avgProgress: 82,
      onTrack: 40,
      atRisk: 6,
      behind: 2
    }
  ])

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">早上好，王老师！</h1>
        <p className="text-green-100">今天有 3 个学生需要您的关注，12 个AI建议等待处理</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">班级学生数</p>
              <p className="text-2xl font-bold text-gray-900">{classData.totalStudents}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +5 新学期
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃学习者</p>
              <p className="text-2xl font-bold text-gray-900">{classData.activeStudents}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm">本周 +8 人</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均OKR完成率</p>
              <p className="text-2xl font-bold text-gray-900">{classData.avgOKRCompletion}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm">较上月 +7%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">需要关注</p>
              <p className="text-2xl font-bold text-gray-900">{classData.atRiskStudents}</p>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-600 text-sm">需及时干预</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course OKR Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">课程OKR概览</h2>
            <Link href="/teacher/course-okr" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看详情
            </Link>
          </div>
          
          <div className="space-y-4">
            {courseOKRs.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <span className="text-sm text-gray-500">
                    {course.totalStudents} 名学生
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>平均进度</span>
                  <span className={`font-medium ${getProgressColor(course.avgProgress)}`}>
                    {course.avgProgress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.avgProgress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span className="text-green-600">正常: {course.onTrack}</span>
                  <span className="text-yellow-600">风险: {course.atRisk}</span>
                  <span className="text-red-600">滞后: {course.behind}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">最新预警</h2>
            <Link href="/teacher/alerts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.student}</p>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <Award className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">本月表现优异</h2>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-700 font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">进度 {student.progress}%</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">
                  {student.improvement}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">AI智能洞察</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-900 mb-2">学习模式分析</h3>
              <p className="text-purple-700 text-sm">
                发现45%的学生在下午2-4点学习效率最高，建议调整重要课程时间安排
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">知识点难点识别</h3>
              <p className="text-blue-700 text-sm">
                "递归算法"是当前最大学习障碍，建议增加相关练习和案例讲解
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">教学建议</h3>
              <p className="text-green-700 text-sm">
                建议为进度领先的学生提供进阶挑战项目，保持学习动力
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
            <Users className="h-6 w-6 text-gray-400 group-hover:text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">批量发送消息</h3>
            <p className="text-sm text-gray-600">向需要关注的学生发送鼓励或提醒</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group">
            <Target className="h-6 w-6 text-gray-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">创建课程OKR</h3>
            <p className="text-sm text-gray-600">为新课程设定学习目标和评估标准</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group">
            <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">分享学习资源</h3>
            <p className="text-sm text-gray-600">向学生推荐相关的学习材料和工具</p>
          </button>
        </div>
      </div>
    </div>
  )
}