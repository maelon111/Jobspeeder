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
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone: string | null
          location: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cvs: {
        Row: {
          id: string
          user_id: string
          name: string
          content_json: Json
          is_active: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          content_json: Json
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          content_json?: Json
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_preferences: {
        Row: {
          id: string
          user_id: string
          job_title: string | null
          location: string | null
          contract_types: string[]
          work_time: string | null
          work_mode: string | null
          salary_min: number | null
          salary_max: number | null
          is_active: boolean
          n8n_webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_title?: string | null
          location?: string | null
          contract_types?: string[]
          work_time?: string | null
          work_mode?: string | null
          salary_min?: number | null
          salary_max?: number | null
          is_active?: boolean
          n8n_webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_title?: string | null
          location?: string | null
          contract_types?: string[]
          work_time?: string | null
          work_mode?: string | null
          salary_min?: number | null
          salary_max?: number | null
          is_active?: boolean
          n8n_webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          id: string
          user_id: string
          company: string
          job_title: string
          job_url: string | null
          applied_via: 'email' | 'skyvern' | 'manual'
          status: 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected'
          applied_at: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          job_title: string
          job_url?: string | null
          applied_via?: 'email' | 'skyvern' | 'manual'
          status?: 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected'
          applied_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          job_title?: string
          job_url?: string | null
          applied_via?: 'email' | 'skyvern' | 'manual'
          status?: 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected'
          applied_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CV = Database['public']['Tables']['cvs']['Row']
export type JobPreferences = Database['public']['Tables']['job_preferences']['Row']
export type Application = Database['public']['Tables']['applications']['Row']

export type ApplicationStatus = Application['status']
export type AppliedVia = Application['applied_via']

export interface CVContent {
  summary?: string
  experience: Array<{
    title: string
    company: string
    location?: string
    start_date: string
    end_date?: string
    current?: boolean
    bullets: string[]
  }>
  education: Array<{
    degree: string
    school: string
    location?: string
    graduation_year: string
    gpa?: string
  }>
  skills: string[]
  languages: Array<{
    language: string
    level: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
  }>
}
