'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/lib/api'
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
      const data = await apiService.getObjectives()
      setObjectives(data)
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
      
      const newObjective = await apiService.createObjective(objectiveData)
      setObjectives([newObjective, ...objectives])
      closeCreateModal()
      alert('OKR创建成功！')
    } catch (error) {
      console.error('创建OKR错误:', error)
      alert('创建失败，请稍后重试')
    } finally {
      setCreating(false)
    }
  }

  // 获取要显示的OKR数据
  const displayObjectives = objectives

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
      await apiService.updateKeyResultProgress(krId, {
        current_value: newValue,
        note: note
      })
      
      // 重新加载数据以获取最新的进度
      await loadObjectives()
      setShowProgressModal(false)
      setUpdatingKR(null)
      alert('进度更新成功！')
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
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-purple-600 text-sm font-medium">总计</p>
                <p className="text-2xl font-bold text-purple-700">
                  {displayObjectives.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'current', name: '进行中', icon: TrendingUp },
            { id: 'completed', name: '已完成', icon: CheckCircle2 },
            { id: 'all', name: '全部', icon: Target }
          ].map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayObjectives
            .filter(objective => {
              if (activeTab === 'current') return objective.status === 'active'
              if (activeTab === 'completed') return objective.status === 'completed'
              return true
            })
            .map(objective => (
              <div key={objective.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {/* OKR Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(objective.status)}`}>
                          {getStatusText(objective.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{objective.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{objective.target_date ? new Date(objective.target_date).toLocaleDateString('zh-CN') : '未设置截止日期'}</span>
                        </div>
                        {objective.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                            {objective.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {objectives.length > 0 && (
                        <>
                          <button
                            onClick={() => editObjective(objective)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="编辑目标"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteObjective(objective.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="删除目标"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">整体进度</span>
                      <span className="text-sm text-gray-600">{objective.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(objective.progress || 0)}`}
                        style={{ width: `${Math.min(objective.progress || 0, 100)}%` }}
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
            ))
          }
          
          {displayObjectives.filter(objective => {
            if (activeTab === 'current') return objective.status === 'active'
            if (activeTab === 'completed') return objective.status === 'completed'
            return true
          }).length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'current' ? '暂无进行中的目标' : 
                 activeTab === 'completed' ? '暂无已完成的目标' : '暂无目标'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'current' ? '创建你的第一个OKR，开始目标管理之旅' : 
                 activeTab === 'completed' ? '还没有完成的目标，继续加油！' : '创建你的第一个OKR吧'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">创建新的 OKR</h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              createObjective(formData)
            }}>
              <div className="space-y-4">
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

                {/* Key Results Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    关键结果 (Key Results)
                  </label>
                  
                  {/* 已添加的关键结果 */}
                  {tempKeyResults.map((kr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{kr.title}</p>
                        <p className="text-xs text-gray-600">
                          目标值: {kr.target_value} {kr.metric_type === 'percentage' ? '%' : (kr.metric_type === 'number' ? '个' : '')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTempKeyResults(tempKeyResults.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* 添加关键结果的表单 */}
                  <div className="border border-dashed border-gray-300 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="关键结果描述"
                        value={newKeyResult}
                        onChange={(e) => setNewKeyResult(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="目标值"
                        value={newKeyResultTarget}
                        onChange={(e) => setNewKeyResultTarget(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="0"
                      />
                      <select
                        value={newKeyResultUnit}
                        onChange={(e) => setNewKeyResultUnit(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="percentage">百分比 (%)</option>
                        <option value="number">数量 (个)</option>
                        <option value="boolean">完成状态</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addKeyResult}
                      disabled={!newKeyResult.trim()}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      + 添加关键结果
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  disabled={creating}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
                >
                  {creating ? '创建中...' : '创建 OKR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showProgressModal && updatingKR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">更新进度</h2>
              <button
                onClick={() => {
                  setShowProgressModal(false)
                  setUpdatingKR(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            {(() => {
              const objective = displayObjectives.find(o => o.id === updatingKR.objId)
              const kr = objective?.key_results?.find(k => k.id === updatingKR.krId)
              
              if (!kr) return null
              
              return (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">关键结果</p>
                    <p className="font-medium text-gray-900">{kr.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      当前进度: {kr.current_value}/{kr.target_value} ({kr.progress}%)
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        新的当前值
                      </label>
                      <input
                        id="progressInput"
                        type="number"
                        defaultValue={kr.current_value}
                        min="0"
                        max={kr.target_value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        更新备注 (可选)
                      </label>
                      <textarea
                        id="progressNote"
                        placeholder="记录这次进度更新的相关信息..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowProgressModal(false)
                        setUpdatingKR(null)
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        const input = document.getElementById('progressInput') as HTMLInputElement
                        const noteInput = document.getElementById('progressNote') as HTMLTextAreaElement
                        const newValue = parseFloat(input.value) || 0
                        const note = noteInput.value.trim()
                        updateKRProgress(updatingKR.objId, updatingKR.krId, newValue, note)
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      更新进度
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}