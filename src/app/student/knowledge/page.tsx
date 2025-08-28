'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/lib/api'
import { 
  Search, 
  Send, 
  MessageCircle, 
  BookOpen, 
  Brain,
  Clock,
  Tag,
  Loader2,
  Plus,
  History,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  sender_type: 'user' | 'ai'
  content: string
  created_at: string
  confidence_score?: number
  processing_time?: number
  related_knowledge_ids?: string[]
}

interface Session {
  id: string
  title: string
  created_at: string
  updated_at: string
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

export default function KnowledgeQAPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  // 加载消息历史
  const loadMessages = async (sessionId: string) => {
    try {
      const result = await apiService.getKnowledgeChatHistory(sessionId)
      if (result.success) {
        setMessages(result.messages || [])
      }
    } catch (error) {
      console.error('加载消息历史失败:', error)
    }
  }

  // 搜索知识库
  const searchKnowledge = async (query: string) => {
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

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // 临时添加用户消息到界面
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_type: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const result = await apiService.sendKnowledgeQuestion(userMessage, currentSession)
      
      if (result.success) {
        // 更新当前会话ID
        if (!currentSession) {
          setCurrentSession(result.session_id)
        }

        // 移除临时用户消息，加载完整的消息历史
        await loadMessages(result.session_id)
        await loadSessions() // 更新会话列表
      } else {
        // 添加错误消息
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          sender_type: 'ai',
          content: result.answer || '抱歉，出现了错误，请稍后重试。',
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev.slice(0, -1), tempUserMessage, errorMessage])
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender_type: 'ai',
        content: '抱歉，网络错误，请稍后重试。',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev.slice(0, -1), tempUserMessage, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 开始新对话
  const startNewChat = () => {
    setCurrentSession(null)
    setMessages([])
  }

  // 选择会话
  const selectSession = async (sessionId: string) => {
    setCurrentSession(sessionId)
    await loadMessages(sessionId)
    setShowSidebar(false)
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
          <p className="text-gray-600">您需要登录才能使用知识库问答功能。</p>
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
              知识问答
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
                    onClick={() => setInputMessage(`请介绍一下"${item.title}"`)}
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
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                AI知识问答助手
              </h1>
            </div>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">欢迎使用AI知识问答</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                我可以帮助您回答各种技术问题，查找相关知识点。请在下方输入您的问题开始对话。
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['React Hooks的使用', '数据库设计原则', '算法复杂度分析'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender_type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.sender_type === 'ai' && (
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
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
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

        {/* 输入区域 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入您的问题..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              {isLoading ? (
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