export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          api_category_name: string | null;
          description: string | null;
          icon_type: "lucide" | "image";
          icon_name: string | null;
          icon_src: string | null;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          api_category_name?: string | null;
          description?: string | null;
          icon_type?: "lucide" | "image";
          icon_name?: string | null;
          icon_src?: string | null;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          api_category_name?: string | null;
          description?: string | null;
          icon_type?: "lucide" | "image";
          icon_name?: string | null;
          icon_src?: string | null;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      merchants: {
        Row: {
          id: number;
          category_id: number;
          name: string;
          logo_url: string | null;
          logo_dark_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category_id: number;
          name: string;
          logo_url?: string | null;
          logo_dark_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          category_id?: number;
          name?: string;
          logo_url?: string | null;
          logo_dark_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "merchants_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      sub_merchants: {
        Row: {
          id: number;
          merchant_id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          merchant_id: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          merchant_id?: number;
          name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sub_merchants_merchant_id_fkey";
            columns: ["merchant_id"];
            isOneToOne: false;
            referencedRelation: "merchants";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          merchant: string;
          category_id: number | null;
          category_slug: string | null;
          category: string;
          date: string;
          amount: string;
          currency: string;
          status: "Declined" | "Success" | "Pending";
          reason: string | null;
          card_last4: string;
          created_at: string;
        };
        Insert: {
          id: string;
          merchant: string;
          category_id?: number | null;
          category_slug?: string | null;
          category: string;
          date: string;
          amount: string;
          currency?: string;
          status?: "Declined" | "Success" | "Pending";
          reason?: string | null;
          card_last4?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          merchant?: string;
          category_id?: number | null;
          category_slug?: string | null;
          category?: string;
          date?: string;
          amount?: string;
          currency?: string;
          status?: "Declined" | "Success" | "Pending";
          reason?: string | null;
          card_last4?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
