'use client'

import { useState } from 'react'
import { 
  Users, 
  GraduationCap,
  BookOpen,
  TrendingUp,
  Server,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'

export default function AdminDashboard() {
  const [systemStats] = useState({
    totalUsers: 1247,
    activeUsers: 1156,
    totalCourses: 28,
    totalOKRs: 3842,
    systemUptime: '99.9%',
    avgResponseTime: '127ms'
  })

  const [resourceUsage] = useState([
    { name: 'CPU使用率', value: 45, max: 100, color: 'bg-blue-500' },
    { name: '内存使用', value: 68, max: 100, color: 'bg-green-500' },
    { name: '存储空间', value: 72, max: 100, color: 'bg-yellow-500' },
    { name: '网络带宽', value: 23, max: 100, color: 'bg-purple-500' }
  ])

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'user_register',
      message: '新用户注册：软件工程2024级',
      time: '5分钟前',
      status: 'info'
    },
    {
      id: 2,
      type: 'system_alert',
      message: 'AI服务响应时间超过阈值',
      time: '15分钟前',
      status: 'warning'
    },
    {
      id: 3,
      type: 'backup_complete',
      message: '数据库自动备份完成',
      time: '1小时前',
      status: 'success'
    },
    {
      id: 4,
      type: 'maintenance',
      message: '系统维护计划已启动',
      time: '2小时前',
      status: 'info'
    }
  ])

  const [departmentStats] = useState([
    {
      department: '软件工程系',
      students: 456,
      teachers: 23,
      avgOKRCompletion: 78,
      activeRate: 94
    },
    {
      department: '计算机科学系',
      students: 389,
      teachers: 19,
      avgOKRCompletion: 73,
      activeRate: 89
    },
    {
      department: '网络工程系',
      students: 302,
      teachers: 15,
      avgOKRCompletion: 81,
      activeRate: 92
    },
    {
      department: '数据科学系',
      students: 234,
      teachers: 12,
      avgOKRCompletion: 85,
      activeRate: 96
    }
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_register': return <Users className="h-4 w-4" />
      case 'system_alert': return <AlertCircle className="h-4 w-4" />
      case 'backup_complete': return <CheckCircle className="h-4 w-4" />
      case 'maintenance': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">系统管理控制台</h1>
        <p className="text-purple-100">河北师范大学软件学院 · 启明星AI智慧教育平台</p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>系统运行正常</span>
          </div>
          <div>在线用户: {systemStats.activeUsers}</div>
          <div>系统可用性: {systemStats.systemUptime}</div>
        </div>
      </div>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总用户数</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm">+12% 本月增长</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃课程</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalCourses}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm">3门新课程</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总OKR数量</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalOKRs}</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm">+245 本周新增</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均响应时间</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.avgResponseTime}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm">优秀性能</span>
          </div>
        </div>
      </div>

      {/* Resource Usage & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Resources */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">系统资源使用</h2>
            <Server className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {resourceUsage.map((resource, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{resource.name}</span>
                  <span>{resource.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${resource.color}`}
                    style={{ width: `${resource.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">系统活动日志</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">院系数据概览</h2>
          <GraduationCap className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  院系
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学生数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  教师数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均OKR完成率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活跃率
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.teachers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${dept.avgOKRCompletion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{dept.avgOKRCompletion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dept.activeRate >= 95 ? 'bg-green-100 text-green-800' :
                      dept.activeRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.activeRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">系统管理操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group">
            <Database className="h-6 w-6 text-gray-400 group-hover:text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">数据备份</h3>
            <p className="text-sm text-gray-600">执行系统数据备份操作</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
            <Users className="h-6 w-6 text-gray-400 group-hover:text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">用户管理</h3>
            <p className="text-sm text-gray-600">批量导入或管理用户账户</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group">
            <Activity className="h-6 w-6 text-gray-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">系统监控</h3>
            <p className="text-sm text-gray-600">查看详细的系统性能指标</p>
          </button>
        </div>
      </div>
    </div>
  )
}