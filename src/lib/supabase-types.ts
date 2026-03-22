export type SiteStat = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

export type MemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  year: string;
  department: string | null;
  image_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type AboutSectionRow = {
  id: string;
  section_key: string;
  content: Record<string, unknown>;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      site_stats: {
        Row: SiteStat;
        Insert: Omit<SiteStat, "id" | "updated_at">;
        Update: Partial<Omit<SiteStat, "id">>;
        Relationships: [];
      };
      members: {
        Row: MemberRow;
        Insert: Omit<MemberRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MemberRow, "id" | "created_at">>;
        Relationships: [];
      };
      about_sections: {
        Row: AboutSectionRow;
        Insert: Omit<AboutSectionRow, "id" | "updated_at">;
        Update: Partial<Omit<AboutSectionRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
