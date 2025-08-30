'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Plus,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Edit3,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react'

interface CourseOKR {
  id: string
  courseId: string
  courseName: string
  objective: string
  description: string
  semester: string
  startDate: string
  endDate: string
  progress: number
  status: 'on_track' | 'at_risk' | 'completed'
  enrolledStudents: number
  passRate: number
  keyResults: {
    id: string
    title: string
    progress: number
    target: number
    unit: string
  }[]
}

export default function CourseOKRPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOKR, setEditingOKR] = useState<CourseOKR | null>(null)
  const [courseOKRs, setCourseOKRs] = useState<CourseOKR[]>([
    {
      id: '1',
      courseId: 'CS001',
      courseName: 'React前端开发',
      objective: '掌握现代前端开发技能，能够独立构建完整的React应用',
      description: '通过理论学习和项目实践，让学生全面掌握React生态系统，包括组件化开发、状态管理、路由等核心概念',
      semester: '2024春季学期',
      startDate: '2024-02-20',
      endDate: '2024-06-15',
      progress: 78,
      status: 'on_track',
      enrolledStudents: 45,
      passRate: 87,
      keyResults: [
        {
          id: 'kr1',
          title: '完成React基础项目',
          progress: 40,
          target: 45,
          unit: '人'
        },
        {
          id: 'kr2',
          title: '期末考试平均分',
          progress: 82,
          target: 80,
          unit: '分'
        },
        {
          id: 'kr3',
          title: '课程满意度',
          progress: 4.3,
          target: 4.0,
          unit: '分'
        }
      ]
    },
    {
      id: '2',
      courseId: 'CS002',
      courseName: '算法与数据结构',
      objective: '培养学生的算法思维，掌握常用数据结构和算法设计技巧',
      description: '系统学习各种数据结构的特点和应用场景，掌握经典算法的设计思路和优化方法',
      semester: '2024春季学期',
      startDate: '2024-02-20',
      endDate: '2024-06-15',
      progress: 65,
      status: 'at_risk',
      enrolledStudents: 52,
      passRate: 73,
      keyResults: [
        {
          id: 'kr4',
          title: 'LeetCode题目通过率',
          progress: 65,
          target: 80,
          unit: '%'
        },
        {
          id: 'kr5',
          title: '算法竞赛参与人数',
          progress: 15,
          target: 30,
          unit: '人'
        },
        {
          id: 'kr6',
          title: '课程项目完成率',
          progress: 35,
          target: 50,
          unit: '人'
        }
      ]
    },
    {
      id: '3',
      courseId: 'CS003',
      courseName: '数据库系统原理',
      objective: '理解数据库系统的核心原理，掌握数据库设计和优化技能',
      description: '从理论到实践，全面掌握关系数据库的设计原理、SQL语言和数据库管理技术',
      semester: '2024春季学期',
      startDate: '2024-02-20',
      endDate: '2024-06-15',
      progress: 85,
      status: 'on_track',
      enrolledStudents: 48,
      passRate: 91,
      keyResults: [
        {
          id: 'kr7',
          title: '数据库设计项目',
          progress: 45,
          target: 48,
          unit: '人'
        },
        {
          id: 'kr8',
          title: 'SQL实践考试通过率',
          progress: 91,
          target: 85,
          unit: '%'
        }
      ]
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800'
      case 'at_risk': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_track': return '进展良好'
      case 'at_risk': return '需要关注'
      case 'completed': return '已完成'
      default: return '未知状态'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const editOKR = (okr: CourseOKR) => {
    setEditingOKR(okr)
    setShowEditModal(true)
  }

  const saveOKR = () => {
    if (!editingOKR) return
    
    setCourseOKRs(courseOKRs.map(okr => 
      okr.id === editingOKR.id ? editingOKR : okr
    ))
    
    // 保存到localStorage
    localStorage.setItem('courseOKRs', JSON.stringify(courseOKRs))
    
    setShowEditModal(false)
    setEditingOKR(null)
    alert('课程OKR已更新')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">课程OKR管理</h1>
          <p className="text-gray-600 mt-1">设定和追踪课程级别的学习目标</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>创建课程OKR</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总课程数</p>
              <p className="text-2xl font-bold text-gray-900">{courseOKRs.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总学生数</p>
              <p className="text-2xl font-bold text-gray-900">
                {courseOKRs.reduce((sum, course) => sum + course.enrolledStudents, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均进展</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(courseOKRs.reduce((sum, course) => sum + course.progress, 0) / courseOKRs.length)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">需要关注</p>
              <p className="text-2xl font-bold text-gray-900">
                {courseOKRs.filter(course => course.status === 'at_risk').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Course OKRs List */}
      <div className="space-y-6">
        {courseOKRs.map((courseOKR) => (
          <div key={courseOKR.id} className="bg-white rounded-xl border shadow-sm">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {courseOKR.courseName}
                    </h2>
                    <span className="text-sm text-gray-500">({courseOKR.courseId})</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(courseOKR.status)}`}>
                      {getStatusText(courseOKR.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{courseOKR.objective}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{courseOKR.semester}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{courseOKR.enrolledStudents} 名学生</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>通过率 {courseOKR.passRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => alert(`查看课程详情：${courseOKR.courseName}`)}
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => editOKR(courseOKR)}
                    title="编辑课程OKR"
                  >
                    <Edit3 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => {
                      if (confirm(`确定要删除 ${courseOKR.courseName} 的OKR吗？`)) {
                        // 从本地存储中删除
                        const existingOKRs = JSON.parse(localStorage.getItem('courseOKRs') || '[]');
                        const updatedOKRs = existingOKRs.filter((okr: any) => okr.id !== courseOKR.id);
                        localStorage.setItem('courseOKRs', JSON.stringify(updatedOKRs));
                        // 刷新页面
                        window.location.reload();
                      }
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">整体进度</span>
                  <span className="text-sm font-medium text-gray-900">{courseOKR.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(courseOKR.progress)}`}
                    style={{ width: `${courseOKR.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">关键结果 (KRs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseOKR.keyResults.map((kr, index) => (
                  <div key={kr.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{kr.title}</span>
                      <span className="text-xs text-gray-500">KR{index + 1}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {kr.progress} / {kr.target} {kr.unit}
                      </span>
                      <span className={`font-medium ${
                        kr.progress >= kr.target ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {kr.progress >= kr.target ? '已完成' : 
                         Math.round((kr.progress / kr.target) * 100) + '%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          kr.progress >= kr.target ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((kr.progress / kr.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create OKR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowCreateModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">创建课程OKR</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程名称
                    </label>
                    <input
                      type="text"
                      placeholder="例如：Web前端开发基础"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程目标 (Objective)
                    </label>
                    <textarea
                      placeholder="描述本课程的主要学习目标..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学期
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>2024春季学期</option>
                        <option>2024秋季学期</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        预计学生数
                      </label>
                      <input
                        type="number"
                        placeholder="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    // 模拟保存OKR到Mock数据
                    const newOKR = {
                      id: Date.now().toString(),
                      courseId: 'CS' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
                      courseName: (document.querySelector('input[placeholder="例如：Web前端开发基础"]') as HTMLInputElement)?.value || '新课程',
                      objective: (document.querySelector('textarea[placeholder="描述本课程的主要学习目标..."]') as HTMLTextAreaElement)?.value || '课程目标',
                      description: '新创建的课程OKR',
                      semester: (document.querySelector('select') as HTMLSelectElement)?.value || '2024春季学期',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      progress: 0,
                      status: 'on_track',
                      enrolledStudents: parseInt((document.querySelector('input[placeholder="50"]') as HTMLInputElement)?.value || '0'),
                      passRate: 0,
                      keyResults: []
                    };
                    
                    // 保存到localStorage
                    const existingOKRs = JSON.parse(localStorage.getItem('courseOKRs') || '[]');
                    localStorage.setItem('courseOKRs', JSON.stringify([...existingOKRs, newOKR]));
                    
                    // 关闭模态框并刷新页面
                    setShowCreateModal(false);
                    window.location.reload();
                  }}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  创建课程OKR
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit OKR Modal */}
      {showEditModal && editingOKR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              onClick={() => setShowEditModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-6">编辑课程OKR</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程名称
                    </label>
                    <input
                      type="text"
                      value={editingOKR.courseName}
                      onChange={(e) => setEditingOKR({...editingOKR, courseName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程代码
                    </label>
                    <input
                      type="text"
                      value={editingOKR.courseId}
                      onChange={(e) => setEditingOKR({...editingOKR, courseId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程目标 (Objective)
                    </label>
                    <textarea
                      value={editingOKR.objective}
                      onChange={(e) => setEditingOKR({...editingOKR, objective: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程描述
                    </label>
                    <textarea
                      value={editingOKR.description}
                      onChange={(e) => setEditingOKR({...editingOKR, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学期
                      </label>
                      <input
                        type="text"
                        value={editingOKR.semester}
                        onChange={(e) => setEditingOKR({...editingOKR, semester: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        注册学生数
                      </label>
                      <input
                        type="number"
                        value={editingOKR.enrolledStudents}
                        onChange={(e) => setEditingOKR({...editingOKR, enrolledStudents: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        状态
                      </label>
                      <select
                        value={editingOKR.status}
                        onChange={(e) => setEditingOKR({...editingOKR, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="on_track">进展良好</option>
                        <option value="at_risk">需要关注</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
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
                  onClick={saveOKR}
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