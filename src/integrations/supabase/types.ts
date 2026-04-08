export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      anggota: {
        Row: {
          agama: string | null
          alamat: string
          created_at: string | null
          dokumen: Json | null
          email: string | null
          foto: string | null
          id: string
          jenis_kelamin: Database["public"]["Enums"]["jenis_kelamin"] | null
          keluarga: Json | null
          nama: string
          nip: string | null
          no_hp: string
          tanggal_registrasi: string | null
          unit_kerja: string | null
          updated_at: string | null
        }
        Insert: {
          agama?: string | null
          alamat: string
          created_at?: string | null
          dokumen?: Json | null
          email?: string | null
          foto?: string | null
          id: string
          jenis_kelamin?: Database["public"]["Enums"]["jenis_kelamin"] | null
          keluarga?: Json | null
          nama: string
          nip?: string | null
          no_hp: string
          tanggal_registrasi?: string | null
          unit_kerja?: string | null
          updated_at?: string | null
        }
        Update: {
          agama?: string | null
          alamat?: string
          created_at?: string | null
          dokumen?: Json | null
          email?: string | null
          foto?: string | null
          id?: string
          jenis_kelamin?: Database["public"]["Enums"]["jenis_kelamin"] | null
          keluarga?: Json | null
          nama?: string
          nip?: string | null
          no_hp?: string
          tanggal_registrasi?: string | null
          unit_kerja?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          kode_akun: string
          level: number | null
          nama_akun: string
          parent_id: string | null
          saldo_normal: string | null
          tipe_akun: Database["public"]["Enums"]["tipe_akun"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_active?: boolean | null
          kode_akun: string
          level?: number | null
          nama_akun: string
          parent_id?: string | null
          saldo_normal?: string | null
          tipe_akun: Database["public"]["Enums"]["tipe_akun"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kode_akun?: string
          level?: number | null
          nama_akun?: string
          parent_id?: string | null
          saldo_normal?: string | null
          tipe_akun?: Database["public"]["Enums"]["tipe_akun"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      jenis_transaksi: {
        Row: {
          bunga_persen: number | null
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean | null
          jangka_waktu_bulan: number | null
          maksimal_pinjaman: number | null
          minimal_simpanan: number | null
          nama: string
          tipe: string
          updated_at: string | null
        }
        Insert: {
          bunga_persen?: number | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          jangka_waktu_bulan?: number | null
          maksimal_pinjaman?: number | null
          minimal_simpanan?: number | null
          nama: string
          tipe: string
          updated_at?: string | null
        }
        Update: {
          bunga_persen?: number | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          jangka_waktu_bulan?: number | null
          maksimal_pinjaman?: number | null
          minimal_simpanan?: number | null
          nama?: string
          tipe?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jurnal_details: {
        Row: {
          akun_id: string
          created_at: string | null
          debit: number | null
          id: string
          jurnal_entry_id: string
          keterangan: string | null
          kredit: number | null
        }
        Insert: {
          akun_id: string
          created_at?: string | null
          debit?: number | null
          id?: string
          jurnal_entry_id: string
          keterangan?: string | null
          kredit?: number | null
        }
        Update: {
          akun_id?: string
          created_at?: string | null
          debit?: number | null
          id?: string
          jurnal_entry_id?: string
          keterangan?: string | null
          kredit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jurnal_details_akun_id_fkey"
            columns: ["akun_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jurnal_details_jurnal_entry_id_fkey"
            columns: ["jurnal_entry_id"]
            isOneToOne: false
            referencedRelation: "jurnal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      jurnal_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          keterangan: string
          nomor_jurnal: string
          referensi: string | null
          tanggal: string
          total_debit: number | null
          total_kredit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          keterangan: string
          nomor_jurnal: string
          referensi?: string | null
          tanggal?: string
          total_debit?: number | null
          total_kredit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          keterangan?: string
          nomor_jurnal?: string
          referensi?: string | null
          tanggal?: string
          total_debit?: number | null
          total_kredit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jurnal_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kasir: {
        Row: {
          aktif: boolean | null
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          nama: string
          no_hp: string | null
          updated_at: string | null
        }
        Insert: {
          aktif?: boolean | null
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          nama: string
          no_hp?: string | null
          updated_at?: string | null
        }
        Update: {
          aktif?: boolean | null
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nama?: string
          no_hp?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kategori_transaksi: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          is_active: boolean | null
          nama: string
          tipe: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama: string
          tipe: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          is_active?: boolean | null
          nama?: string
          tipe?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pemasok: {
        Row: {
          aktif: boolean | null
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          kontak: string | null
          nama: string
          updated_at: string | null
        }
        Insert: {
          aktif?: boolean | null
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          kontak?: string | null
          nama: string
          updated_at?: string | null
        }
        Update: {
          aktif?: boolean | null
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kontak?: string | null
          nama?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pemasukan_pengeluaran: {
        Row: {
          created_at: string | null
          id: string
          jumlah: number
          kategori: string
          keterangan: string | null
          tanggal: string
          tipe: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          jumlah: number
          kategori: string
          keterangan?: string | null
          tanggal?: string
          tipe: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jumlah?: number
          kategori?: string
          keterangan?: string | null
          tanggal?: string
          tipe?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pengajuan: {
        Row: {
          anggota_id: string
          anggota_nama: string
          angsuran_per_bulan: number | null
          bunga_persen: number | null
          catatan_persetujuan: string | null
          created_at: string | null
          dokumen_pendukung: Json | null
          id: string
          jangka_waktu: number
          jenis_pinjaman: string
          jumlah_pengajuan: number
          status: Database["public"]["Enums"]["status_pengajuan"] | null
          tanggal_disetujui: string | null
          tanggal_pengajuan: string
          total_angsuran: number | null
          tujuan_pinjaman: string | null
          updated_at: string | null
        }
        Insert: {
          anggota_id: string
          anggota_nama: string
          angsuran_per_bulan?: number | null
          bunga_persen?: number | null
          catatan_persetujuan?: string | null
          created_at?: string | null
          dokumen_pendukung?: Json | null
          id: string
          jangka_waktu: number
          jenis_pinjaman: string
          jumlah_pengajuan: number
          status?: Database["public"]["Enums"]["status_pengajuan"] | null
          tanggal_disetujui?: string | null
          tanggal_pengajuan?: string
          total_angsuran?: number | null
          tujuan_pinjaman?: string | null
          updated_at?: string | null
        }
        Update: {
          anggota_id?: string
          anggota_nama?: string
          angsuran_per_bulan?: number | null
          bunga_persen?: number | null
          catatan_persetujuan?: string | null
          created_at?: string | null
          dokumen_pendukung?: Json | null
          id?: string
          jangka_waktu?: number
          jenis_pinjaman?: string
          jumlah_pengajuan?: number
          status?: Database["public"]["Enums"]["status_pengajuan"] | null
          tanggal_disetujui?: string | null
          tanggal_pengajuan?: string
          total_angsuran?: number | null
          tujuan_pinjaman?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengajuan_anggota_id_fkey"
            columns: ["anggota_id"]
            isOneToOne: false
            referencedRelation: "anggota"
            referencedColumns: ["id"]
          },
        ]
      }
      pengaturan: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id: string
          kategori: string
          key: string
          tipe: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id: string
          kategori: string
          key: string
          tipe?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          kategori?: string
          key?: string
          tipe?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      penjualan: {
        Row: {
          bayar: number | null
          catatan: string | null
          created_at: string | null
          diskon: number | null
          id: string
          kasir_id: string | null
          kasir_nama: string | null
          kembalian: number | null
          metode_bayar: string | null
          subtotal: number | null
          tanggal: string
          total: number | null
          total_item: number | null
          updated_at: string | null
        }
        Insert: {
          bayar?: number | null
          catatan?: string | null
          created_at?: string | null
          diskon?: number | null
          id: string
          kasir_id?: string | null
          kasir_nama?: string | null
          kembalian?: number | null
          metode_bayar?: string | null
          subtotal?: number | null
          tanggal?: string
          total?: number | null
          total_item?: number | null
          updated_at?: string | null
        }
        Update: {
          bayar?: number | null
          catatan?: string | null
          created_at?: string | null
          diskon?: number | null
          id?: string
          kasir_id?: string | null
          kasir_nama?: string | null
          kembalian?: number | null
          metode_bayar?: string | null
          subtotal?: number | null
          tanggal?: string
          total?: number | null
          total_item?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "penjualan_kasir_id_fkey"
            columns: ["kasir_id"]
            isOneToOne: false
            referencedRelation: "kasir"
            referencedColumns: ["id"]
          },
        ]
      }
      penjualan_items: {
        Row: {
          created_at: string | null
          harga_satuan: number
          id: string
          kategori: string | null
          nama_produk: string
          penjualan_id: string
          produk_id: string
          quantity: number
          subtotal: number
        }
        Insert: {
          created_at?: string | null
          harga_satuan: number
          id?: string
          kategori?: string | null
          nama_produk: string
          penjualan_id: string
          produk_id: string
          quantity: number
          subtotal: number
        }
        Update: {
          created_at?: string | null
          harga_satuan?: number
          id?: string
          kategori?: string | null
          nama_produk?: string
          penjualan_id?: string
          produk_id?: string
          quantity?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "penjualan_items_penjualan_id_fkey"
            columns: ["penjualan_id"]
            isOneToOne: false
            referencedRelation: "penjualan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penjualan_items_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "produk_items"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id: string
          module: string
          name: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      produk_items: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gambar: string | null
          harga_beli: number | null
          harga_jual: number | null
          id: string
          is_active: boolean | null
          kategori: string | null
          nama: string
          satuan: string | null
          stok: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gambar?: string | null
          harga_beli?: number | null
          harga_jual?: number | null
          id: string
          is_active?: boolean | null
          kategori?: string | null
          nama: string
          satuan?: string | null
          stok?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gambar?: string | null
          harga_beli?: number | null
          harga_jual?: number | null
          id?: string
          is_active?: boolean | null
          kategori?: string | null
          nama?: string
          satuan?: string | null
          stok?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aktif: boolean | null
          alamat: string | null
          anggota_id: string | null
          created_at: string | null
          email: string | null
          foto: string | null
          id: string
          jabatan: string | null
          last_login: string | null
          nama: string
          no_hp: string | null
          role_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          aktif?: boolean | null
          alamat?: string | null
          anggota_id?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id: string
          jabatan?: string | null
          last_login?: string | null
          nama: string
          no_hp?: string | null
          role_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          aktif?: boolean | null
          alamat?: string | null
          anggota_id?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          jabatan?: string | null
          last_login?: string | null
          nama?: string
          no_hp?: string | null
          role_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shu_distributions: {
        Row: {
          anggota_id: string
          anggota_nama: string
          bulan: number | null
          created_at: string | null
          id: string
          pinjaman_aktif: number | null
          shu_amount: number | null
          simpanan_pokok: number | null
          simpanan_sukarela: number | null
          simpanan_wajib: number | null
          tahun: number
          total_simpanan: number | null
          transaksi_count: number | null
          updated_at: string | null
        }
        Insert: {
          anggota_id: string
          anggota_nama: string
          bulan?: number | null
          created_at?: string | null
          id?: string
          pinjaman_aktif?: number | null
          shu_amount?: number | null
          simpanan_pokok?: number | null
          simpanan_sukarela?: number | null
          simpanan_wajib?: number | null
          tahun: number
          total_simpanan?: number | null
          transaksi_count?: number | null
          updated_at?: string | null
        }
        Update: {
          anggota_id?: string
          anggota_nama?: string
          bulan?: number | null
          created_at?: string | null
          id?: string
          pinjaman_aktif?: number | null
          shu_amount?: number | null
          simpanan_pokok?: number | null
          simpanan_sukarela?: number | null
          simpanan_wajib?: number | null
          tahun?: number
          total_simpanan?: number | null
          transaksi_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shu_distributions_anggota_id_fkey"
            columns: ["anggota_id"]
            isOneToOne: false
            referencedRelation: "anggota"
            referencedColumns: ["id"]
          },
        ]
      }
      transaksi: {
        Row: {
          anggota_id: string
          anggota_nama: string
          created_at: string | null
          id: string
          jenis: Database["public"]["Enums"]["jenis_transaksi_enum"]
          jumlah: number
          kategori: string | null
          keterangan: string | null
          status: Database["public"]["Enums"]["status_transaksi"] | null
          tanggal: string
          updated_at: string | null
        }
        Insert: {
          anggota_id: string
          anggota_nama: string
          created_at?: string | null
          id: string
          jenis: Database["public"]["Enums"]["jenis_transaksi_enum"]
          jumlah?: number
          kategori?: string | null
          keterangan?: string | null
          status?: Database["public"]["Enums"]["status_transaksi"] | null
          tanggal?: string
          updated_at?: string | null
        }
        Update: {
          anggota_id?: string
          anggota_nama?: string
          created_at?: string | null
          id?: string
          jenis?: Database["public"]["Enums"]["jenis_transaksi_enum"]
          jumlah?: number
          kategori?: string | null
          keterangan?: string | null
          status?: Database["public"]["Enums"]["status_transaksi"] | null
          tanggal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_anggota_id_fkey"
            columns: ["anggota_id"]
            isOneToOne: false
            referencedRelation: "anggota"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_kerja: {
        Row: {
          created_at: string | null
          id: string
          keterangan: string | null
          nama: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keterangan?: string | null
          nama: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keterangan?: string | null
          nama?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_transaction_number: {
        Args: { prefix: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: string
      }
      has_permission: {
        Args: { permission: string; user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "superadmin" | "admin" | "kasir" | "anggota"
      jenis_kelamin: "L" | "P"
      jenis_transaksi_enum: "Simpan" | "Pinjam" | "Angsuran"
      status_pengajuan: "Pending" | "Disetujui" | "Ditolak"
      status_transaksi: "Pending" | "Sukses" | "Dibatalkan"
      tipe_akun: "ASET" | "KEWAJIBAN" | "MODAL" | "PENDAPATAN" | "BIAYA"
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
      app_role: ["superadmin", "admin", "kasir", "anggota"],
      jenis_kelamin: ["L", "P"],
      jenis_transaksi_enum: ["Simpan", "Pinjam", "Angsuran"],
      status_pengajuan: ["Pending", "Disetujui", "Ditolak"],
      status_transaksi: ["Pending", "Sukses", "Dibatalkan"],
      tipe_akun: ["ASET", "KEWAJIBAN", "MODAL", "PENDAPATAN", "BIAYA"],
    },
  },
} as const
