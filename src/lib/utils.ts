import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatProgress(current: number, target: number): string {
  const percentage = Math.round((current / target) * 100)
  return `${percentage}%`
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 60) return 'text-yellow-600'
  if (progress >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}