'use client'

import { useState } from 'react'
import { 
  Users, 
  Search, 
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Award,
  Clock,
  Edit3
} from 'lucide-react'

interface Student {
  id: string
  name: string
  studentId: string
  email: string
  major: string
  grade: string
  avatar?: string
  okrProgress: number
  status: 'excellent' | 'good' | 'at_risk' | 'behind'
  lastActive: string
  totalOKRs: number
  completedOKRs: number
  studyHours: number
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'excellent' | 'good' | 'at_risk' | 'behind'>('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: '张小明',
      studentId: '2022001234',
      email: 'xiaoming.zhang@student.hebnu.edu.cn',
      major: '软件工程',
      grade: '大二',
      okrProgress: 85,
      status: 'excellent',
      lastActive: '2小时前',
      totalOKRs: 4,
      completedOKRs: 2,
      studyHours: 45.2
    },
    {
      id: '2',
      name: '李小红',
      studentId: '2022001235',
      email: 'xiaohong.li@student.hebnu.edu.cn',
      major: '软件工程',
      grade: '大二',
      okrProgress: 92,
      status: 'excellent',
      lastActive: '1小时前',
      totalOKRs: 3,
      completedOKRs: 3,
      studyHours: 52.8
    },
    {
      id: '3',
      name: '王小强',
      studentId: '2022001236',
      email: 'xiaoqiang.wang@student.hebnu.edu.cn',
      major: '软件工程',
      grade: '大二',
      okrProgress: 45,
      status: 'at_risk',
      lastActive: '1天前',
      totalOKRs: 2,
      completedOKRs: 0,
      studyHours: 23.1
    },
    {
      id: '4',
      name: '陈小华',
      studentId: '2022001237',
      email: 'xiaohua.chen@student.hebnu.edu.cn',
      major: '软件工程',
      grade: '大二',
      okrProgress: 78,
      status: 'good',
      lastActive: '3小时前',
      totalOKRs: 3,
      completedOKRs: 1,
      studyHours: 38.5
    },
    {
      id: '5',
      name: '刘小东',
      studentId: '2022001238',
      email: 'xiaodong.liu@student.hebnu.edu.cn',
      major: '软件工程',
      grade: '大二',
      okrProgress: 25,
      status: 'behind',
      lastActive: '3天前',
      totalOKRs: 1,
      completedOKRs: 0,
      studyHours: 12.3
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'at_risk': return 'bg-yellow-100 text-yellow-800'
      case 'behind': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return '优秀'
      case 'good': return '良好'
      case 'at_risk': return '风险'
      case 'behind': return '滞后'
      default: return '未知'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-blue-600'
    if (progress >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const statusStats = {
    all: students.length,
    excellent: students.filter(s => s.status === 'excellent').length,
    good: students.filter(s => s.status === 'good').length,
    at_risk: students.filter(s => s.status === 'at_risk').length,
    behind: students.filter(s => s.status === 'behind').length
  }

  const editStudent = (student: Student) => {
    setEditingStudent(student)
    setShowEditModal(true)
  }

  const saveStudent = () => {
    if (!editingStudent) return
    
    setStudents(students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    ))
    
    // 保存到 localStorage
    localStorage.setItem('teacherStudents', JSON.stringify(students))
    
    setShowEditModal(false)
    setEditingStudent(null)
    alert('学生信息已更新')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">学生管理</h1>
        <p className="text-gray-600 mt-1">监控和管理班级学生的学习进展</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总学生数</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.all}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">优秀学生</p>
              <p className="text-2xl font-bold text-green-600">{statusStats.excellent}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">良好</p>
              <p className="text-2xl font-bold text-blue-600">{statusStats.good}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">需要关注</p>
              <p className="text-2xl font-bold text-yellow-600">{statusStats.at_risk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">严重滞后</p>
              <p className="text-2xl font-bold text-red-600">{statusStats.behind}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
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
              placeholder="搜索学生姓名、学号或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有状态 ({statusStats.all})</option>
              <option value="excellent">优秀 ({statusStats.excellent})</option>
              <option value="good">良好 ({statusStats.good})</option>
              <option value="at_risk">需要关注 ({statusStats.at_risk})</option>
              <option value="behind">严重滞后 ({statusStats.behind})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学生信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OKR进展
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学习时长
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后活跃
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-sm">
                          {student.name.slice(0, 1)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentId} · {student.major}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.okrProgress}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getProgressColor(student.okrProgress)}`}>
                        {student.okrProgress}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {student.completedOKRs}/{student.totalOKRs} 个目标完成
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.studyHours}h
                    </div>
                    <div className="text-xs text-gray-500">
                      本月累计
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {student.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="查看详情"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => editStudent(student)}
                        className="text-orange-600 hover:text-orange-900 p-1"
                        title="编辑学生"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1"
                        title="发送消息"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="更多操作"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到学生</h3>
          <p className="text-gray-600">
            {searchTerm ? '尝试使用不同的搜索条件' : '暂无学生数据'}
          </p>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              onClick={() => setShowEditModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-6">编辑学生信息</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学号
                    </label>
                    <input
                      type="text"
                      value={editingStudent.studentId}
                      onChange={(e) => setEditingStudent({...editingStudent, studentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        专业
                      </label>
                      <input
                        type="text"
                        value={editingStudent.major}
                        onChange={(e) => setEditingStudent({...editingStudent, major: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        年级
                      </label>
                      <select
                        value={editingStudent.grade}
                        onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="大一">大一</option>
                        <option value="大二">大二</option>
                        <option value="大三">大三</option>
                        <option value="大四">大四</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学习状态
                    </label>
                    <select
                      value={editingStudent.status}
                      onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="excellent">优秀</option>
                      <option value="good">良好</option>
                      <option value="at_risk">需要关注</option>
                      <option value="behind">严重滞后</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStudent}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}