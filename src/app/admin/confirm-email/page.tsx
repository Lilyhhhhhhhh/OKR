'use client'

import { useState } from 'react'

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmEmail = async () => {
    if (!email) {
      setStatus('请输入邮箱地址')
      return
    }

    setIsLoading(true)
    setStatus('处理中...')

    try {
      const response = await fetch('/api/admin/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus(`成功：${result.message}`)
      } else {
        setStatus(`错误：${result.error}`)
      }
    } catch (error) {
      console.error('确认邮箱失败:', error)
      setStatus('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">邮箱确认工具</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入需要确认的邮箱"
          />
        </div>

        <button
          onClick={handleConfirmEmail}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '处理中...' : '确认邮箱'}
        </button>

        {status && (
          <div className={`mt-4 p-3 rounded-md ${
            status.startsWith('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status}
          </div>
        )}
      </div>
    </div>
  )
}