import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseSettings } from '../types/wedding';
import { loadData, saveData } from './storage';

export const DEFAULT_SUPABASE_SETTINGS: SupabaseSettings = {
  url: '',
  anonKey: '',
  isConnected: false,
  autoSync: false,
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseSettings(): SupabaseSettings {
  return loadData<SupabaseSettings>('supabase_config', DEFAULT_SUPABASE_SETTINGS);
}

export function saveSupabaseSettings(settings: SupabaseSettings): void {
  saveData('supabase_config', settings);
  cachedClient = null; // reset cached instance
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const config = getSupabaseSettings();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
      return cachedClient;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL dan Anon Key Supabase tidak boleh kosong.' };
  }
  try {
    const testClient = createClient(url, anonKey);
    // Ping by checking auth session or selecting from weddings table
    const { error } = await testClient.from('weddings').select('id').limit(1);
    // If the table doesn't exist yet, it will return error 42P01 but network connection succeeded
    if (error && error.code !== '42P01' && !error.message.includes('relation "weddings" does not exist')) {
      return {
        success: false,
        message: `Gagal tersambung: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Koneksi ke Supabase berhasil! Backend Cloudflare Pages & Supabase siap digunakan.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Error koneksi: ${msg}` };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- SKEMA DATABASE WEDDING PLANNER UNTUK SUPABASE
-- Didesain untuk Cloudflare Pages & Supabase Dual-Management
-- ========================================================

-- 1. Tabel Profil Pernikahan
CREATE TABLE IF NOT EXISTS weddings (
  id TEXT PRIMARY KEY,
  groom_name TEXT NOT NULL,
  groom_nickname TEXT NOT NULL,
  groom_family TEXT,
  bride_name TEXT NOT NULL,
  bride_nickname TEXT NOT NULL,
  bride_family TEXT,
  wedding_date DATE NOT NULL,
  wedding_time TIME NOT NULL,
  reception_time TIME,
  venue_name TEXT NOT NULL,
  venue_city TEXT,
  venue_address TEXT,
  total_budget_limit BIGINT DEFAULT 0,
  groom_budget_limit BIGINT DEFAULT 0,
  bride_budget_limit BIGINT DEFAULT 0,
  joint_budget_limit BIGINT DEFAULT 0,
  target_guests_count INT DEFAULT 0,
  story_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Checklist Persiapan (Dual-Sync Pria & Wanita)
CREATE TABLE IF NOT EXISTS checklists (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  milestone TEXT NOT NULL, -- 'H-180', 'H-90', 'H-30', 'H-14', 'H-7', 'Hari H'
  side TEXT NOT NULL,      -- 'groom', 'bride', 'joint'
  assigned_to TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  priority TEXT DEFAULT 'Sedang',
  category TEXT,
  notes TEXT,
  last_updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Daftar Tamu & RSVP
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  side TEXT NOT NULL, -- 'groom', 'bride', 'joint'
  category TEXT DEFAULT 'Sahabat',
  pax INT DEFAULT 1,
  rsvp TEXT DEFAULT 'Menunggu', -- 'Hadir', 'Menunggu', 'Tidak Hadir'
  table_number TEXT,
  phone TEXT,
  invitation_sent BOOLEAN DEFAULT FALSE,
  checked_in BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Vendor & Kontrak
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  instagram TEXT,
  total_cost BIGINT DEFAULT 0,
  paid_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'Dikonfirmasi',
  notes TEXT,
  responsible_side TEXT DEFAULT 'joint',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Pembayaran & Termin
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'Belum Bayar', -- 'Lunas', 'Jatuh Tempo', 'Belum Bayar'
  payment_side TEXT DEFAULT 'joint', -- 'groom', 'bride', 'joint'
  method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Rundown Acara Interaktif
CREATE TABLE IF NOT EXISTS rundowns (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  session TEXT NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  pic TEXT,
  pic_phone TEXT,
  pic_side TEXT DEFAULT 'joint',
  vendor_involved TEXT,
  audio_visual_notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Catatan Koordinasi Vendor Real-time
CREATE TABLE IF NOT EXISTS coordination_notes (
  id TEXT PRIMARY KEY,
  wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
  vendor_name TEXT,
  author_name TEXT NOT NULL,
  author_side TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tag TEXT DEFAULT 'Umum'
);

-- Aktifkan Row Level Security (RLS) jika diinginkan:
-- ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rundowns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE coordination_notes ENABLE ROW LEVEL SECURITY;
`;
