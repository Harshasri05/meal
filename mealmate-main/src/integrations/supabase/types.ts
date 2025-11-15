export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'admin' | 'canteen_staff' | 'ngo_manager'
export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type PortionSize = 'small' | 'medium' | 'large'
export type ConfirmationStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: UserRole
          eco_points: number
          hostel_block: string | null
          room_number: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: UserRole
          eco_points?: number
          hostel_block?: string | null
          room_number?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: UserRole
          eco_points?: number
          hostel_block?: string | null
          room_number?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          name: string
          category: MealCategory
          description: string | null
          image_url: string | null
          base_price: number
          nutritional_info: Json | null
          allergens: string[] | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: MealCategory
          description?: string | null
          image_url?: string | null
          base_price?: number
          nutritional_info?: Json | null
          allergens?: string[] | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: MealCategory
          description?: string | null
          image_url?: string | null
          base_price?: number
          nutritional_info?: Json | null
          allergens?: string[] | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_schedules: {
        Row: {
          id: string
          meal_id: string
          scheduled_date: string
          meal_type: MealCategory
          small_portions_available: number
          medium_portions_available: number
          large_portions_available: number
          confirmation_deadline: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          scheduled_date: string
          meal_type: MealCategory
          small_portions_available?: number
          medium_portions_available?: number
          large_portions_available?: number
          confirmation_deadline: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_id?: string
          scheduled_date?: string
          meal_type?: MealCategory
          small_portions_available?: number
          medium_portions_available?: number
          large_portions_available?: number
          confirmation_deadline?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      meal_confirmations: {
        Row: {
          id: string
          user_id: string
          schedule_id: string
          portion_size: PortionSize
          confirmed_at: string
          status: ConfirmationStatus
          eco_points_earned: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id: string
          portion_size?: PortionSize
          confirmed_at?: string
          status?: ConfirmationStatus
          eco_points_earned?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string
          portion_size?: PortionSize
          confirmed_at?: string
          status?: ConfirmationStatus
          eco_points_earned?: number
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          meal_id: string
          schedule_id: string | null
          rating: number
          comment: string | null
          reasons: string[] | null
          eco_points_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_id: string
          schedule_id?: string | null
          rating: number
          comment?: string | null
          reasons?: string[] | null
          eco_points_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_id?: string
          schedule_id?: string | null
          rating?: number
          comment?: string | null
          reasons?: string[] | null
          eco_points_earned?: number
          created_at?: string
        }
      }
      waste_logs: {
        Row: {
          id: string
          schedule_id: string
          weight_kg: number
          logged_by: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          schedule_id: string
          weight_kg: number
          logged_by: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string
          weight_kg?: number
          logged_by?: string
          notes?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: string
          old_data: Json | null
          new_data: Json | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: string
          old_data?: Json | null
          new_data?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          user_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_meal_stats: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          meal_type: MealCategory
          total_confirmations: number
          small_count: number
          medium_count: number
          large_count: number
          avg_rating: number
        }[]
      }
      get_waste_trends: {
        Args: {
          days?: number
        }
        Returns: {
          date: string
          total_waste: number
          meal_type: MealCategory
        }[]
      }
      get_top_eco_warriors: {
        Args: {
          limit_count?: number
        }
        Returns: {
          user_id: string
          full_name: string
          eco_points: number
          total_confirmations: number
          small_portion_count: number
        }[]
      }
      send_notification: {
        Args: {
          target_user_id: string
          notif_type: string
          notif_title: string
          notif_message: string
          notif_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      meal_category: MealCategory
      portion_size: PortionSize
      confirmation_status: ConfirmationStatus
    }
  }
}
