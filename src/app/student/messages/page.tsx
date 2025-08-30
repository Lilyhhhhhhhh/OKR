'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Trash2,
  Filter,
  Search
} from 'lucide-react'

interface Message {
  id: string
  type: 'notification' | 'alert' | 'info' | 'success'
  title: string
  content: string
  timestamp: string
  read: boolean
  sender?: string
  category: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'alert',
      title: '学习进度预警',
      content: '您的"算法与数据结构强化"目标进度滞后，建议及时调整学习计划。AI助手已为您生成个性化的加速方案。',
      timestamp: '2024-01-20 14:30',
      read: false,
      sender: 'AI学习助手',
      category: '学习提醒'
    },
    {
      id: '2',
      type: 'success',
      title: '恭喜完成里程碑！',
      content: '您已成功完成"React项目开发"的第一个关键结果！继续保持这个学习节奏，相信您能在预定时间内达成所有目标。',
      timestamp: '2024-01-19 09:15',
      read: false,
      sender: '系统通知',
      category: '成就提醒'
    },
    {
      id: '3',
      type: 'info',
      title: '新的学习资源推荐',
      content: '基于您的学习偏好，我们为您推荐了3个高质量的TypeScript学习视频，点击查看详情。',
      timestamp: '2024-01-18 16:45',
      read: true,
      sender: 'AI学习助手',
      category: '资源推荐'
    },
    {
      id: '4',
      type: 'notification',
      title: '课程直播提醒',
      content: '王老师将在明天下午2点开始"高级JavaScript"直播课程，请提前加入课堂。',
      timestamp: '2024-01-17 18:20',
      read: true,
      sender: '王老师',
      category: '课程通知'
    },
    {
      id: '5',
      type: 'info',
      title: '系统维护通知',
      content: '平台将在本周日凌晨1:00-3:00进行系统维护，期间可能无法正常访问，请提前安排学习计划。',
      timestamp: '2024-01-16 10:30',
      read: true,
      sender: '系统管理员',
      category: '系统通知'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'alert' | 'success' | 'info'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      case 'notification': return <Bell className="h-5 w-5 text-yellow-500" />
      default: return <MessageSquare className="h-5 w-5 text-gray-500" />
    }
  }

  const getMessageBorderColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-red-500'
      case 'success': return 'border-l-green-500'
      case 'info': return 'border-l-blue-500'
      case 'notification': return 'border-l-yellow-500'
      default: return 'border-l-gray-500'
    }
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const markAllAsRead = () => {
    setMessages(messages.map(msg => ({ ...msg, read: true })))
  }

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
  }

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.read) ||
                         message.type === filter
    
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = messages.filter(msg => !msg.read).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">消息中心</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `您有 ${unreadCount} 条未读消息` : '所有消息已读'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span>全部标记为已读</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索消息..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              未读 {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('alert')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'alert' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              预警
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'success' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              成就
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-xl border-l-4 ${getMessageBorderColor(message.type)} shadow-sm hover:shadow-md transition-shadow ${
              !message.read ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(message.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.title}
                      </h3>
                      {!message.read && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 ${!message.read ? 'text-gray-700' : 'text-gray-600'}`}>
                      {message.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{message.sender}</span>
                      <span>•</span>
                      <span>{message.category}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="标记为已读"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="删除消息"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '没有找到相关消息' : '暂无消息'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? '尝试使用不同的搜索词' : '新消息会在这里显示'}
          </p>
        </div>
      )}
    </div>
  )
}