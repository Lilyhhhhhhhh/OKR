'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Clock,
  Tag
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'article' | 'course'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  duration?: string
  views: number
  url: string
  tags: string[]
  dateAdded: string
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'React 完整教程 - 从零到精通',
      description: '全面学习React框架，包括组件、状态管理、路由等核心概念',
      type: 'video',
      category: '前端开发',
      difficulty: 'intermediate',
      rating: 4.8,
      duration: '8小时',
      views: 15420,
      url: 'https://example.com',
      tags: ['React', 'JavaScript', '前端'],
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      title: 'TypeScript 实战指南',
      description: '深入学习TypeScript语言特性和在实际项目中的应用',
      type: 'document',
      category: '编程语言',
      difficulty: 'advanced',
      rating: 4.6,
      views: 8930,
      url: 'https://example.com',
      tags: ['TypeScript', 'JavaScript'],
      dateAdded: '2024-01-12'
    },
    {
      id: '3',
      title: '数据结构与算法基础',
      description: '计算机科学基础课程，覆盖常见数据结构和算法',
      type: 'course',
      category: '计算机基础',
      difficulty: 'beginner',
      rating: 4.9,
      duration: '12小时',
      views: 23410,
      url: 'https://example.com',
      tags: ['算法', '数据结构', '基础'],
      dateAdded: '2024-01-10'
    },
    {
      id: '4',
      title: 'Node.js 后端开发实践',
      description: '学习使用Node.js构建现代Web应用的后端服务',
      type: 'video',
      category: '后端开发',
      difficulty: 'intermediate',
      rating: 4.7,
      duration: '6小时',
      views: 12350,
      url: 'https://example.com',
      tags: ['Node.js', 'JavaScript', '后端'],
      dateAdded: '2024-01-08'
    },
    {
      id: '5',
      title: 'UI/UX 设计原则与实践',
      description: '用户界面和用户体验设计的基本原则和实际应用',
      type: 'article',
      category: '设计',
      difficulty: 'beginner',
      rating: 4.4,
      views: 7650,
      url: 'https://example.com',
      tags: ['UI', 'UX', '设计'],
      dateAdded: '2024-01-05'
    }
  ])

  const categories = ['all', '前端开发', '后端开发', '编程语言', '计算机基础', '设计']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'course': return <BookOpen className="h-5 w-5" />
      case 'article': return <FileText className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-700'
      case 'document': return 'bg-blue-100 text-blue-700'
      case 'course': return 'bg-green-100 text-green-700'
      case 'article': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级'
      case 'intermediate': return '中级'
      case 'advanced': return '高级'
      default: return difficulty
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">学习资源</h1>
        <p className="text-gray-600 mt-1">发现优质的学习材料和课程</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有分类</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有难度</option>
              {difficulties.slice(1).map(difficulty => (
                <option key={difficulty} value={difficulty}>{getDifficultyText(difficulty)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        找到 {filteredResources.length} 个资源
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{resource.description}</p>
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{resource.views.toLocaleString()} 浏览</span>
                  </div>
                  {resource.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{resource.duration}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {getDifficultyText(resource.difficulty)}
                  </span>
                  <span className="text-xs text-gray-500">{resource.category}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <ExternalLink className="h-4 w-4" />
                  <span>查看资源</span>
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关资源</h3>
          <p className="text-gray-600">尝试调整搜索条件或浏览所有资源</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  )
}