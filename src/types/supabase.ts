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
      contact_submissions: {
        Row: {
          archived: boolean | null
          created_at: string | null
          email: string | null
          id: string
          ip_address: unknown | null
          is_read: boolean | null
          message: string
          name: string | null
          source_page: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          is_read?: boolean | null
          message: string
          name?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          is_read?: boolean | null
          message?: string
          name?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      design_process_steps: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          icon_id: string | null
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          icon_id?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          icon_id?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_design_process_steps_icon_id"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_pages: {
        Row: {
          created_at: string | null
          faq_id: string
          id: string
          page_id: string
        }
        Insert: {
          created_at?: string | null
          faq_id: string
          id?: string
          page_id: string
        }
        Update: {
          created_at?: string | null
          faq_id?: string
          id?: string
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_pages_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faq_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: Json
          created_at: string | null
          faq_category_id: string | null
          featured: boolean | null
          id: string
          question: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          answer: Json
          created_at?: string | null
          faq_category_id?: string | null
          featured?: boolean | null
          id?: string
          question: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          answer?: Json
          created_at?: string | null
          faq_category_id?: string | null
          featured?: boolean | null
          id?: string
          question?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_faq_category_id_fkey"
            columns: ["faq_category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_submissions: {
        Row: {
          archived: boolean | null
          clarity_rating: number | null
          comments: string | null
          created_at: string | null
          email: string | null
          feedback_type: string | null
          id: string
          ip_address: unknown | null
          is_actioned: boolean | null
          satisfaction_rating: number | null
          source_url: string | null
          usefulness_rating: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          archived?: boolean | null
          clarity_rating?: number | null
          comments?: string | null
          created_at?: string | null
          email?: string | null
          feedback_type?: string | null
          id?: string
          ip_address?: unknown | null
          is_actioned?: boolean | null
          satisfaction_rating?: number | null
          source_url?: string | null
          usefulness_rating?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          archived?: boolean | null
          clarity_rating?: number | null
          comments?: string | null
          created_at?: string | null
          email?: string | null
          feedback_type?: string | null
          id?: string
          ip_address?: unknown | null
          is_actioned?: boolean | null
          satisfaction_rating?: number | null
          source_url?: string | null
          usefulness_rating?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      icons: {
        Row: {
          created_at: string | null
          description: string | null
          icon_library: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_library?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_library?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      instruments: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: number
          title: string | null
        }
        Insert: {
          id?: number
          title?: string | null
        }
        Update: {
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          meta_description: string | null
          og_image_url: string | null
          page_type: Database["public"]["Enums"]["page_type_enum"]
          published_at: string | null
          slug: string
          sort_order: number | null
          status: Database["public"]["Enums"]["page_status_enum"]
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["page_type_enum"]
          published_at?: string | null
          slug: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status_enum"]
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["page_type_enum"]
          published_at?: string | null
          slug?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status_enum"]
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          content: Json | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image_url: string | null
          id: string
          og_image_url: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: Json | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_services: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          service_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          service_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tags: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          content: Json | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          featured_image_url: string | null
          id: string
          og_image_url: string | null
          project_date: string | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          og_image_url?: string | null
          project_date?: string | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          og_image_url?: string | null
          project_date?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          featured_image_url: string | null
          id: string
          offering_type: Database["public"]["Enums"]["service_offering_type"]
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          offering_type?: Database["public"]["Enums"]["service_offering_type"]
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          offering_type?: Database["public"]["Enums"]["service_offering_type"]
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonial_services: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          testimonial_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          testimonial_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          testimonial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonial_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          name: string
          project_id: string | null
          quote: string
          role: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          name: string
          project_id?: string | null
          quote: string
          role?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          name?: string
          project_id?: string | null
          quote?: string
          role?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_problem_pages: {
        Row: {
          created_at: string | null
          id: string
          page_id: string
          ux_problem_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id: string
          ux_problem_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string
          ux_problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ux_problem_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ux_problem_pages_ux_problem_id_fkey"
            columns: ["ux_problem_id"]
            isOneToOne: false
            referencedRelation: "ux_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_problem_solutions: {
        Row: {
          created_at: string | null
          id: string
          ux_problem_id: string
          ux_solution_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ux_problem_id: string
          ux_solution_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ux_problem_id?: string
          ux_solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ux_problem_solutions_ux_problem_id_fkey"
            columns: ["ux_problem_id"]
            isOneToOne: false
            referencedRelation: "ux_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ux_problem_solutions_ux_solution_id_fkey"
            columns: ["ux_solution_id"]
            isOneToOne: false
            referencedRelation: "ux_solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_problems: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon_id: string | null
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_id?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_id?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_problems_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_solution_pages: {
        Row: {
          created_at: string | null
          id: string
          page_id: string
          ux_solution_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id: string
          ux_solution_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string
          ux_solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ux_solution_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ux_solution_pages_ux_solution_id_fkey"
            columns: ["ux_solution_id"]
            isOneToOne: false
            referencedRelation: "ux_solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_solutions: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon_id: string | null
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_id?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_id?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_solutions_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
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
      page_status_enum: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED"
      page_type_enum:
        | "MAIN"
        | "RESOURCES"
        | "LEGAL"
        | "PRODUCT"
        | "MARKETING"
        | "CONTENT_HUB"
        | "STANDARD"
        | "OTHER"
      post_status: "draft" | "pending_review" | "published" | "archived"
      service_offering_type: "INDIVIDUAL" | "BUNDLE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      page_status_enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"],
      page_type_enum: [
        "MAIN",
        "RESOURCES",
        "LEGAL",
        "PRODUCT",
        "MARKETING",
        "CONTENT_HUB",
        "STANDARD",
        "OTHER",
      ],
      post_status: ["draft", "pending_review", "published", "archived"],
      service_offering_type: ["INDIVIDUAL", "BUNDLE"],
    },
  },
} as const
