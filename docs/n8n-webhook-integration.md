# n8n Webhook 集成配置指南

## 概述

本文档描述如何配置n8n工作流来处理知识库问答请求。

## n8n 工作流配置

### 1. Webhook节点配置

**节点名称:** `知识库问答接收器`
**HTTP方法:** POST
**路径:** `/webhook/knowledge-qa`
**响应模式:** 立即响应

**预期请求格式:**
```json
{
  "question": "用户的问题",
  "user_id": "UUID",
  "session_id": "UUID",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Information Extractor节点配置

**节点名称:** `问题预处理器`
**功能:** 提取和清理用户问题
**配置:**
- 移除特殊字符
- 提取关键词
- 分类问题类型

**输出格式:**
```json
{
  "cleaned_question": "清理后的问题",
  "keywords": ["关键词1", "关键词2"],
  "question_type": "technical|general|specific",
  "confidence": 0.85
}
```

### 3. Basic LLM Chain节点配置

**节点名称:** `AI回答生成器`
**LLM提供商:** OpenAI/其他
**模型:** gpt-3.5-turbo或gpt-4

**System Prompt:**
```
你是一个专业的技术学习助手，专注于回答编程、数据库、算法等技术问题。

请根据用户的问题提供准确、详细的回答。如果涉及代码示例，请提供清晰的代码片段。

回答要求：
1. 准确性：确保技术信息正确
2. 完整性：提供全面的解释
3. 实用性：包含实际应用示例
4. 可读性：使用清晰的结构和格式

如果问题超出你的知识范围，请诚实说明并建议替代资源。
```

**输出格式:**
```json
{
  "answer": "AI生成的回答",
  "confidence": 0.92,
  "related_topics": ["相关话题1", "相关话题2"],
  "sources": ["参考来源1", "参考来源2"]
}
```

### 4. 响应节点配置

**节点名称:** `格式化响应`
**功能:** 格式化最终响应

**响应格式:**
```json
{
  "success": true,
  "answer": "AI生成的完整回答",
  "confidence": 0.92,
  "processing_time": 1500,
  "related_knowledge_ids": ["uuid1", "uuid2"],
  "related_knowledge": [
    {
      "id": "uuid1",
      "title": "相关知识点1",
      "snippet": "相关内容摘要"
    }
  ]
}
```

## 环境变量配置

在n8n中设置以下环境变量：

```bash
# OpenAI配置
OPENAI_API_KEY=your-openai-api-key

# Supabase配置（用于查询知识库）
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# 其他配置
MAX_RESPONSE_TIME=30000  # 30秒超时
DEFAULT_CONFIDENCE=0.5   # 默认置信度
```

## 工作流示例

### 完整的n8n工作流结构：

1. **Webhook节点** → 接收POST请求
2. **Set节点** → 提取和验证输入数据
3. **IF节点** → 检查问题是否为空
4. **HTTP Request节点** → 查询Supabase知识库
5. **Function节点** → 处理知识库结果
6. **OpenAI节点** → 生成AI回答
7. **Function节点** → 格式化最终响应
8. **Webhook Response节点** → 返回结果

### 错误处理

添加错误处理节点来处理：
- API调用失败
- 超时情况
- 无效输入
- 知识库查询错误

**错误响应格式:**
```json
{
  "success": false,
  "error": "错误描述",
  "answer": "抱歉，我现在无法回答这个问题，请稍后再试。",
  "confidence": 0.0
}
```

## 测试

### 使用curl测试webhook：

```bash
curl -X POST http://localhost:5678/webhook/knowledge-qa \
  -H "Content-Type: application/json" \
  -d '{
    "question": "什么是React Hooks？",
    "user_id": "test-user-123",
    "session_id": "test-session-456",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }'
```

### 预期响应：

```json
{
  "success": true,
  "answer": "React Hooks是React 16.8版本引入的新特性...",
  "confidence": 0.95,
  "processing_time": 1200,
  "related_knowledge_ids": [],
  "related_knowledge": []
}
```

## 部署建议

1. **安全性：** 添加API密钥验证
2. **性能：** 设置合适的超时时间
3. **监控：** 添加日志记录节点
4. **缓存：** 对常见问题使用缓存机制
5. **限流：** 防止API滥用

## 故障排除

### 常见问题：

1. **Webhook无响应**
   - 检查n8n服务是否运行
   - 验证webhook URL是否正确
   - 检查防火墙设置

2. **AI回答质量差**
   - 优化system prompt
   - 调整模型参数
   - 改进知识库查询逻辑

3. **响应时间长**
   - 检查网络延迟
   - 优化知识库查询
   - 考虑使用更快的AI模型

## 监控与日志

添加以下监控指标：
- 请求响应时间
- 成功率
- 错误类型统计
- 用户满意度反馈