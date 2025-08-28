# OKR项目 TypeScript 类型系统文档

## 概述

本项目已建立了完整的TypeScript类型系统，涵盖了数据库模型、API接口、React组件等所有层面的类型定义。

## 类型文件结构

```
src/types/
├── index.ts          # 全局类型导出和工具类型
├── database.ts       # Supabase数据库类型定义
├── api.ts           # API接口和响应类型
└── components.ts    # React组件和Context类型
```

## 主要类型定义

### 1. 数据库类型 (`database.ts`)

定义了所有Supabase表的类型：
- `Student` - 学生信息
- `Objective` - OKR目标
- `KeyResult` - 关键结果
- `ChatSession` - 聊天会话
- `ChatMessage` - 聊天消息
- `ProgressLog` - 进度日志
- `LearningActivity` - 学习活动

### 2. API类型 (`api.ts`)

包含API请求和响应的类型：
- `ApiResponse<T>` - 统一API响应格式
- `StudentProfileData` - 学生档案数据
- `ObjectiveCreateData` - 创建目标数据
- `ProgressUpdateData` - 进度更新数据
- `ChatMessageData` - 聊天消息数据

### 3. 组件类型 (`components.ts`)

React组件相关类型：
- `AuthContextType` - 认证上下文类型
- `ButtonProps` - 按钮组件属性
- `ModalProps` - 弹窗组件属性
- `TableProps` - 表格组件属性

### 4. 通用类型 (`index.ts`)

工具类型和常用定义：
- `Optional<T, K>` - 可选字段工具类型
- `AsyncState<T>` - 异步状态类型
- `QueryOptions` - 查询选项类型
- `ValidationRule` - 表单验证规则

## 使用示例

### API服务类型使用

```typescript
import { ApiService } from '@/lib/api'
import { StudentProfileData } from '@/types/api'

const apiService = new ApiService()

// 类型安全的API调用
const updateProfile = async (data: StudentProfileData) => {
  const response = await apiService.updateStudentProfile(data)
  if (response.success && response.data) {
    // response.data 自动推断为 Student 类型
    console.log(response.data.full_name)
  }
}
```

### 组件中的类型使用

```typescript
import { AuthContextType } from '@/types/components'
import { Student } from '@/types/database'

interface ProfileComponentProps {
  student: Student | null
  onUpdate: (data: StudentProfileData) => void
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ 
  student, 
  onUpdate 
}) => {
  // 类型安全的组件实现
}
```

### Context类型使用

```typescript
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

const MyComponent = () => {
  const authContext = useContext(AuthContext)
  // authContext 自动推断为 AuthContextType | undefined
  
  if (authContext) {
    // 类型安全的上下文使用
    const { user, student, signOut } = authContext
  }
}
```

## 类型检查和验证

### 1. 编译时检查

项目配置了严格的TypeScript检查：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  }
}
```

### 2. 运行时验证

使用类型检查脚本验证类型系统：

```bash
# 运行类型检查脚本
npx ts-node src/scripts/type-check.ts
```

### 3. 构建时验证

Next.js构建时会进行完整的类型检查：

```bash
npm run build
```

## 最佳实践

### 1. 类型导入

总是从 `@/types` 导入类型：

```typescript
// ✅ 正确
import { Student, ApiResponse } from '@/types'

// ❌ 错误
import { Student } from '../types/database'
```

### 2. API响应处理

总是检查API响应的类型安全性：

```typescript
const response = await apiService.getStudentProfile()
if (response.success && response.data) {
  // 类型安全的数据访问
  setStudent(response.data)
} else {
  // 错误处理
  console.error(response.error)
}
```

### 3. 组件Props类型

为所有组件定义明确的Props类型：

```typescript
interface ComponentProps {
  title: string
  data: Student[]
  onSelect?: (student: Student) => void
}

const Component: React.FC<ComponentProps> = ({ title, data, onSelect }) => {
  // 实现
}
```

### 4. 状态管理类型

使用预定义的状态类型：

```typescript
import { AsyncState } from '@/types'

const [studentsState, setStudentsState] = useState<AsyncState<Student[]>>({
  loading: false,
  error: null,
  data: null
})
```

## 类型安全特性

1. **编译时错误检查** - 在开发阶段捕获类型错误
2. **智能提示** - IDE提供精确的代码补全
3. **重构安全** - 重命名和修改时的类型安全保障
4. **API契约** - 前后端接口的类型一致性保证
5. **数据库映射** - Supabase表结构的完整类型映射

## 维护和扩展

当添加新功能时，记得：

1. 在相应的类型文件中添加新的类型定义
2. 更新 `src/types/index.ts` 的导出
3. 运行类型检查脚本验证新类型
4. 更新相关的API服务和组件类型

这个类型系统为整个OKR项目提供了完整的类型安全保障，有助于提高代码质量和开发效率。