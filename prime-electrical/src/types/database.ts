export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cross_sell_events: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          pitch: string
          source_brand: Database["public"]["Enums"]["site_brand"]
          status: Database["public"]["Enums"]["cross_sell_status"]
          target_brand: Database["public"]["Enums"]["site_brand"]
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          pitch: string
          source_brand: Database["public"]["Enums"]["site_brand"]
          status?: Database["public"]["Enums"]["cross_sell_status"]
          target_brand: Database["public"]["Enums"]["site_brand"]
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          pitch?: string
          source_brand?: Database["public"]["Enums"]["site_brand"]
          status?: Database["public"]["Enums"]["cross_sell_status"]
          target_brand?: Database["public"]["Enums"]["site_brand"]
        }
        Relationships: [
          {
            foreignKeyName: "cross_sell_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_notes: string | null
          created_at: string
          customer_id: string | null
          email: string | null
          id: string
          job_management_id: string | null
          lead_status: Database["public"]["Enums"]["lead_status"]
          message: string | null
          name: string
          phone: string | null
          service_type: string | null
          source_site: Database["public"]["Enums"]["site_brand"]
          synced_at: string | null
          updated_at: string
        }
        Insert: {
          ai_notes?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          job_management_id?: string | null
          lead_status?: Database["public"]["Enums"]["lead_status"]
          message?: string | null
          name: string
          phone?: string | null
          service_type?: string | null
          source_site: Database["public"]["Enums"]["site_brand"]
          synced_at?: string | null
          updated_at?: string
        }
        Update: {
          ai_notes?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          job_management_id?: string | null
          lead_status?: Database["public"]["Enums"]["lead_status"]
          message?: string | null
          name?: string
          phone?: string | null
          service_type?: string | null
          source_site?: Database["public"]["Enums"]["site_brand"]
          synced_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cross_sell_status: "triggered" | "accepted" | "declined" | "pending"
      lead_status: "new" | "hot" | "warm" | "cold" | "converted" | "lost"
      site_brand: "prime" | "akf" | "cleanjet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cross_sell_status: ["triggered", "accepted", "declined", "pending"],
      lead_status: ["new", "hot", "warm", "cold", "converted", "lost"],
      site_brand: ["prime", "akf", "cleanjet"],
    },
  },
} as const

// ---------------------------------------------------------------------------
// Convenience aliases — used throughout the codebase
// ---------------------------------------------------------------------------
export type SiteBrand = Database["public"]["Enums"]["site_brand"]
export type LeadStatus = Database["public"]["Enums"]["lead_status"]
export type CrossSellStatus = Database["public"]["Enums"]["cross_sell_status"]

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"]
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"]
export type CrossSellEventRow = Database["public"]["Tables"]["cross_sell_events"]["Row"]
