export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          category_id: string | null
          title: string
          description: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          time_limit: number | null
          passing_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          description?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          time_limit?: number | null
          passing_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          description?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          time_limit?: number | null
          passing_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          explanation: string | null
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          explanation?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          explanation?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          question_id: string
          selected_option_id: string | null
          is_correct: boolean
          time_spent: number | null
          completed: boolean
          score: number | null
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          question_id: string
          selected_option_id?: string | null
          is_correct?: boolean
          time_spent?: number | null
          completed?: boolean
          score?: number | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          question_id?: string
          selected_option_id?: string | null
          is_correct?: boolean
          time_spent?: number | null
          completed?: boolean
          score?: number | null
          started_at?: string
          completed_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
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
