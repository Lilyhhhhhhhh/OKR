'use client'

import { useState, useRef, useEffect } from 'react'
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
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
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

export default function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好，张小明！我是你的AI学习伴侣。我注意到你在"算法与数据结构强化"目标上进度有点滞后，需要我帮你制定一个加速计划吗？',
      timestamp: new Date(),
      suggestions: ['制定学习计划', '推荐学习资源', '分析学习障碍']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: '学习计划制定',
      preview: '帮助制定React学习路径和时间安排',
      timestamp: new Date(Date.now() - 86400000),
      messages: [
        {
          id: 'h1',
          type: 'user',
          content: '我想学习React，但不知道从哪里开始',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: 'h2',
          type: 'ai',
          content: '建议你从JavaScript基础开始，然后学习React基础概念...',
          timestamp: new Date(Date.now() - 86400000)
        }
      ]
    },
    {
      id: '2',
      title: 'TypeScript疑问解答',
      preview: '关于TypeScript泛型的使用方法',
      timestamp: new Date(Date.now() - 172800000),
      messages: []
    },
    {
      id: '3',
      title: '算法学习建议',
      preview: '数据结构学习顺序和重点难点分析',
      timestamp: new Date(Date.now() - 259200000),
      messages: []
    }
  ])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      icon: <AlertCircle className="h-5 w-5" />,
      title: '学习诊断',
      description: '分析我的学习障碍',
      action: '我在学习中遇到了一些困难，请帮我分析一下'
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

  const handleSendMessage = async (content: string) => {
    // 功能已禁用，不执行任何操作
    return
  }

  const saveCurrentChatToHistory = (currentMessages: Message[], userQuestion: string) => {
    if (currentMessages.length >= 4) { // 至少有2轮对话才保存
      const newHistory: ChatHistory = {
        id: Date.now().toString(),
        title: userQuestion.length > 20 ? userQuestion.substring(0, 20) + '...' : userQuestion,
        preview: currentMessages[currentMessages.length - 1].content.substring(0, 50) + '...',
        timestamp: new Date(),
        messages: [...currentMessages]
      }
      
      setChatHistory(prev => [newHistory, ...prev].slice(0, 10)) // 只保留最近10条
      
      // 保存到localStorage
      const updatedHistory = [newHistory, ...chatHistory].slice(0, 10)
      localStorage.setItem('aiChatHistory', JSON.stringify(updatedHistory))
    }
  }

  const loadHistoryChat = (historyId: string) => {
    const history = chatHistory.find(h => h.id === historyId)
    if (history && history.messages.length > 0) {
      setMessages(history.messages)
      setSelectedHistoryId(historyId)
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'ai',
        content: '你好！我是你的AI学习伴侣，有什么可以帮助你的吗？',
        timestamp: new Date(),
        suggestions: ['制定学习计划', '推荐学习资源', '分析学习障碍']
      }
    ])
    setSelectedHistoryId(null)
  }

  // 初始化时加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiChatHistory')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }))
        setChatHistory(parsed)
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    }
  }, [])

  const generateAIResponse = (userInput: string): string => {
    if (userInput.includes('目标') || userInput.includes('OKR')) {
      return '基于你的学习情况，我建议你设定一个渐进式的目标。比如可以先从每天刷2道算法题开始，逐步增加到5道。同时建议你：\n\n1. 每周选择一个数据结构主题深入学习\n2. 记录解题思路和总结\n3. 参加线上算法讨论'
    } else if (userInput.includes('资源') || userInput.includes('推荐')) {
      return '根据你的学习进度，我为你推荐以下资源：\n\n📚 **书籍推荐**\n- 《算法导论》- 系统性学习\n- 《剑指Offer》- 面试导向\n\n🎥 **视频课程**\n- B站Up主"程序员Carl"的算法专题\n- LeetCode官方题解视频\n\n💻 **练习平台**\n- LeetCode中国站\n- 牛客网算法专项'
    } else if (userInput.includes('困难') || userInput.includes('障碍')) {
      return '我分析了你的学习数据，发现主要障碍可能在于：\n\n🎯 **时间管理**\n- 你的学习时间较为分散，建议固定每天下午2-4点为算法专项时间\n\n🧠 **理解深度**\n- 建议采用费曼学习法，尝试向他人解释算法思路\n\n💪 **坚持性**\n- 可以加入学习小组，互相监督和讨论'
    } else if (userInput.includes('进展') || userInput.includes('进度')) {
      return '让我来分析你最近的学习进展：\n\n📊 **数据概览**\n- 本周学习时长：12.5小时（目标15小时）\n- 完成题目：8道（目标10道）\n- 知识点掌握：数组85%，链表70%\n\n💡 **改进建议**\n- 链表部分需要加强练习\n- 可以尝试更多中等难度题目\n- 建议整理错题本'
    }
    return '我理解你的需求，基于你的学习情况，我建议我们可以从以下几个方面来优化你的学习计划...'
  }

  const generateSuggestions = (userInput: string): string[] => {
    const baseSuggestions = ['详细解释', '制定具体计划', '推荐更多资源']
    if (userInput.includes('目标')) {
      return ['制定详细时间表', '设定里程碑', '选择评估指标']
    } else if (userInput.includes('资源')) {
      return ['分类别推荐', '难度等级分析', '制定学习路径']
    }
    return baseSuggestions
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex gap-6">
      {/* History Sidebar */}
      <div className="w-80 flex flex-col">
        <div className="bg-white rounded-xl border shadow-sm flex-1 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">对话历史</h2>
              <button
                onClick={startNewChat}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                新对话
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory.map((history) => (
              <button
                key={history.id}
                onClick={() => loadHistoryChat(history.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedHistoryId === history.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {history.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {history.preview}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {history.timestamp.toLocaleDateString()}
                </p>
              </button>
            ))}
            
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>暂无对话历史</p>
                <p>开始你的第一次对话吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI学习伴侣</h1>
              <p className="text-purple-100">你的专属学习助手，24/7在线</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-100">在线 · 已为你学习66天</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white border-x overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.type === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">AI助手</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
              
              {message.suggestions && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="block w-full text-left px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded text-gray-500 cursor-not-allowed"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">AI助手正在思考...</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - 已禁用 */}
      <div className="bg-gray-50 border-x border-b p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-left cursor-not-allowed"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="text-gray-400">
                  {action.icon}
                </div>
                <span className="font-medium text-sm text-gray-500">{action.title}</span>
              </div>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="向AI助手提问..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputValue)
              }
            }}
          />
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>发送</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}