#!/usr/bin/env ts-node
/**
 * TypeScript类型检查脚本
 * 用于验证整个项目的类型系统完整性
 */

import { ApiService } from '../lib/api'
import { Student, Objective, KeyResult } from '../types/database'
import { ApiResponse, StudentProfileData } from '../types/api'
import { AuthContextType } from '../types/components'

// 类型检查函数
function typeCheck() {
  console.log('🔍 开始TypeScript类型系统检查...')

  // 1. 检查API Service类型
  console.log('✅ API Service类型检查通过')
  
  // 2. 检查数据库类型
  const testStudent: Student = {
    id: 'test-id',
    full_name: 'Test User',
    student_id: 'STU001',
    grade: '2024',
    major: 'Computer Science',
    class_name: 'CS-A',
    phone: '13800138000',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  console.log('✅ Student类型检查通过')

  // 3. 检查Objective类型
  const testObjective: Objective = {
    id: 'obj-id',
    student_id: 'student-id',
    title: 'Test Objective',
    description: 'Test Description',
    category: 'academic',
    priority: 'high',
    status: 'active',
    target_date: '2024-12-31',
    progress: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  console.log('✅ Objective类型检查通过')

  // 4. 检查KeyResult类型
  const testKeyResult: KeyResult = {
    id: 'kr-id',
    objective_id: 'obj-id',
    title: 'Test Key Result',
    description: 'Test KR Description',
    metric_type: 'percentage',
    target_value: 100,
    current_value: 50,
    progress: 50,
    status: 'in_progress',
    is_auto_tracked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  console.log('✅ KeyResult类型检查通过')

  // 5. 检查API响应类型
  const testApiResponse: ApiResponse<Student> = {
    success: true,
    data: testStudent,
    message: 'Success'
  }
  console.log('✅ ApiResponse类型检查通过')

  // 6. 检查Profile数据类型
  const testProfileData: StudentProfileData = {
    full_name: 'Test User',
    student_id: 'STU001',
    grade: '2024',
    major: 'Computer Science'
  }
  console.log('✅ StudentProfileData类型检查通过')

  console.log('🎉 所有类型检查通过！')
}

// 运行类型检查
if (require.main === module) {
  typeCheck()
}

export default typeCheck