'use client'

import { useState } from 'react'
import { User, Mail, Phone, School, Save, Camera } from 'lucide-react'

export default function SettingsPage() {
  // 模拟用户数据
  const [userData, setUserData] = useState({
    name: '张教授',
    email: 'zhang.professor@university.edu',
    phone: '138****1234',
    department: '计算机科学与技术学院',
    title: '副教授',
    office: '科技楼 A-305',
    officeHours: '周一、周三 14:00-16:00',
    researchInterests: '人工智能, 教育科技, 数据挖掘',
    bio: '张教授拥有计算机科学博士学位，专注于教育科技领域研究。曾主持多项国家级科研项目，发表学术论文30余篇。'
  })

  // 模拟通知设置
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    studentSubmissions: true,
    okrUpdates: true,
    systemAnnouncements: true,
    weeklyReports: false
  })

  // 模拟隐私设置
  const [privacy, setPrivacy] = useState({
    showEmail: true,
    showPhone: false,
    publicProfile: true,
    shareAnalytics: true
  })

  // 处理个人信息表单提交
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('个人信息已更新')
  }

  // 处理通知设置变更
  const handleNotificationChange = (setting: string) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting as keyof typeof notifications]
    })
  }

  // 处理隐私设置变更
  const handlePrivacyChange = (setting: string) => {
    setPrivacy({
      ...privacy,
      [setting]: !privacy[setting as keyof typeof privacy]
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600 mt-1">管理您的账户设置和偏好</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{userData.name}</h3>
              <p className="text-sm text-gray-500">{userData.title}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <a
                href="#profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700"
              >
                <User className="mr-3 h-5 w-5" />
                个人信息
              </a>
              <a
                href="#notifications"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Mail className="mr-3 h-5 w-5" />
                通知设置
              </a>
              <a
                href="#privacy"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <School className="mr-3 h-5 w-5" />
                隐私设置
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <section id="profile" className="bg-white shadow-sm rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">个人信息</h2>
              <p className="mt-1 text-sm text-gray-500">更新您的个人信息和联系方式</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      邮箱
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      电话
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      院系
                    </label>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={userData.department}
                      onChange={(e) => setUserData({...userData, department: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      职称
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={userData.title}
                      onChange={(e) => setUserData({...userData, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                      办公室
                    </label>
                    <input
                      type="text"
                      name="office"
                      id="office"
                      value={userData.office}
                      onChange={(e) => setUserData({...userData, office: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="officeHours" className="block text-sm font-medium text-gray-700">
                    办公时间
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    id="officeHours"
                    value={userData.officeHours}
                    onChange={(e) => setUserData({...userData, officeHours: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="researchInterests" className="block text-sm font-medium text-gray-700">
                    研究方向
                  </label>
                  <input
                    type="text"
                    name="researchInterests"
                    id="researchInterests"
                    value={userData.researchInterests}
                    onChange={(e) => setUserData({...userData, researchInterests: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    个人简介
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={3}
                    value={userData.bio}
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    保存更改
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="bg-white shadow-sm rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">通知设置</h2>
              <p className="mt-1 text-sm text-gray-500">配置您希望接收的通知类型和方式</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">通知渠道</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">电子邮件</label>
                      <p className="text-gray-500">通过电子邮件接收通知</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sms-notifications"
                        name="sms-notifications"
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sms-notifications" className="font-medium text-gray-700">短信</label>
                      <p className="text-gray-500">通过短信接收通知</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-notifications"
                        name="push-notifications"
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-notifications" className="font-medium text-gray-700">推送通知</label>
                      <p className="text-gray-500">通过应用推送接收通知</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">通知类型</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="student-submissions"
                        name="student-submissions"
                        type="checkbox"
                        checked={notifications.studentSubmissions}
                        onChange={() => handleNotificationChange('studentSubmissions')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="student-submissions" className="font-medium text-gray-700">学生提交</label>
                      <p className="text-gray-500">当学生提交作业或项目时通知我</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="okr-updates"
                        name="okr-updates"
                        type="checkbox"
                        checked={notifications.okrUpdates}
                        onChange={() => handleNotificationChange('okrUpdates')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="okr-updates" className="font-medium text-gray-700">OKR更新</label>
                      <p className="text-gray-500">当课程OKR有更新时通知我</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="system-announcements"
                        name="system-announcements"
                        type="checkbox"
                        checked={notifications.systemAnnouncements}
                        onChange={() => handleNotificationChange('systemAnnouncements')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="system-announcements" className="font-medium text-gray-700">系统公告</label>
                      <p className="text-gray-500">接收系统更新和重要公告</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="weekly-reports"
                        name="weekly-reports"
                        type="checkbox"
                        checked={notifications.weeklyReports}
                        onChange={() => handleNotificationChange('weeklyReports')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="weekly-reports" className="font-medium text-gray-700">周报</label>
                      <p className="text-gray-500">每周接收学生进度和课程数据摘要</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => alert('通知设置已保存')}
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section id="privacy" className="bg-white shadow-sm rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">隐私设置</h2>
              <p className="mt-1 text-sm text-gray-500">管理您的个人信息可见性和数据共享偏好</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="show-email"
                      name="show-email"
                      type="checkbox"
                      checked={privacy.showEmail}
                      onChange={() => handlePrivacyChange('showEmail')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="show-email" className="font-medium text-gray-700">显示邮箱</label>
                    <p className="text-gray-500">允许学生查看您的电子邮件地址</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="show-phone"
                      name="show-phone"
                      type="checkbox"
                      checked={privacy.showPhone}
                      onChange={() => handlePrivacyChange('showPhone')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="show-phone" className="font-medium text-gray-700">显示电话</label>
                    <p className="text-gray-500">允许学生查看您的电话号码</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="public-profile"
                      name="public-profile"
                      type="checkbox"
                      checked={privacy.publicProfile}
                      onChange={() => handlePrivacyChange('publicProfile')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="public-profile" className="font-medium text-gray-700">公开个人资料</label>
                    <p className="text-gray-500">允许您的个人资料在系统中公开可见</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="share-analytics"
                      name="share-analytics"
                      type="checkbox"
                      checked={privacy.shareAnalytics}
                      onChange={() => handlePrivacyChange('shareAnalytics')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="share-analytics" className="font-medium text-gray-700">共享分析数据</label>
                    <p className="text-gray-500">允许系统收集和分析您的教学数据，用于改进服务</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => alert('隐私设置已保存')}
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}