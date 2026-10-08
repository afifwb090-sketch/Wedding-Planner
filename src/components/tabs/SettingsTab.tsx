import React, { useState } from 'react';
import { WeddingProfile, SupabaseSettings } from '../../types/wedding';
import {
  SUPABASE_SQL_SCHEMA,
  testSupabaseConnection,
} from '../../services/supabase';
import {
  Settings,
  Database,
  Cloud,
  Copy,
  Check,
  Save,
  RefreshCw,
  Download,
  Upload,
  Globe2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SettingsTabProps {
  profile: WeddingProfile;
  supabaseConfig: SupabaseSettings;
  onUpdateProfile: (profile: WeddingProfile) => void;
  onUpdateSupabaseConfig: (config: SupabaseSettings) => void;
  onExportFullData: () => void;
  onResetToDemoData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profile,
  supabaseConfig,
  onUpdateProfile,
  onUpdateSupabaseConfig,
  onExportFullData,
  onResetToDemoData,
}) => {
  const [profileForm, setProfileForm] = useState<WeddingProfile>(profile);
  const [isCopiedSchema, setIsCopiedSchema] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  // Supabase input state
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseConfig.anonKey || '');
  const [autoSync, setAutoSync] = useState(supabaseConfig.autoSync || false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleTestAndSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestStatus({ loading: true });

    if (!supabaseUrl || !supabaseAnonKey) {
      setTestStatus({
        loading: false,
        success: false,
        message: 'Harap masukkan URL dan Anon Key dari dashboard Supabase Anda.',
      });
      return;
    }

    const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTestStatus({
      loading: false,
      success: res.success,
      message: res.message,
    });

    onUpdateSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim(),
      isConnected: res.success,
      autoSync,
      lastSyncedAt: res.success ? new Date().toISOString() : undefined,
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setIsCopiedSchema(true);
    setTimeout(() => setIsCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
          Konfigurasi Sistem & Infrastruktur
        </span>
        <h2 className="text-2xl font-serif-luxury font-bold text-stone-900 mt-1">
          Pengaturan Pernikahan, Cloudflare Pages & Backend Supabase
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Kelola data mempelai, hubungkan database Supabase untuk multi-perangkat, dan panduan deploy Cloudflare.
        </p>
      </div>

      {/* Cloudflare Pages & Supabase Deployment Card */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif-luxury font-semibold text-white">
                Panduan Deploy: Cloudflare Pages + Backend Supabase
              </h3>
              <p className="text-xs text-stone-400">
                Arsitektur Modern Jamstack / Single Page Application
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
            100% Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-stone-300">
          <div className="space-y-2 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>Langkah 1: Setup Supabase</span>
            </div>
            <p>
              Buka <strong className="text-white">supabase.com</strong>, buat proyek baru, lalu buka menu <strong>SQL Editor</strong> dan jalankan skrip skema di bawah ini.
            </p>
          </div>

          <div className="space-y-2 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>Langkah 2: Ambil Kredensial API</span>
            </div>
            <p>
              Buka <strong>Project Settings &gt; API</strong> di Supabase. Salin <strong>Project URL</strong> dan <strong>anon/public Key</strong> ke form koneksi di bawah.
            </p>
          </div>

          <div className="space-y-2 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>Langkah 3: Deploy Cloudflare Pages</span>
            </div>
            <p>
              Hubungkan repositori Git ke <strong>Cloudflare Pages</strong>. Konfigurasi build command: <code className="text-amber-300 font-mono">npm run build</code>, output directory: <code className="text-amber-300 font-mono">dist</code>.
            </p>
          </div>
        </div>

        {/* SQL Schema Copy Card */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Skema SQL Database Supabase (7 Tabel Lengkap)</span>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              {isCopiedSchema ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Salin Skrip SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-stone-950 rounded-xl border border-stone-800 font-mono text-[11px] text-stone-300 max-h-56 overflow-y-auto leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Live Supabase Connection Box */}
        <form onSubmit={handleTestAndSaveSupabase} className="space-y-4 pt-3 border-t border-stone-800">
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <span>Koneksikan Proyek Supabase Anda Sekarang:</span>
            {supabaseConfig.isConnected && (
              <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[10px]">
                Tersambung
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-400 block mb-1">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-stone-400 block mb-1">Supabase Anon Public Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <input
                type="checkbox"
                id="autosync"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="rounded border-stone-700 bg-stone-950 text-amber-500"
              />
              <label htmlFor="autosync" className="cursor-pointer">
                Aktifkan sinkronisasi otomatis multi-perangkat antar kedua pihak
              </label>
            </div>

            <button
              type="submit"
              disabled={testStatus.loading}
              className="px-5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
              <span>{testStatus.loading ? 'Memeriksa Koneksi...' : 'Uji & Simpan Koneksi'}</span>
            </button>
          </div>

          {testStatus.message && (
            <div
              className={`p-3 rounded-xl text-xs border ${
                testStatus.success
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              {testStatus.message}
            </div>
          )}
        </form>
      </div>

      {/* Wedding Profile Editor */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Identitas & Waktu
            </span>
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900">
              Detail Mempelai, Lokasi & Plafon Anggaran
            </h3>
          </div>

          {saveSuccessNotice && (
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Perubahan Disimpan!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Couple Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/60 space-y-3">
              <span className="text-xs font-bold text-blue-900 block">Pihak Mempelai Pria</span>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={profileForm.groomName}
                  onChange={(e) => setProfileForm({ ...profileForm, groomName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    value={profileForm.groomNickname}
                    onChange={(e) => setProfileForm({ ...profileForm, groomNickname: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Plafon Budget (Rp)</label>
                  <input
                    type="number"
                    value={profileForm.groomBudgetLimit}
                    onChange={(e) => setProfileForm({ ...profileForm, groomBudgetLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/60 space-y-3">
              <span className="text-xs font-bold text-rose-900 block">Pihak Mempelai Wanita</span>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={profileForm.brideName}
                  onChange={(e) => setProfileForm({ ...profileForm, brideName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    value={profileForm.brideNickname}
                    onChange={(e) => setProfileForm({ ...profileForm, brideNickname: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Plafon Budget (Rp)</label>
                  <input
                    type="number"
                    value={profileForm.brideBudgetLimit}
                    onChange={(e) => setProfileForm({ ...profileForm, brideBudgetLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Concept Theme & Sync Room Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Konsep / Tema Pernikahan</label>
              <input
                type="text"
                value={profileForm.conceptTheme}
                onChange={(e) => setProfileForm({ ...profileForm, conceptTheme: e.target.value })}
                placeholder="Contoh: Modern Elegance"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Kode Ruang Sinkron Antar Device (Room Code)</label>
              <input
                type="text"
                value={profileForm.roomCode}
                onChange={(e) => setProfileForm({ ...profileForm, roomCode: e.target.value.toUpperCase() })}
                placeholder="AFIF-AYU-2027"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-mono font-bold text-amber-800"
              />
            </div>
          </div>

          {/* Dual Events Specific Dates & Venues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-100">
            {/* Event Wanita Details */}
            <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200/70 space-y-3">
              <span className="text-xs font-bold text-rose-900 block">Detail Acara Pihak Mempelai Wanita</span>
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Judul Acara</label>
                <input
                  type="text"
                  value={profileForm.brideEventTitle}
                  onChange={(e) => setProfileForm({ ...profileForm, brideEventTitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={profileForm.brideEventDate}
                    onChange={(e) => setProfileForm({ ...profileForm, brideEventDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Waktu Acara</label>
                  <input
                    type="text"
                    value={profileForm.brideEventTime}
                    onChange={(e) => setProfileForm({ ...profileForm, brideEventTime: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Lokasi Gedung / Tempat</label>
                <input
                  type="text"
                  value={profileForm.brideEventLocation}
                  onChange={(e) => setProfileForm({ ...profileForm, brideEventLocation: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Event Pria Details */}
            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200/70 space-y-3">
              <span className="text-xs font-bold text-blue-900 block">Detail Acara Pihak Mempelai Pria</span>
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Judul Acara</label>
                <input
                  type="text"
                  value={profileForm.groomEventTitle}
                  onChange={(e) => setProfileForm({ ...profileForm, groomEventTitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={profileForm.groomEventDate}
                    onChange={(e) => setProfileForm({ ...profileForm, groomEventDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Waktu Acara</label>
                  <input
                    type="text"
                    value={profileForm.groomEventTime}
                    onChange={(e) => setProfileForm({ ...profileForm, groomEventTime: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Lokasi Gedung / Tempat</label>
                <input
                  type="text"
                  value={profileForm.groomEventLocation}
                  onChange={(e) => setProfileForm({ ...profileForm, groomEventLocation: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Clear */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Cadangan Data & Kosongkan Data</h4>
          <p className="text-xs text-stone-500 mt-0.5">
            Ekspor seluruh data ke file JSON atau kosongkan data untuk mulai mengisi perencanaan dari nol secara manual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportFullData}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Kosongkan semua data checklist, tamu, vendor, anggaran, dan rundown agar Anda bisa mengisi manual dari nol?')) {
                onResetToDemoData();
              }
            }}
            className="px-3.5 py-2 text-xs font-medium text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
          >
            Kosongkan Data (Mulai dari Nol)
          </button>
        </div>
      </div>
    </div>
  );
};
