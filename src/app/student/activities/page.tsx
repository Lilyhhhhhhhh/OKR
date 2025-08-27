'use client'

import { useState } from 'react'
import { 
  Target, 
  Brain, 
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'

interface Activity {
  id: string
  type: 'okr_update' | 'ai_suggestion' | 'achievement' | 'resource' | 'milestone'
  content: string
  time: string
  icon: React.ComponentType<any>
  details?: string
}

export default function ActivitiesPage() {
  const [activities] = useState<Activity[]>([
    { 
      id: '1',
      type: 'okr_update', 
      content: '更新了"提升前端开发技能"的进度', 
      time: '2小时前',
      icon: Target,
      details: '将TypeScript学习进度从65%提升到80%，完成了3个实践项目'
    },
    { 
      id: '2',
      type: 'ai_suggestion', 
      content: 'AI助手推荐了3个React学习资源', 
      time: '4小时前',
      icon: Brain,
      details: '基于您的学习进度，推荐了高质量的React Hooks教程和项目实战案例'
    },
    { 
      id: '3',
      type: 'achievement', 
      content: '完成了TypeScript基础学习里程碑', 
      time: '1天前',
      icon: Award,
      details: '恭喜您掌握了TypeScript的核心概念，包括类型系统、接口和泛型'
    },
    { 
      id: '4',
      type: 'resource', 
      content: '保存了新的学习资料到收藏夹', 
      time: '2天前',
      icon: BookOpen,
      details: '添加了"深入理解JavaScript异步编程"相关的5个优质资源'
    },
    { 
      id: '5',
      type: 'milestone', 
      content: '达成了月度学习时长目标', 
      time: '3天前',
      icon: CheckCircle2,
      details: '本月累计学习45.2小时，超出目标40小时，保持了良好的学习节奏'
    },
    { 
      id: '6',
      type: 'okr_update', 
      content: '调整了"算法与数据结构强化"目标期限', 
      time: '5天前',
      icon: Target,
      details: '根据当前进度分析，将完成期限延长2周，制定了更合理的学习计划'
    },
    { 
      id: '7',
      type: 'ai_suggestion', 
      content: 'AI助手分析了您的学习模式', 
      time: '1周前',
      icon: TrendingUp,
      details: '发现您在下午2-4点学习效率最高，建议在这个时间段进行重点难点学习'
    },
    { 
      id: '8',
      type: 'achievement', 
      content: '获得了"坚持学习者"徽章', 
      time: '1周前',
      icon: Award,
      details: '连续30天保持每日学习记录，展现了优秀的学习毅力和自律性'
    }
  ])

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'okr_update': return 'bg-blue-50'
      case 'ai_suggestion': return 'bg-purple-50'
      case 'achievement': return 'bg-yellow-50'
      case 'resource': return 'bg-green-50'
      case 'milestone': return 'bg-indigo-50'
      default: return 'bg-gray-50'
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'okr_update': return 'text-blue-600'
      case 'ai_suggestion': return 'text-purple-600'
      case 'achievement': return 'text-yellow-600'
      case 'resource': return 'text-green-600'
      case 'milestone': return 'text-indigo-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">学习动态</h1>
        <p className="text-gray-600 mt-1">查看您的所有学习活动和成长记录</p>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">最近活动</h2>
          
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center`}>
                    <activity.icon className={`h-5 w-5 ${getIconColor(activity.type)}`} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                  
                  {activity.details && (
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-600">本月目标更新</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">15</p>
          <p className="text-sm text-gray-600">AI智能建议</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-600">获得成就</p>
        </div>
      </div>
    </div>
  )
}