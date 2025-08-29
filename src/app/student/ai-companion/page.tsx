'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/lib/api'
import { 
  Send, 
  Brain, 
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Search,
  Plus,
  History,
  Clock,
  Tag,
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  confidence_score?: number
  processing_time?: number
  related_knowledge_ids?: string[]
}

interface QuickAction {
  icon: React.ReactNode
  title: string
  description: string
  action: string
}

interface ChatHistory {
  id: string
  title: string
  preview: string
  timestamp: Date
  messages: Message[]
}

interface KnowledgeItem {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  author: string
  created_at: string
}

interface Session {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function AICompanion() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是你的AI学习伴侣。我可以帮助你制定学习计划、回答学习问题、推荐学习资源，还能从知识库中为你找到相关资料。有什么可以帮助你的吗？',
      timestamp: new Date(),
      suggestions: ['制定学习计划', '搜索知识库', '分析学习进度', '推荐学习资源']
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 安全的时间格式化函数
  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return ''
    
    try {
      let date: Date
      if (timestamp instanceof Date) {
        date = timestamp
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else {
        return new Date().toLocaleTimeString()
      }
      
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString()
      }
      
      return date.toLocaleTimeString()
    } catch (e) {
      console.warn('Failed to format timestamp:', timestamp, e)
      return new Date().toLocaleTimeString()
    }
  }

  const quickActions: QuickAction[] = [
    {
      icon: <Target className="h-5 w-5" />,
      title: 'OKR规划',
      description: '帮我制定新的学习目标',
      action: '我想制定一个新的学习目标，请帮我规划一下'
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: '学习资源',
      description: '推荐相关学习材料',
      action: '请推荐一些适合我的学习资源'
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: '知识问答',
      description: '搜索知识库并解答问题',
      action: '我有一个技术问题，请从知识库中帮我找找相关资料'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: '进度分析',
      description: '查看我的学习进展',
      action: '请分析我最近的学习进展如何'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 搜索知识库
  const searchKnowledge = async (query: string) => {
    if (!query.trim()) {
      setKnowledgeItems([])
      return
    }
    
    try {
      const result = await apiService.searchKnowledge({ 
        query, 
        limit: 10 
      })
      if (result.success) {
        setKnowledgeItems(result.data || [])
      }
    } catch (error) {
      console.error('搜索知识库失败:', error)
    }
  }

  // 加载会话列表
  const loadSessions = async () => {
    try {
      const result = await apiService.getKnowledgeChatHistory()
      if (result.success) {
        setSessions(result.sessions || [])
      }
    } catch (error) {
      console.error('加载会话列表失败:', error)
    }
  }

  // 发送消息（集成知识库功能）
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // 使用知识库API发送消息
      const result = await apiService.sendKnowledgeQuestion(content, currentSession)
      
      if (result.success) {
        // 更新当前会话ID
        if (!currentSession) {
          setCurrentSession(result.session_id)
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.answer || '抱歉，我无法回答这个问题。',
          timestamp: new Date(),
          confidence_score: result.confidence,
          processing_time: result.processing_time,
          related_knowledge_ids: result.related_knowledge_ids || []
        }

        setMessages(prev => [...prev, aiMessage])
        
        // 更新会话列表
        await loadSessions()
      } else {
        // 处理错误情况
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.answer || '抱歉，出现了错误，请稍后重试。',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，网络错误，请稍后重试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // 开始新对话
  const startNewChat = () => {
    setCurrentSession(null)
    setMessages([
      {
        id: Date.now().toString(),
        type: 'ai',
        content: '你好！我是你的AI学习伴侣。我可以帮助你制定学习计划、回答学习问题、推荐学习资源，还能从知识库中为你找到相关资料。有什么可以帮助你的吗？',
        timestamp: new Date(),
        suggestions: ['制定学习计划', '搜索知识库', '分析学习进度', '推荐学习资源']
      }
    ])
  }

  // 选择会话
  const selectSession = async (sessionId: string) => {
    try {
      const result = await apiService.getKnowledgeChatHistory(sessionId)
      if (result.success && result.messages) {
        const convertedMessages: Message[] = result.messages.map((msg: any) => ({
          id: msg.id,
          type: msg.sender_type === 'user' ? 'user' : 'ai',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          confidence_score: msg.confidence_score,
          processing_time: msg.processing_time,
          related_knowledge_ids: msg.related_knowledge_ids
        }))
        setMessages(convertedMessages)
        setCurrentSession(sessionId)
        setShowSidebar(false)
      }
    } catch (error) {
      console.error('加载会话失败:', error)
    }
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  // 初始化
  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  // 搜索知识库
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery) {
        searchKnowledge(searchQuery)
      } else {
        setKnowledgeItems([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-600">您需要登录才能使用AI学习伴侣功能。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-120px)] bg-gray-50 rounded-xl overflow-hidden">
      {/* 侧边栏 */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300`}>
        {/* 侧边栏头部 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI学习伴侣
            </h2>
            <button
              onClick={startNewChat}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="新建对话"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {/* 知识库搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索知识库..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          {/* 知识库搜索结果 */}
          {knowledgeItems.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                知识库
              </h3>
              <div className="space-y-2">
                {knowledgeItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setInputValue(`请介绍一下"${item.title}"`)}
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700"
                          >
                            <Tag className="h-2.5 w-2.5 mr-0.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 历史会话 */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <History className="h-4 w-4 mr-1" />
              历史对话
            </h3>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    currentSession === session.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(session.updated_at).toLocaleDateString('zh-CN')}
                  </p>
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  暂无历史对话
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI学习伴侣</h1>
                <p className="text-purple-100">你的专属学习助手，支持知识库检索</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-100">在线 · 已连接知识库</span>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">欢迎使用AI学习伴侣</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                我可以帮助您制定学习计划、回答学习问题、推荐学习资源，还能从知识库中为您找到相关资料。
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-sm transition-colors"
                  >
                    {action.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">AI助手</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          {message.processing_time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{(message.processing_time / 1000).toFixed(1)}s</span>
                            </div>
                          )}
                          {message.confidence_score && (
                            <div className="flex items-center space-x-1">
                              <Sparkles className="h-3 w-3" />
                              <span>{Math.round(message.confidence_score * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left px-3 py-1 text-sm bg-white border border-gray-200 rounded text-gray-700 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 快速操作 */}
        <div className="bg-gray-50 border-t p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="p-3 bg-white border border-gray-200 rounded-lg text-left cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="text-purple-500">
                    {action.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-700">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            ))}
          </div>
          
          {/* 输入区域 */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="向AI助手提问..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px' }}
                disabled={isTyping}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }
                }}
              />
            </div>
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              {isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 侧边栏遮罩 */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  )
}