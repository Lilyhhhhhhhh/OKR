'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Search,
  Filter,
  Clock,
  User,
  Target,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Bell
} from 'lucide-react'

interface Alert {
  id: string
  type: 'academic' | 'attendance' | 'okr' | 'behavior'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  studentName: string
  studentId: string
  courseName?: string
  timestamp: Date
  status: 'active' | 'resolved' | 'dismissed'
  actionRequired: boolean
}

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved' | 'dismissed'>('all')
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'okr',
      severity: 'high',
      title: '学习进度严重滞后',
      description: '张小明在"算法与数据结构"课程的OKR进度仅为25%，远低于预期进度',
      studentName: '张小明',
      studentId: '2022001234',
      courseName: '算法与数据结构',
      timestamp: new Date(Date.now() - 7200000), // 2小时前
      status: 'active',
      actionRequired: true
    },
    {
      id: '2',
      type: 'academic',
      severity: 'medium',
      title: '作业提交率下降',
      description: '李小红最近3次作业均未按时提交，可能存在学习困难',
      studentName: '李小红',
      studentId: '2022001235',
      courseName: 'React前端开发',
      timestamp: new Date(Date.now() - 14400000), // 4小时前
      status: 'active',
      actionRequired: true
    },
    {
      id: '3',
      type: 'attendance',
      severity: 'medium',
      title: '出勤率异常',
      description: '王小强本周已缺课3次，出勤率降至60%',
      studentName: '王小强',
      studentId: '2022001236',
      courseName: '数据库系统原理',
      timestamp: new Date(Date.now() - 86400000), // 1天前
      status: 'active',
      actionRequired: true
    },
    {
      id: '4',
      type: 'okr',
      severity: 'low',
      title: '目标调整建议',
      description: '陈小华的学习进度超前，建议为其设定更有挑战性的目标',
      studentName: '陈小华',
      studentId: '2022001237',
      courseName: 'React前端开发',
      timestamp: new Date(Date.now() - 172800000), // 2天前
      status: 'dismissed',
      actionRequired: false
    },
    {
      id: '5',
      type: 'behavior',
      severity: 'low',
      title: '学习模式建议',
      description: '刘小东的学习时间主要集中在晚上，建议优化学习时间分配',
      studentName: '刘小东',
      studentId: '2022001238',
      timestamp: new Date(Date.now() - 259200000), // 3天前
      status: 'resolved',
      actionRequired: false
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <TrendingDown className="h-5 w-5" />
      case 'attendance': return <Clock className="h-5 w-5" />
      case 'okr': return <Target className="h-5 w-5" />
      case 'behavior': return <User className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'dismissed': return <XCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600'
      case 'resolved': return 'text-green-600'
      case 'dismissed': return 'text-gray-600'
      default: return 'text-blue-600'
    }
  }

  const updateAlertStatus = (alertId: string, newStatus: 'resolved' | 'dismissed') => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus, actionRequired: false } : alert
    ))
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
    
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    actionRequired: alerts.filter(a => a.actionRequired).length
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">预警中心</h1>
        <p className="text-gray-600 mt-1">监控学生学习状态，及时发现并处理问题</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总预警数</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-orange-600">{alertStats.active}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">高优先级</p>
              <p className="text-2xl font-bold text-red-600">{alertStats.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">需要行动</p>
              <p className="text-2xl font-bold text-purple-600">{alertStats.actionRequired}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索预警信息、学生姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有级别</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有状态</option>
              <option value="active">待处理</option>
              <option value="resolved">已解决</option>
              <option value="dismissed">已忽略</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">预警列表</h2>
          <p className="text-gray-600 text-sm">当前没有可显示的预警记录</p>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Bell className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预警信息</h3>
          <p className="text-gray-600 max-w-md">
            当前没有需要处理的预警信息。预警功能正在升级中，稍后将提供更全面的学生学习状态监控。
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}