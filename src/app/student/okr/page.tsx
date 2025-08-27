'use client'

import { useState } from 'react'
import { 
  Plus, 
  Target, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Eye,
  MoreHorizontal,
  Brain,
  Trash2
} from 'lucide-react'

interface KeyResult {
  id: string
  title: string
  progress: number
  target: number
  unit: string
  completed: boolean
}

interface OKR {
  id: string
  objective: string
  description: string
  period: string
  status: 'on_track' | 'at_risk' | 'behind' | 'completed'
  progress: number
  keyResults: KeyResult[]
  createdAt: string
  dueDate: string
}

export default function OKRManagement() {
  const [activeTab, setActiveTab] = useState<'current' | 'completed' | 'all'>('current')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [updatingKR, setUpdatingKR] = useState<{okrId: string, krId: string} | null>(null)

  const [okrs, setOKRs] = useState<OKR[]>([
    {
      id: '1',
      objective: '提升前端开发技能',
      description: '通过项目实践和系统学习，全面提升前端开发能力，为找到理想的前端工作做好准备',
      period: '2024 Q1',
      status: 'on_track',
      progress: 75,
      createdAt: '2024-01-01',
      dueDate: '2024-03-31',
      keyResults: [
        {
          id: 'kr1',
          title: '完成React项目',
          progress: 3,
          target: 3,
          unit: '个',
          completed: true
        },
        {
          id: 'kr2',
          title: '学习TypeScript并应用到项目中',
          progress: 80,
          target: 100,
          unit: '%',
          completed: false
        },
        {
          id: 'kr3',
          title: '掌握Tailwind CSS框架',
          progress: 45,
          target: 100,
          unit: '%',
          completed: false
        }
      ]
    },
    {
      id: '2',
      objective: '算法与数据结构强化',
      description: '通过刷题和系统学习，提升算法思维和编程能力，为技术面试做好准备',
      period: '2024 Q1',
      status: 'at_risk',
      progress: 60,
      createdAt: '2024-01-01',
      dueDate: '2024-03-31',
      keyResults: [
        {
          id: 'kr4',
          title: 'LeetCode刷题',
          progress: 65,
          target: 100,
          unit: '道',
          completed: false
        },
        {
          id: 'kr5',
          title: '完成数据结构课程项目',
          progress: 30,
          target: 100,
          unit: '%',
          completed: false
        },
        {
          id: 'kr6',
          title: '参加算法竞赛',
          progress: 0,
          target: 2,
          unit: '次',
          completed: false
        }
      ]
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-700 bg-green-100'
      case 'at_risk': return 'text-yellow-700 bg-yellow-100'
      case 'behind': return 'text-red-700 bg-red-100'
      case 'completed': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_track': return '进展良好'
      case 'at_risk': return '存在风险'
      case 'behind': return '进度滞后'
      case 'completed': return '已完成'
      default: return '状态未知'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // 更新关键结果进度
  const updateKRProgress = (okrId: string, krId: string, newProgress: number) => {
    setOKRs(okrs.map(okr => {
      if (okr.id === okrId) {
        const updatedKRs = okr.keyResults.map(kr => {
          if (kr.id === krId) {
            const isCompleted = newProgress >= kr.target
            return { ...kr, progress: newProgress, completed: isCompleted }
          }
          return kr
        })
        
        // 计算整体进度
        const totalProgress = updatedKRs.reduce((sum, kr) => sum + (kr.progress / kr.target * 100), 0) / updatedKRs.length
        
        return {
          ...okr,
          keyResults: updatedKRs,
          progress: Math.round(totalProgress)
        }
      }
      return okr
    }))
    setShowProgressModal(false)
    setUpdatingKR(null)
  }

  // 删除OKR
  const deleteOKR = (okrId: string) => {
    if (confirm('确定要删除这个OKR吗？此操作不可撤销。')) {
      setOKRs(okrs.filter(okr => okr.id !== okrId))
    }
  }

  // 编辑OKR
  const editOKR = (okr: OKR) => {
    setEditingOKR(okr)
    setShowEditModal(true)
  }

  // 保存编辑的OKR
  const saveEditedOKR = (updatedOKR: OKR) => {
    setOKRs(okrs.map(okr => okr.id === updatedOKR.id ? updatedOKR : okr))
    setShowEditModal(false)
    setEditingOKR(null)
  }

  // 开始更新关键结果进度
  const startUpdatingKR = (okrId: string, krId: string) => {
    setUpdatingKR({ okrId, krId })
    setShowProgressModal(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OKR 目标管理</h1>
          <p className="text-gray-600 mt-1">设定、追踪和实现你的学习目标</p>
        </div>
        <button
          className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          disabled
          title="当前不支持创建新目标"
        >
          <Plus className="h-5 w-5" />
          <span>创建新目标</span>
        </button>
      </div>

      {/* AI Suggestion Banner - 静态显示，无交互功能 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Brain className="h-6 w-6 text-purple-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-purple-900">AI智能建议</h3>
            <p className="text-purple-700 text-sm mt-1">
              基于你的学习进度，建议调整"算法与数据结构强化"目标的时间安排，可以考虑将每日刷题时间增加30分钟。
            </p>
            <div className="flex space-x-2 mt-3">
              <span className="text-gray-400 text-sm font-medium cursor-not-allowed">
                采纳建议
              </span>
              <span className="text-gray-400 text-sm cursor-not-allowed">
                忽略
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - 静态显示，无交互功能 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'current', label: '进行中', count: okrs.filter(o => o.status !== 'completed').length },
            { key: 'completed', label: '已完成', count: okrs.filter(o => o.status === 'completed').length },
            { key: 'all', label: '全部', count: okrs.length }
          ].map((tab) => (
            <div
              key={tab.key}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* OKR List */}
      <div className="space-y-4">
        {okrs.map((okr) => (
          <div key={okr.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            {/* OKR Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{okr.objective}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(okr.status)}`}>
                      {getStatusText(okr.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{okr.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{okr.period}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>截止：{new Date(okr.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="查看详情"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => editOKR(okr)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="编辑OKR"
                  >
                    <Edit3 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => deleteOKR(okr.id)}
                    className="p-2 hover:bg-red-100 rounded-lg"
                    title="删除OKR"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">整体进度</span>
                  <span className="text-sm font-medium text-gray-900">{okr.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(okr.progress)}`}
                    style={{ width: `${okr.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="p-6 space-y-4">
              <h3 className="font-medium text-gray-900 mb-3">关键结果 (KRs)</h3>
              {okr.keyResults.map((kr, index) => (
                <div key={kr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      kr.completed ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {kr.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        kr.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {kr.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(kr.progress / kr.target) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {kr.progress}/{kr.target} {kr.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startUpdatingKR(okr.id, kr.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    更新
                  </button>
                </div>
              ))}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">创建新的OKR目标</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      目标 (Objective)
                    </label>
                    <input
                      type="text"
                      placeholder="例如：提升后端开发技能"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      placeholder="详细描述你的目标..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        时间周期
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>2024 Q2</option>
                        <option>2024 Q3</option>
                        <option>2024 Q4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        截止日期
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  创建目标
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

      {/* Progress Update Modal */}
      {showProgressModal && updatingKR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowProgressModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {(() => {
                const okr = okrs.find(o => o.id === updatingKR.okrId)
                const kr = okr?.keyResults.find(k => k.id === updatingKR.krId)
                
                if (!okr || !kr) return null

                return (
                  <>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">更新进度</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            关键结果
                          </label>
                          <p className="text-gray-600">{kr.title}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            当前进度: {kr.progress}/{kr.target} {kr.unit}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={kr.target}
                            defaultValue={kr.progress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            id="progressInput"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('progressInput') as HTMLInputElement
                          const newProgress = parseInt(input.value)
                          updateKRProgress(updatingKR.okrId, updatingKR.krId, newProgress)
                        }}
                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        更新进度
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProgressModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        取消
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Edit OKR Modal */}
      {showEditModal && editingOKR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowEditModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">编辑OKR目标</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      目标 (Objective)
                    </label>
                    <input
                      type="text"
                      defaultValue={editingOKR.objective}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      id="editObjective"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      defaultValue={editingOKR.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      id="editDescription"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        时间周期
                      </label>
                      <input
                        type="text"
                        defaultValue={editingOKR.period}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        id="editPeriod"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        截止日期
                      </label>
                      <input
                        type="date"
                        defaultValue={editingOKR.dueDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        id="editDueDate"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    const objective = (document.getElementById('editObjective') as HTMLInputElement).value
                    const description = (document.getElementById('editDescription') as HTMLTextAreaElement).value
                    const period = (document.getElementById('editPeriod') as HTMLInputElement).value
                    const dueDate = (document.getElementById('editDueDate') as HTMLInputElement).value
                    
                    const updatedOKR: OKR = {
                      ...editingOKR,
                      objective,
                      description,
                      period,
                      dueDate
                    }
                    
                    saveEditedOKR(updatedOKR)
                  }}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  保存更改
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}