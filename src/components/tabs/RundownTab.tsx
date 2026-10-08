import React, { useState } from 'react';
import { RundownItem, WeddingProfile, WeddingRole } from '../../types/wedding';
import {
  Clock,
  Plus,
  PlayCircle,
  CheckCircle2,
  Phone,
  Music,
  Printer,
  X,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface RundownTabProps {
  rundowns: RundownItem[];
  profile: WeddingProfile;
  sideFilter: WeddingRole;
  onAddRundown: (item: Omit<RundownItem, 'id'>) => void;
  onUpdateRundown: (id: string, updates: Partial<RundownItem>) => void;
  onDeleteRundown: (id: string) => void;
}

export const RundownTab: React.FC<RundownTabProps> = ({
  rundowns,
  profile,
  sideFilter,
  onAddRundown,
  onUpdateRundown,
  onDeleteRundown,
}) => {
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [activeRunningId, setActiveRunningId] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Form State
  const [session, setSession] = useState<RundownItem['session']>('Akad Nikah');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('08:45');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Pelaminan Utama');
  const [pic, setPic] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [picSide, setPicSide] = useState<RundownItem['picSide']>('joint');
  const [vendorInvolved, setVendorInvolved] = useState('');
  const [audioVisualNotes, setAudioVisualNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddRundown({
      session,
      timeStart,
      timeEnd,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      pic: pic.trim() || 'Tim Wedding Organizer',
      picPhone: picPhone.trim(),
      picSide,
      vendorInvolved: vendorInvolved.trim(),
      audioVisualNotes: audioVisualNotes.trim(),
      completed: false,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRundowns = rundowns
    .filter((r) => {
      const matchesSession = selectedSession === 'all' || r.session === selectedSession;
      return matchesSession;
    })
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  const sessions: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua Sesi Acara' },
    { id: 'Persiapan', label: '01. Persiapan Pagi' },
    { id: 'Akad Nikah', label: '02. Akad Nikah' },
    { id: 'Temu Manten & Adat', label: '03. Temu Adat & Sungkeman' },
    { id: 'Resepsi', label: '04. Resepsi Pernikahan' },
  ];

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Rundown Acara Menit Demi Menit
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Timeline Rundown Interaktif Hari H
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau jalannya agenda secara langsung, hubungi PIC dengan satu ketukan, dan pastikan zero-delay.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF Rundown</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda</span>
            </button>
          </div>
        </div>

        {/* Session Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-stone-100 pt-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSession(s.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedSession === s.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Header (Visible only when printing) */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold font-serif-luxury">
          RUNDOWN RESMI PERNIKAHAN {profile.groomName.toUpperCase()} & {profile.brideName.toUpperCase()}
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          {profile.weddingDate} · {profile.venueName}, {profile.venueCity}
        </p>
      </div>

      {/* Interactive Timeline Agenda List */}
      <div className="space-y-4">
        {filteredRundowns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <Clock className="w-12 h-12 text-amber-700/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-800">Rundown Acara Masih Kosong</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Silakan tambahkan susunan acara untuk akad, resepsi, maupun upacara adat secara mandiri.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda Pertama</span>
            </button>
          </div>
        ) : (
          filteredRundowns.map((item, index) => {
          const isCurrentlyActive = activeRunningId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs relative overflow-hidden ${
                isCurrentlyActive
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
                  : item.completed
                  ? 'border-stone-200/80 bg-stone-50/60 opacity-80'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Highlight badge for active agenda */}
              {isCurrentlyActive && (
                <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider print:hidden">
                  Sedang Berlangsung
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Time and Title */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Time badge */}
                  <div className="text-center p-2.5 rounded-xl bg-stone-100 border border-stone-200/80 shrink-0 w-24">
                    <span className="text-xs font-bold text-stone-900 tabular-nums block font-mono">
                      {item.timeStart}
                    </span>
                    <span className="text-[10px] text-stone-400 block tabular-nums">s/d {item.timeEnd}</span>
                  </div>

                  {/* Main Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-base font-semibold ${
                          item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {item.session}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Location & AV Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-stone-500">
                      <div>
                        📍 <strong className="text-stone-700">{item.location}</strong>
                      </div>
                      {item.vendorInvolved && (
                        <div>
                          🤝 Vendor: <span className="text-stone-700">{item.vendorInvolved}</span>
                        </div>
                      )}
                    </div>

                    {item.audioVisualNotes && (
                      <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 flex items-center gap-2 mt-1">
                        <Music className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Cue Audio/Visual: {item.audioVisualNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: PIC details & Action controls */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 print:hidden">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-stone-400">
                      Penanggung Jawab (PIC)
                    </div>
                    <div className="text-xs font-semibold text-stone-800">{item.pic}</div>
                    {item.picPhone && (
                      <a
                        href={`https://wa.me/${item.picPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{item.picPhone}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveRunningId(item.id)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                        isCurrentlyActive
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {isCurrentlyActive ? 'Aktif' : 'Set Berjalan'}
                    </button>

                    <button
                      onClick={() =>
                        onUpdateRundown(item.id, { completed: !item.completed })
                      }
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {item.completed ? 'Selesai' : 'Tandai Selesai'}
                    </button>

                    <button
                      onClick={() => onDeleteRundown(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Hapus"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>

      {/* Add Agenda Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Agenda Baru
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  Tambah Agenda Rundown
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Sesi Acara
                  </label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value as RundownItem['session'])}
                    className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="Persiapan">Persiapan</option>
                    <option value="Akad Nikah">Akad Nikah</option>
                    <option value="Temu Manten & Adat">Temu Adat</option>
                    <option value="Resepsi">Resepsi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mulai (WIB)
                  </label>
                  <input
                    type="time"
                    required
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Selesai (WIB)
                  </label>
                  <input
                    type="time"
                    required
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Agenda / Aktivitas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sesi Foto Bersama Keluarga Inti & Kerabat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Deskripsi / Alur Agenda
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruksi urutan panggung, tata cara, dsb."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Lokasi / Titik Acara
                  </label>
                  <input
                    type="text"
                    placeholder="Pelaminan / Foyer / Meja Akad"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama PIC (Penanggung Jawab)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    No. HP PIC
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Vendor yang Terlibat
                  </label>
                  <input
                    type="text"
                    placeholder="MC / WO / Band / Dokumentasi"
                    value={vendorInvolved}
                    onChange={(e) => setVendorInvolved(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Petunjuk Audio Visual & Musik (Cue)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lagu romantis instrumental biola saat pengantin naik panggung"
                  value={audioVisualNotes}
                  onChange={(e) => setAudioVisualNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
