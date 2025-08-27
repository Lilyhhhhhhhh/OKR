// Database type definitions for Supabase (Pages Router Compatible)
export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          full_name: string
          student_id: string | null
          grade: string | null
          major: string | null
          class_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          student_id?: string | null
          grade?: string | null
          major?: string | null
          class_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          student_id?: string | null
          grade?: string | null
          major?: string | null
          class_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      objectives: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          category: string | null
          priority: string
          status: string
          target_date: string | null
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          category?: string | null
          priority?: string
          status?: string
          target_date?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          description?: string | null
          category?: string | null
          priority?: string
          status?: string
          target_date?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      key_results: {
        Row: {
          id: string
          objective_id: string
          title: string
          description: string | null
          metric_type: string
          target_value: number | null
          current_value: number
          progress: number
          status: string
          is_auto_tracked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          objective_id: string
          title: string
          description?: string | null
          metric_type?: string
          target_value?: number | null
          current_value?: number
          progress?: number
          status?: string
          is_auto_tracked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          objective_id?: string
          title?: string
          description?: string | null
          metric_type?: string
          target_value?: number | null
          current_value?: number
          progress?: number
          status?: string
          is_auto_tracked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          student_id: string
          title: string | null
          session_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title?: string | null
          session_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string | null
          session_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          sender_type: 'user' | 'ai'
          content: string
          message_type: string
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          sender_type: 'user' | 'ai'
          content: string
          message_type?: string
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          sender_type?: 'user' | 'ai'
          content?: string
          message_type?: string
          metadata?: any | null
          created_at?: string
        }
      }
      knowledge_documents: {
        Row: {
          id: string
          title: string
          file_name: string | null
          file_type: string | null
          file_size: number | null
          file_url: string | null
          content: string | null
          category: string | null
          tags: string[] | null
          is_processed: boolean
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          file_url?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          is_processed?: boolean
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          file_url?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          is_processed?: boolean
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_logs: {
        Row: {
          id: string
          key_result_id: string
          previous_value: number | null
          new_value: number
          progress_change: number | null
          update_type: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          key_result_id: string
          previous_value?: number | null
          new_value: number
          progress_change?: number | null
          update_type?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          key_result_id?: string
          previous_value?: number | null
          new_value?: number
          progress_change?: number | null
          update_type?: string
          note?: string | null
          created_at?: string
        }
      }
      learning_activities: {
        Row: {
          id: string
          student_id: string
          activity_type: string
          activity_name: string | null
          description: string | null
          duration_minutes: number | null
          score: number | null
          metadata: any | null
          related_objective_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          activity_type: string
          activity_name?: string | null
          description?: string | null
          duration_minutes?: number | null
          score?: number | null
          metadata?: any | null
          related_objective_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          activity_type?: string
          activity_name?: string | null
          description?: string | null
          duration_minutes?: number | null
          score?: number | null
          metadata?: any | null
          related_objective_id?: string | null
          created_at?: string
        }
      }
      student_settings: {
        Row: {
          id: string
          student_id: string
          setting_key: string
          setting_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          setting_key: string
          setting_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          setting_key?: string
          setting_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 便捷类型导出
export type Student = Database['public']['Tables']['students']['Row']
export type Objective = Database['public']['Tables']['objectives']['Row']
export type KeyResult = Database['public']['Tables']['key_results']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type KnowledgeDocument = Database['public']['Tables']['knowledge_documents']['Row']
export type ProgressLog = Database['public']['Tables']['progress_logs']['Row']
export type LearningActivity = Database['public']['Tables']['learning_activities']['Row']

// OKR相关的复合类型
export type ObjectiveWithKeyResults = Objective & {
  key_results: KeyResult[]
}

export type ChatMessageWithSender = ChatMessage & {
  sender?: Student
}