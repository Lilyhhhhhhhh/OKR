'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
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
  description?: string
  metric_type: string
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

export default function OKRManagement() {
  const { user, student } = useAuth()
  const [activeTab, setActiveTab] = useState<'current' | 'completed' | 'all'>('current')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOKR, setEditingOKR] = useState<Objective | null>(null)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [updatingKR, setUpdatingKR] = useState<{objId: string, krId: string} | null>(null)
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  
  // 临时存储关键结果
  const [tempKeyResults, setTempKeyResults] = useState<Partial<KeyResult>[]>([])
  const [newKeyResult, setNewKeyResult] = useState('')
  const [newKeyResultTarget, setNewKeyResultTarget] = useState<number>(100)
  const [newKeyResultUnit, setNewKeyResultUnit] = useState<'percentage' | 'number' | 'boolean'>('percentage')
  
  // 加载用户的OKR数据
  const loadObjectives = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/okr/objectives')
      if (response.ok) {
        const data = await response.json()
        setObjectives(data)
      } else {
        console.error('获取OKR数据失败:', response.status)
      }
    } catch (error) {
      console.error('获取OKR数据错误:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadObjectives()
    }
  }, [user])

  // 打开创建模态框
  const openCreateModal = () => {
    setTempKeyResults([])
    setNewKeyResult('')
    setNewKeyResultTarget(100)
    setNewKeyResultUnit('percentage')
    setShowCreateModal(true)
  }
  
  // 关闭创建模态框
  const closeCreateModal = () => {
    setTempKeyResults([])
    setNewKeyResult('')
    setNewKeyResultTarget(100)
    setNewKeyResultUnit('percentage')
    setShowCreateModal(false)
  }
  
  // 添加关键结果
  const addKeyResult = () => {
    if (newKeyResult.trim() === '') return
    
    const keyResult: Partial<KeyResult> = {
      title: newKeyResult,
      description: '',
      metric_type: newKeyResultUnit,
      target_value: newKeyResultTarget,
      current_value: 0,
      progress: 0,
      status: 'active'
    }
    
    setTempKeyResults([...tempKeyResults, keyResult])
    setNewKeyResult('')
    setNewKeyResultTarget(100)
  }

  // 创建新的OKR
  const createObjective = async (formData: FormData) => {
    if (!user || creating) return
    
    try {
      setCreating(true)
      
      const objectiveData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string || '学习',
        priority: 'medium',
        target_date: formData.get('target_date') as string,
        key_results: tempKeyResults.map(kr => ({
          title: kr.title,
          description: kr.description || '',
          metric_type: kr.metric_type,
          target_value: kr.target_value
        }))
      }
      
      const response = await fetch('/api/okr/objectives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectiveData)
      })
      
      if (response.ok) {
        const newObjective = await response.json()
        setObjectives([newObjective, ...objectives])
        closeCreateModal()
        alert('OKR创建成功！')
      } else {
        const error = await response.json()
        alert('创建失败: ' + (error.error || '未知错误'))
      }
    } catch (error) {
      console.error('创建OKR错误:', error)
      alert('创建失败，请稍后重试')
    } finally {
      setCreating(false)
    }
  }

  // 示例数据（如果没有数据时显示）
  const [sampleOKRs] = useState<Objective[]>([
    {
      id: 'sample1',
      title: '提升前端开发技能',
      description: '通过项目实践和系统学习，全面提升前端开发能力，为找到理想的前端工作做好准备',
      category: '技能提升',
      priority: 'high',
      status: 'active',
      target_date: '2024-06-30',
      progress: 0,
      key_results: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ])

  // 获取要显示的OKR数据
  const displayObjectives = objectives.length > 0 ? objectives : (loading ? [] : sampleOKRs)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-700 bg-blue-100'
      case 'paused': return 'text-yellow-700 bg-yellow-100'
      case 'completed': return 'text-green-700 bg-green-100'
      case 'cancelled': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中'
      case 'paused': return '暂停'
      case 'completed': return '已完成'
      case 'cancelled': return '已取消'
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
  const updateKRProgress = async (objId: string, krId: string, newValue: number, note?: string) => {
    try {
      const response = await fetch(`/api/okr/key-results/${krId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_value: newValue,
          note: note
        })
      })
      
      if (response.ok) {
        // 重新加载数据以获取最新的进度
        await loadObjectives()
        setShowProgressModal(false)
        setUpdatingKR(null)
      } else {
        const error = await response.json()
        alert('更新失败: ' + (error.error || '未知错误'))
      }
    } catch (error) {
      console.error('更新进度错误:', error)
      alert('更新失败，请稍后重试')
    }
  }

  // 删除OKR
  const deleteObjective = async (objId: string) => {
    if (!confirm('确定要删除这个OKR吗？此操作不可撤销。')) {
      return
    }
    
    try {
      const response = await fetch(`/api/okr/objectives/${objId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setObjectives(objectives.filter(obj => obj.id !== objId))
      } else {
        alert('删除失败，请稍后重试')
      }
    } catch (error) {
      console.error('删除OKR错误:', error)
      alert('删除失败，请稍后重试')
    }
  }

  // 编辑OKR
  const editObjective = (obj: Objective) => {
    setEditingOKR(obj)
    setShowEditModal(true)
  }

  // 开始更新关键结果进度
  const startUpdatingKR = (objId: string, krId: string) => {
    setUpdatingKR({ objId, krId })
    setShowProgressModal(true)
  }

  // 用户未登录时的检查
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-600">您需要登录才能使用OKR管理功能。</p>
        </div>
      </div>
    )
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
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          title="创建新目标"
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

      {/* 状态统计 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">目标统计</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium">进行中</p>
                <p className="text-2xl font-bold text-blue-700">
                  {displayObjectives.filter(o => o.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-green-600 text-sm font-medium">已完成</p>
                <p className="text-2xl font-bold text-green-700">
                  {displayObjectives.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">总计</p>
                <p className="text-2xl font-bold text-gray-700">{displayObjectives.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading 状态 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      )}

      {/* 空状态 */}
      {!loading && objectives.length === 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有OKR目标</h3>
          <p className="text-gray-600 mb-4">创建你的第一个OKR目标，开始你的成长之旅！</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>创建目标</span>
          </button>
        </div>
      )}

      {/* OKR List */}
      <div className="space-y-4">
        {displayObjectives.map((objective) => (
          <div key={objective.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            {/* OKR Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{objective.title}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(objective.status)}`}>
                      {getStatusText(objective.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{objective.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{objective.category || '学习'}</span>
                    </div>
                    {objective.target_date && (
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>截止：{new Date(objective.target_date).toLocaleDateString()}</span>
                      </div>
                    )}
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
                    onClick={() => editObjective(objective)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="编辑OKR"
                  >
                    <Edit3 className="h-4 w-4 text-gray-600" />
                  </button>
                  {objectives.length > 0 && (
                    <button 
                      onClick={() => deleteObjective(objective.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                      title="删除OKR"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">整体进度</span>
                  <span className="text-sm font-medium text-gray-900">{objective.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(objective.progress || 0)}`}
                    style={{ width: `${objective.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="p-6 space-y-4">
              <h3 className="font-medium text-gray-900 mb-3">关键结果 (KRs)</h3>
              {objective.key_results && objective.key_results.length > 0 ? (
                objective.key_results.map((kr, index) => {
                  const isCompleted = kr.progress >= 100
                  return (
                    <div key={kr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {kr.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${Math.min(kr.progress || 0, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {kr.current_value || 0}/{kr.target_value} {kr.metric_type === 'percentage' ? '%' : (kr.metric_type === 'number' ? '个' : '')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {objectives.length > 0 && (
                        <button 
                          onClick={() => startUpdatingKR(objective.id, kr.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          更新
                        </button>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  暂无关键结果
                </div>
              )}
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                createObjective(formData)
              }}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">创建新的OKR目标</h3>
                  
                  <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      目标 (Objective)
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="例如：提升后端开发技能"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      name="description"
                      placeholder="详细描述你的目标..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        目标分类
                      </label>
                      <select name="category" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="学习">学习</option>
                        <option value="技能">技能</option>
                        <option value="项目">项目</option>
                        <option value="考试">考试</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        截止日期
                      </label>
                      <input
                        name="target_date"
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* 关键结果区域 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      关键结果（KRs）
                    </label>
                    
                    {/* 已添加的关键结果列表 */}
                    {tempKeyResults.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {tempKeyResults.map((kr, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{index + 1}. {kr.title}</span>
                                <div className="text-xs text-gray-500">
                                  {kr.metric_type === 'percentage' ? '%' : (kr.metric_type === 'number' ? '个' : '是/否')} | 目标: {kr.target_value}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTempKeyResults(tempKeyResults.filter((_, i) => i !== index))}
                              className="ml-2 text-red-500 hover:text-red-700 p-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 添加关键结果输入框 */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newKeyResult}
                          onChange={(e) => setNewKeyResult(e.target.value)}
                          placeholder="输入关键结果..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <select 
                            value={newKeyResultUnit} 
                            onChange={(e) => setNewKeyResultUnit(e.target.value as 'percentage' | 'number' | 'boolean')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="percentage">百分比 (%)</option>
                            <option value="number">数量 (个)</option>
                            <option value="boolean">是/否</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={newKeyResultTarget}
                            onChange={(e) => setNewKeyResultTarget(Number(e.target.value))}
                            placeholder="目标值"
                            min="1"
                            max={newKeyResultUnit === 'percentage' ? '100' : undefined}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addKeyResult}
                        disabled={!newKeyResult.trim()}
                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        添加关键结果
                      </button>
                    </div>
                    {tempKeyResults.length === 0 && (
                      <p className="mt-2 text-xs text-gray-500">请至少添加一个关键结果</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={tempKeyResults.length === 0 || creating}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {creating ? '创建中...' : '创建目标'}
                </button>
                </div>
              </form>
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
                const objective = displayObjectives.find(o => o.id === updatingKR.objId)
                const kr = objective?.key_results?.find(k => k.id === updatingKR.krId)
                
                if (!objective || !kr) return null

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
                            当前进度: {kr.current_value || 0}/{kr.target_value} {kr.metric_type === 'percentage' ? '%' : '个'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={kr.target_value}
                            defaultValue={kr.current_value || 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            id="progressInput"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            备注（可选）
                          </label>
                          <textarea
                            placeholder="记录更新进度的原因或说明..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                            id="progressNote"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('progressInput') as HTMLInputElement
                          const noteInput = document.getElementById('progressNote') as HTMLTextAreaElement
                          const newValue = parseFloat(input.value) || 0
                          const note = noteInput.value.trim()
                          updateKRProgress(updatingKR.objId, updatingKR.krId, newValue, note)
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

      {/* Edit OKR Modal - 简化版本，仅显示提示 */}
      {showEditModal && editingOKR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowEditModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">编辑功能</h3>
                
                <div className="text-center py-8">
                  <Edit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">编辑OKR功能正在开发中...</p>
                  <p className="text-sm text-gray-500">您可以先删除现有目标，再重新创建一个。</p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-center">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}