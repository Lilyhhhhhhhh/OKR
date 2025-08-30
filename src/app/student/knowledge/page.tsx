'use client'

import { useState } from 'react'
import { 
  Brain, 
  BookOpen, 
  Search,
  Filter,
  Star,
  Clock,
  Tag,
  ChevronRight,
  Lightbulb
} from 'lucide-react'

interface KnowledgeItem {
  id: string
  title: string
  category: string
  tags: string[]
  content: string
  lastUpdated: string
  importance: number
  isBookmarked: boolean
}

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'React Hooks Guide',
      category: 'frontend',
      tags: ['React', 'Hooks', 'JavaScript'],
      content: 'React Hooks are a new feature introduced in React 16.8 that allow you to use state and other React features in functional components...',
      lastUpdated: '2 days ago',
      importance: 5,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'TypeScript Advanced Types',
      category: 'programming',
      tags: ['TypeScript', 'Types'],
      content: 'TypeScript advanced types include union types, intersection types, conditional types, and more...',
      lastUpdated: '3 days ago',
      importance: 4,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Binary Tree Traversal',
      category: 'algorithms',
      tags: ['Algorithms', 'Binary Tree', 'Traversal'],
      content: 'Binary tree traversal includes preorder, inorder, and postorder traversal methods...',
      lastUpdated: '5 days ago',
      importance: 5,
      isBookmarked: true
    },
    {
      id: '4',
      title: 'CSS Grid Layout',
      category: 'frontend',
      tags: ['CSS', 'Grid', 'Layout'],
      content: 'CSS Grid is a powerful 2D layout system that makes it easy to handle complex page layouts...',
      lastUpdated: '1 week ago',
      importance: 3,
      isBookmarked: false
    }
  ])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'programming', name: 'Programming Languages' },
    { id: 'algorithms', name: 'Algorithms & Data Structures' },
    { id: 'database', name: 'Database' },
    { id: 'system', name: 'System Design' }
  ]

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600 mt-1">Organize and manage your learning knowledge</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    {item.isBookmarked && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {getCategoryName(item.category)}
                    </span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.lastUpdated}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Content Preview */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {item.content}
              </p>

              {/* Tags */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Importance Rating */}
                <div className="flex items-center space-x-1">
                  {renderStars(item.importance)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No knowledge found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add new knowledge items</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{knowledgeItems.length}</p>
          <p className="text-sm text-gray-600">Total Knowledge</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {knowledgeItems.filter(item => item.isBookmarked).length}
          </p>
          <p className="text-sm text-gray-600">Bookmarked</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
      </div>
    </div>
  )
}