'use client'

import { useState } from 'react'
import { Star, Brain, Target, TrendingUp, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: Target,
      title: 'OKR目标管理',
      description: '智能设定与追踪个人学习目标，让每一步成长都有迹可循'
    },
    {
      icon: Brain,
      title: 'AI学习伴侣',
      description: '24/7专属AI导师，提供个性化学习计划和实时障碍诊断'
    },
    {
      icon: TrendingUp,
      title: '成长画像',
      description: '多维度数据分析，全方位了解自己的学习进度和能力发展'
    },
    {
      icon: Users,
      title: '协作学习',
      description: '连接同窗好友，共同进步，分享知识与经验'
    },
    {
      icon: BookOpen,
      title: '智能资源推荐',
      description: '基于学习需求，推荐最适合的学习资源和材料'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">启明星</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              功能特色
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              关于平台
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white transition-colors">
              立即登录
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-float">
            AI赋能的
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              智慧教育
            </span>
            平台
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            为河北师范大学软件学院打造的个性化学习成长平台
            <br />
            让每位学生都拥有专属的AI导师和学习伴侣
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              开始我的学习之旅
            </Link>
            <Link 
              href="#features" 
              className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all"
            >
              了解更多功能
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">核心功能特色</h2>
          <p className="text-xl text-gray-300">AI驱动的个性化学习体验</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`glass-effect rounded-xl p-8 transition-all duration-300 cursor-pointer ${
                hoveredCard === index ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass-effect rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">活跃学生用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-300">目标完成率提升</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">AI智能辅导</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            准备开始你的AI学习之旅了吗？
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            加入启明星平台，让AI成为你学习路上的最佳伙伴
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 rounded-lg text-white font-semibold text-xl transition-all transform hover:scale-105"
          >
            立即加入启明星
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-semibold text-white">启明星平台</span>
          </div>
          <p className="text-gray-400">
            © 2024 河北师范大学软件学院 · AI智慧教育平台
          </p>
        </div>
      </footer>
    </div>
  )
}