'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Info, Download, Filter, TrendingUp, Users, Target, Book, Clock } from 'lucide-react'

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // 学生表现数据
  const performanceData = [
    { name: '优秀', value: 25, color: '#4ade80' },
    { name: '良好', value: 40, color: '#60a5fa' },
    { name: '一般', value: 25, color: '#facc15' },
    { name: '需要关注', value: 10, color: '#f87171' },
  ]

  // 学习时间分布数据
  const timeDistributionData = [
    { name: '上午', hours: 3.5 },
    { name: '下午', hours: 2.8 },
    { name: '晚上', hours: 4.2 },
    { name: '深夜', hours: 0.9 },
  ]

  // 课程参与度数据
  const engagementData = [
    { name: 'Web前端开发', 作业完成率: 92, 课堂参与度: 85, 讨论活跃度: 78 },
    { name: '数据结构', 作业完成率: 88, 课堂参与度: 75, 讨论活跃度: 65 },
    { name: '计算机网络', 作业完成率: 95, 课堂参与度: 90, 讨论活跃度: 82 },
    { name: '数据库系统', 作业完成率: 85, 课堂参与度: 80, 讨论活跃度: 70 },
    { name: '软件工程', 作业完成率: 90, 课堂参与度: 85, 讨论活跃度: 75 },
  ]

  // OKR完成趋势数据
  const okrTrendData = [
    { month: '1月', 完成率: 65 },
    { month: '2月', 完成率: 68 },
    { month: '3月', 完成率: 75 },
    { month: '4月', 完成率: 80 },
    { month: '5月', 完成率: 85 },
    { month: '6月', 完成率: 87 },
  ]

  // 学习资源使用情况
  const resourceUsageData = [
    { name: '视频教程', value: 35, color: '#60a5fa' },
    { name: '在线文档', value: 25, color: '#34d399' },
    { name: '练习题', value: 20, color: '#a78bfa' },
    { name: '讨论区', value: 15, color: '#fbbf24' },
    { name: '其他', value: 5, color: '#94a3b8' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 教学洞察</h1>
        <p className="text-gray-600 mt-1">基于AI分析的教学数据洞察和建议</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              总览
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              学生表现
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              课程分析
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              资源利用
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">平均学习时长</p>
                      <p className="text-2xl font-bold text-gray-900">4.2 小时/天</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">平均OKR完成率</p>
                      <p className="text-2xl font-bold text-green-600">78%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">活跃学生比例</p>
                      <p className="text-2xl font-bold text-purple-600">85%</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">学习进度</p>
                      <p className="text-2xl font-bold text-orange-600">+12%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OKR Trend Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">OKR完成趋势</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={okrTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="完成率" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Student Performance Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">学生表现分布</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">AI 教学建议</h3>
                  <div className="text-xs text-gray-500">基于最近30天数据</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">学习时间优化</h4>
                    <p className="text-sm text-blue-700">
                      数据显示学生在晚上的学习效率最高，建议增加晚间在线答疑时间，并提供更多晚间学习资源。
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">课程难度调整</h4>
                    <p className="text-sm text-green-700">
                      "数据结构"课程的完成率低于平均水平，建议重新评估课程难度，可能需要增加基础知识讲解或提供更多练习题。
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">学习资源推荐</h4>
                    <p className="text-sm text-purple-700">
                      视频教程是最受欢迎的学习资源，建议为更多课程制作视频内容，特别是实操演示类内容。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Performance Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">学生表现分布</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Learning Time Distribution */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">学习时间分布</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" name="平均学习时长(小时)" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Student Insights */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">学生学习洞察</h3>
                  <div className="text-xs text-gray-500">基于最近30天数据</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">学习习惯分析</h4>
                    <p className="text-sm text-blue-700">
                      数据显示大多数学生倾向于在晚上学习，平均学习时长为4.2小时/天。建议在晚间提供更多在线支持资源。
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <h4 className="font-medium text-yellow-800 mb-2">需要关注的学生群体</h4>
                    <p className="text-sm text-yellow-700">
                      约10%的学生表现需要特别关注，他们的OKR完成率低于50%，建议安排一对一辅导或提供额外学习资源。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Course Engagement Chart */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">课程参与度分析</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <Filter className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="作业完成率" fill="#60a5fa" />
                      <Bar dataKey="课堂参与度" fill="#34d399" />
                      <Bar dataKey="讨论活跃度" fill="#a78bfa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Course Insights */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">课程洞察</h3>
                  <div className="text-xs text-gray-500">基于最近30天数据</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">最受欢迎课程</h4>
                    <p className="text-sm text-green-700">
                      "计算机网络"课程在各项指标上表现最佳，特别是作业完成率达到95%。建议分析该课程的教学方法和内容组织，应用到其他课程中。
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <h4 className="font-medium text-yellow-800 mb-2">需要改进的课程</h4>
                    <p className="text-sm text-yellow-700">
                      "数据结构"课程的讨论活跃度较低(65%)，建议增加互动环节，如小组讨论、案例分析等，提高学生参与度。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              {/* Resource Usage Chart */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">学习资源使用情况</h3>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resource Insights */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">资源利用洞察</h3>
                  <div className="text-xs text-gray-500">基于最近30天数据</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">资源偏好</h4>
                    <p className="text-sm text-blue-700">
                      视频教程是最受欢迎的学习资源(35%)，其次是在线文档(25%)。建议增加视频教程的制作，特别是针对复杂概念的可视化讲解。
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">资源优化建议</h4>
                    <p className="text-sm text-purple-700">
                      讨论区使用率较低(15%)，但对学习效果有显著提升。建议改进讨论区设计，增加教师参与度，设置讨论话题和奖励机制。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}