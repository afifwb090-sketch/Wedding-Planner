import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { WeddingProfile } from '../types/wedding';
import {
  Users,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  FileSpreadsheet,
  Globe2,
} from 'lucide-react';

interface LandingPageProps {
  profile: WeddingProfile;
  onOpenLogin: () => void;
  onQuickDemo: (role: 'groom' | 'bride' | 'planner') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  onOpenLogin,
  onQuickDemo,
}) => {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Metadata Kicker */}
              <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                <span>Wedding Planner Modern</span>
                <span aria-hidden="true">·</span>
                <span>Dual Managemen Pria & Wanita</span>
                <span aria-hidden="true">·</span>
                <span>Cloudflare Pages & Supabase Ready</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-stone-950 tracking-tight leading-[1.15] text-balance">
                Rencanakan Hari Bahagia Bersama, Harmonis Tanpa Selisih Paham.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                Aplikasi wedding planner terintegrasi pertama dengan sistem dual-managemen mandiri
                untuk keluarga mempelai pria dan wanita. Dari pembagian kuota tamu, transparansi
                anggaran, sinkronisasi ceklist otomatis, hingga koordinasi vendor & rundown real-time.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  Masuk ke Planner
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Coba Instan:</span>
                  <button
                    onClick={() => onQuickDemo('groom')}
                    className="px-3 py-2 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                  >
                    Sebagai Pihak Pria
                  </button>
                  <button
                    onClick={() => onQuickDemo('bride')}
                    className="px-3 py-2 text-xs font-medium text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                  >
                    Sebagai Pihak Wanita
                  </button>
                </div>
              </div>

              {/* Proof / Trust Strip */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-6 text-stone-700">
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-stone-950 tabular-nums">100%</div>
                  <div className="text-xs text-stone-500 mt-0.5">Transparansi Finansial</div>
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-stone-950 tabular-nums">2 Pihak</div>
                  <div className="text-xs text-stone-500 mt-0.5">Sinkronisasi Real-Time</div>
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-stone-950 tabular-nums">0 Delay</div>
                  <div className="text-xs text-stone-500 mt-0.5">Rundown Terorganisir</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-900 aspect-16/10">
                <img
                  src="/src/assets/images/wedding_hero_luxury_1791452635754.jpg"
                  alt="Suasana pernikahan elegan Grand Ballroom"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-medium uppercase tracking-widest text-amber-200">
                    Pernikahan {profile.groomNickname} & {profile.brideNickname}
                  </div>
                  <div className="text-lg font-serif-luxury font-semibold mt-1">
                    {profile.venueName}
                  </div>
                  <div className="text-xs text-stone-300 mt-0.5">
                    {profile.venueCity}
                  </div>
                </div>
              </div>

              {/* Live Countdown Card */}
              <CountdownTimer
                targetDate={profile.weddingDate}
                targetTime={profile.weddingTime}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Dual Management */}
      <section id="fitur-dual" className="py-20 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Konsep Utama
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-950 mt-1">
              Dual Managemen: Harmoni Tanpa Kebingungan Antar Dua Keluarga
            </h2>
            <p className="text-stone-600 mt-2">
              Pernikahan di Indonesia menyatukan dua keluarga besar dengan kebutuhan masing-masing.
              SatuCerita Planner membagi kewenangan, anggaran, dan daftar tamu secara adil dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                P
              </div>
              <h3 className="text-lg font-semibold text-stone-900">Pihak Calon Pengantin Pria</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Kelola berkas legalitas KUA asal, fitting beskap pria, persiapan mahar & cincin kawin,
                susunan 9 baki seserahan hantaran, serta daftar tamu khusus relasi keluarga pria.
              </p>
              <div className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                Akses tersendiri · Notifikasi status otomatis
              </div>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                W
              </div>
              <h3 className="text-lg font-semibold text-stone-900">Pihak Calon Pengantin Wanita</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Fokus kurasi kebaya & MUA, konsep dekorasi pelaminan, koordinasi bimbingan pranikah KUA
                setempat, 7 baki balasan hantaran, dan kuota undangan kerabat wanita.
              </p>
              <div className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                Pembaruan real-time · Kontrol preferensi desain
              </div>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                B
              </div>
              <h3 className="text-lg font-semibold text-stone-900">Tanggung Jawab Bersama</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Keputusan bersama untuk gedung ballroom, vendor catering & food testing, band akustik,
                serta pembayaran termin yang dibagi sesuai kesepakatan 50:50 atau proporsional.
              </p>
              <div className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                Audit trail jelas · Saling menyetujui perubahan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Complete Toolkit Bento Grid */}
      <section id="checklist-vendor" className="py-20 border-b border-stone-200 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Fitur Lengkap
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-950 mt-1">
              Dari H-180 Menuju Pelaminan: Semua Terkendali Rapi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Checklist Sinkronisasi */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Ceklist Persiapan Otomatis</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Tersusun berdasarkan milestone kritis (H-180, H-90, H-30, H-14, H-7, hingga Hari H).
                Tersinkronisasi otomatis dengan label penanggung jawab tiap tugas.
              </p>
            </div>

            {/* 2. Manajemen Tamu & WhatsApp RSVP */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Daftar Tamu & RSVP WhatsApp</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Kelola kuota tamu pria dan wanita, plotting nomor meja, kategori VIP, serta generate
                tautan pesan WhatsApp undangan resmi secara instan sekali klik.
              </p>
            </div>

            {/* 3. Budget & Payment Tracker */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Payment Tracker & Jatuh Tempo</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Pantau setiap DP, Termin 1, 2, hingga Pelunasan. Dilengkapi tanggal tenggat waktu
                pembayaran vendor agar tidak ada denda keterlambatan.
              </p>
            </div>

            {/* 4. Koordinasi Vendor Real-Time */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Koordinasi Vendor & Log Catatan</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Buku kontak vendor terpusat dengan tautan chat langsung. Log catatan revisi untuk
                katering, dekorasi, dan dokumentasi yang tercatat rapi.
              </p>
            </div>

            {/* 5. Rundown Acara Interaktif */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Rundown Interaktif Sesi Acara</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Jadwal menit demi menit untuk Akad Nikah, Temu Adat, hingga Resepsi. Lengkap dengan PIC,
                petunjuk audio-visual, serta status on-schedule di hari H.
              </p>
            </div>

            {/* 6. Countdown & Cloud Readiness */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Countdown & Quick Cloud Deploy</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Hitung mundur presisi hari bahagia. Kompatibel penuh dengan Cloudflare Pages dan
                backend Supabase lengkap dengan skrip SQL siap copy-paste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cloudflare Pages & Supabase Architecture Section */}
      <section id="arsitektur-cloud" className="py-20 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <Globe2 className="w-4 h-4" />
                  <span>Deployment Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                  Siap Deploy di Cloudflare Pages dengan Backend Supabase
                </h2>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Aplikasi ini dirancang untuk kecepatan global tanpa server maintenance. Anda dapat
                  menjalankannya dengan penyimpanan lokal offline-first, atau langsung menghubungkan
                  proyek Supabase Anda untuk sinkronisasi multi-perangkat antar kedua keluarga.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-stone-300">
                  <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edge CDN Cloudflare Pages</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PostgreSQL Realtime Supabase</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-stone-950 p-6 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 space-y-2">
                <div className="text-amber-400 font-semibold mb-2 flex items-center justify-between">
                  <span>Skema Database Otomatis</span>
                  <span className="text-[10px] text-stone-400 font-sans">Ready-to-run</span>
                </div>
                <p className="text-stone-400">Tersedia skrip SQL 7 tabel di tab Pengaturan:</p>
                <ul className="space-y-1 text-stone-300">
                  <li>• <code className="text-sky-300">weddings</code> (Profil & Anggaran)</li>
                  <li>• <code className="text-sky-300">checklists</code> (Dual-Sync H-180 s/d Hari H)</li>
                  <li>• <code className="text-sky-300">guests</code> (Tamu, Pax, Meja & RSVP)</li>
                  <li>• <code className="text-sky-300">vendors</code> (Kontrak & PIC)</li>
                  <li>• <code className="text-sky-300">payments</code> (Termin & Jatuh Tempo)</li>
                  <li>• <code className="text-sky-300">rundowns</code> (Sesi & Petunjuk Audio)</li>
                  <li>• <code className="text-sky-300">coordination_notes</code> (Log Real-Time)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#fcfbf9] text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-serif-luxury text-stone-900 text-base font-bold">
            SatuCerita Planner
          </div>
          <div>
            Didesain untuk pernikahan bahagia, tenang, dan transparan.
          </div>
          <div>
            &copy; {new Date().getFullYear()} SatuCerita Planner. Siap untuk Cloudflare Pages & Supabase.
          </div>
        </div>
      </footer>
    </div>
  );
};
