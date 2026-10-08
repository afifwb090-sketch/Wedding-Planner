import React, { useState, useEffect } from 'react';
import {
  WeddingProfile,
  ChecklistItem,
  GuestItem,
  VendorItem,
  PaymentItem,
  WeddingRole,
} from '../../types/wedding';
import {
  Sparkles,
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Wallet,
  Store,
  ArrowRight,
  Send,
  Users,
} from 'lucide-react';

interface OverviewTabProps {
  profile: WeddingProfile;
  checklists: ChecklistItem[];
  guests: GuestItem[];
  vendors: VendorItem[];
  payments: PaymentItem[];
  sideFilter: WeddingRole;
  onNavigateTab: (tab: string) => void;
  onToggleChecklist: (id: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  checklists,
  guests,
  vendors,
  payments,
  sideFilter,
  onNavigateTab,
  onToggleChecklist,
}) => {
  // Groom stats
  const groomTasks = checklists.filter((c) => c.side === 'groom');
  const groomDone = groomTasks.filter((c) => c.completed).length;
  const groomProgress = groomTasks.length > 0 ? Math.round((groomDone / groomTasks.length) * 100) : 0;

  // Bride stats
  const brideTasks = checklists.filter((c) => c.side === 'bride');
  const brideDone = brideTasks.filter((c) => c.completed).length;
  const brideProgress = brideTasks.length > 0 ? Math.round((brideDone / brideTasks.length) * 100) : 0;

  // Overall stats
  const totalTasks = checklists.length;
  const totalDone = checklists.filter((c) => c.completed).length;
  const overallProgress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  // Guests
  const groomGuestsPax = guests
    .filter((g) => g.side === 'groom')
    .reduce((sum, g) => sum + g.pax, 0);

  const brideGuestsPax = guests
    .filter((g) => g.side === 'bride')
    .reduce((sum, g) => sum + g.pax, 0);

  // Financial calculations
  const totalPaid = payments
    .filter((p) => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate separate days remaining for bride event and groom event
  const [brideDaysRemaining, setBrideDaysRemaining] = useState(255);
  const [groomDaysRemaining, setGroomDaysRemaining] = useState(262);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const bDate = new Date(`${profile.brideEventDate}T08:00:00`);
      const gDate = new Date(`${profile.groomEventDate}T08:00:00`);

      const bDiff = Math.ceil((bDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const gDiff = Math.ceil((gDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      setBrideDaysRemaining(bDiff > 0 ? bDiff : 0);
      setGroomDaysRemaining(gDiff > 0 ? gDiff : 0);
    };
    calc();
  }, [profile.brideEventDate, profile.groomEventDate]);

  const formatJuta = (val: number) => {
    if (!val || val === 0) return 'Rp 0';
    return `Rp ${(val / 1000000).toFixed(1)} Jt`;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner Card: Dual-Event Wedding Preparation System */}
      <div className="bg-[#f8f5ee] border border-[#e8dfcf] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-amber-200/60 text-xs font-semibold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Dual-Event Wedding Preparation System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900 tracking-tight leading-tight">
              {profile.groomName} & {profile.brideName}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              <span className="font-semibold text-stone-800">Konsep: {profile.conceptTheme}.</span> Mengelola 2 acara pernikahan independen (Pihak Mempelai Wanita & Pihak Mempelai Pria) dalam satu kendali terpusat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('rundown')}
              className="px-4 py-2.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>Detail 2 Acara</span>
            </button>

            <button
              onClick={() => onNavigateTab('budget')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#a8743b] hover:bg-[#96632f] rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-amber-100" />
              <span>Kelola Dual Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dual Countdown Acara Pernikahan (Matching exact design in screenshot) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-800" />
            <h2 className="text-lg font-serif-luxury font-bold text-stone-900">
              Dual Countdown Acara Pernikahan
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            2 Tanggal Berbeda • 2 Lokasi Berbeda
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Acara Pihak Mempelai Wanita */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/70">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                ACARA PIHAK MEMPELAI WANITA
              </span>

              <div className="text-right">
                <div className="text-3xl font-serif-luxury font-bold text-rose-900 tabular-nums leading-none">
                  {brideDaysRemaining}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mt-1">
                  HARI LAGI
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                {profile.brideEventTitle}
              </h3>

              <div className="mt-2 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                <span className="text-rose-900 font-medium">"{brideDaysRemaining} Hari Menuju Acara Pernikahan Pihak Wanita"</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono text-stone-600">{profile.brideEventTime}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">
                  {new Date(profile.brideEventDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-stone-600">{profile.brideEventLocation}</span>
              </div>
            </div>

            {/* Progress Bar Wanita */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-stone-600">Progress Persiapan Acara Wanita:</span>
                <span className="font-bold text-rose-800 tabular-nums">{brideProgress}%</span>
              </div>
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${brideProgress}%` }}
                />
              </div>
            </div>

            {/* Bottom mini stats */}
            <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-xs text-stone-600">
              <div>
                <span className="text-stone-400 block text-[10px]">Task Selesai:</span>
                <strong className="text-stone-800">{brideDone}/{brideTasks.length}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Tamu:</span>
                <strong className="text-stone-800">{brideGuestsPax} orang</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Budget:</span>
                <strong className="text-stone-800">{formatJuta(profile.brideBudgetLimit)}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Acara Pihak Mempelai Pria */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                ACARA PIHAK MEMPELAI PRIA
              </span>

              <div className="text-right">
                <div className="text-3xl font-serif-luxury font-bold text-blue-900 tabular-nums leading-none">
                  {groomDaysRemaining}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mt-1">
                  HARI LAGI
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                {profile.groomEventTitle}
              </h3>

              <div className="mt-2 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                <span className="text-blue-900 font-medium">"{groomDaysRemaining} Hari Menuju Acara Pernikahan Pihak Pria"</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono text-stone-600">{profile.groomEventTime}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">
                  {new Date(profile.groomEventDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-stone-600">{profile.groomEventLocation}</span>
              </div>
            </div>

            {/* Progress Bar Pria */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-stone-600">Progress Persiapan Acara Pria:</span>
                <span className="font-bold text-blue-800 tabular-nums">{groomProgress}%</span>
              </div>
              <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${groomProgress}%` }}
                />
              </div>
            </div>

            {/* Bottom mini stats */}
            <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-xs text-stone-600">
              <div>
                <span className="text-stone-400 block text-[10px]">Task Selesai:</span>
                <strong className="text-stone-800">{groomDone}/{groomTasks.length}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Tamu:</span>
                <strong className="text-stone-800">{groomGuestsPax} orang</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Budget:</span>
                <strong className="text-stone-800">{formatJuta(profile.groomBudgetLimit)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four-Metric Row (TOTAL PROGRESS, TOTAL TASK SELESAI, TOTAL BUDGET, VENDOR AKTIF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Progress */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL PROGRESS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif-luxury font-bold text-stone-900 tabular-nums">
              {overallProgress}%
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Persiapan kedua sisi acara</div>
          </div>
        </div>

        {/* Total Task Selesai */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL TASK SELESAI</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif-luxury font-bold text-stone-900 tabular-nums">
              {totalDone} <span className="text-lg font-normal text-stone-400">/ {totalTasks}</span>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Checklist milestone tuntas</div>
          </div>
        </div>

        {/* Total Budget */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL BUDGET</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif-luxury font-bold text-stone-900 tabular-nums">
              {formatJuta(profile.totalBudgetLimit)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Terpakai: {formatJuta(totalPaid)}
            </div>
          </div>
        </div>

        {/* Vendor Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">VENDOR AKTIF</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif-luxury font-bold text-stone-900 tabular-nums">
              {vendors.length} Vendor
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Terkontrak & terkonfirmasi</div>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Strips: Generator Undangan & Urgent Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Undangan Digital Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Generator Undangan Digital Baru</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
              domain/invite/nama-tamu
            </span>
          </div>

          <h3 className="text-base font-serif-luxury font-bold text-stone-900">
            Kirim Undangan Khusus dengan Nama Tamu di Sampul
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed">
            Hasilkan link personal instan untuk setiap tamu dari daftar ({guests.length} tamu). Sudah dilengkapi amplop digital, maps arah, dan RSVP online yang langsung tersinkronkan antar perangkat!
          </p>

          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('invitation_gen')}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Buka Generator Undangan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('guests')}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
            >
              Lihat Daftar Tamu &rarr;
            </button>
          </div>
        </div>

        {/* Priority Checklist */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-800" />
              <span>Tugas Prioritas Terdekat</span>
            </h3>
            <button
              onClick={() => onNavigateTab('checklist')}
              className="text-xs font-medium text-amber-800 hover:underline"
            >
              Semua Checklist ({totalTasks}) &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {checklists.filter((c) => !c.completed).length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                Belum ada checklist prioritas. Buka tab Checklist untuk mulai menambahkan tugas manual.
              </div>
            ) : (
              checklists
                .filter((c) => !c.completed)
                .slice(0, 3)
                .map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={c.completed}
                        onChange={() => onToggleChecklist(c.id)}
                        className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{c.title}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {c.side === 'groom' ? 'Pria' : c.side === 'bride' ? 'Wanita' : 'Bersama'} · PIC: {c.assignedTo} · {c.milestone}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 tabular-nums shrink-0 mt-0.5">
                      {c.dueDate}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
