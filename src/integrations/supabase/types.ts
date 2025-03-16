export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          doctor_id: string
          hospital_id: string
          id: string
          patient_id: string | null
          payment_amount: number
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          scheduled_time: string
          status: string | null
          token_number: number
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          doctor_id: string
          hospital_id: string
          id?: string
          patient_id?: string | null
          payment_amount: number
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          scheduled_time: string
          status?: string | null
          token_number: number
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          doctor_id?: string
          hospital_id?: string
          id?: string
          patient_id?: string | null
          payment_amount?: number
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          scheduled_time?: string
          status?: string | null
          token_number?: number
        }
        Relationships: []
      }
      facility_doctors: {
        Row: {
          availability: string[] | null
          contact: string | null
          created_at: string | null
          facility_id: string | null
          id: string
          name: string
          specialization: string | null
        }
        Insert: {
          availability?: string[] | null
          contact?: string | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          name: string
          specialization?: string | null
        }
        Update: {
          availability?: string[] | null
          contact?: string | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          name?: string
          specialization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_doctors_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "healthcare_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          is_published: boolean
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          title?: string
        }
        Relationships: []
      }
      healthcare_facilities: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string | null
          district: string | null
          id: string
          image_urls: string[] | null
          latitude: number
          longitude: number
          name: string
          osm_id: string | null
          rating: number | null
          services: string[] | null
          state: string | null
          type: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          image_urls?: string[] | null
          latitude: number
          longitude: number
          name: string
          osm_id?: string | null
          rating?: number | null
          services?: string[] | null
          state?: string | null
          type: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          image_urls?: string[] | null
          latitude?: number
          longitude?: number
          name?: string
          osm_id?: string | null
          rating?: number | null
          services?: string[] | null
          state?: string | null
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      hospitals_data: {
        Row: {
          address: string
          category: string | null
          contact: string
          created_at: string
          created_by: string | null
          district: string
          doctors: Json[] | null
          emergency: boolean | null
          id: string
          image: string | null
          name: string
          rating: number | null
          services: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          category?: string | null
          contact: string
          created_at?: string
          created_by?: string | null
          district: string
          doctors?: Json[] | null
          emergency?: boolean | null
          id?: string
          image?: string | null
          name: string
          rating?: number | null
          services?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          category?: string | null
          contact?: string
          created_at?: string
          created_by?: string | null
          district?: string
          doctors?: Json[] | null
          emergency?: boolean | null
          id?: string
          image?: string | null
          name?: string
          rating?: number | null
          services?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      medical_loans: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          employment_status: string
          id: string
          interest_rate: number | null
          lender_name: string | null
          loan_amount: number
          loan_purpose: string
          loan_status: string | null
          monthly_income: number
          patient_id: string | null
          tenure_months: number | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          employment_status: string
          id?: string
          interest_rate?: number | null
          lender_name?: string | null
          loan_amount: number
          loan_purpose: string
          loan_status?: string | null
          monthly_income: number
          patient_id?: string | null
          tenure_months?: number | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          employment_status?: string
          id?: string
          interest_rate?: number | null
          lender_name?: string | null
          loan_amount?: number
          loan_purpose?: string
          loan_status?: string | null
          monthly_income?: number
          patient_id?: string | null
          tenure_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_loans_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_attempts: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          last_attempt: string | null
          phone: string
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_attempt?: string | null
          phone: string
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_attempt?: string | null
          phone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_user_id_by_email: {
        Args: {
          email_input: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
