'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">页面未找到</h1>
        <p className="text-lg text-gray-600 mb-8">
          很抱歉，您访问的页面不存在或已被移动。请检查URL是否正确，或返回首页继续浏览。
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回上一页
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速导航</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/student"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">学生端</span>
              </div>
            </Link>
            <Link
              href="/teacher"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <HelpCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">教师端</span>
              </div>
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Home className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">管理端</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          <p>如果问题持续存在，请联系系统管理员</p>
          <p className="mt-1">错误代码：404 - Page Not Found</p>
        </div>
      </div>
    </div>
  )
}