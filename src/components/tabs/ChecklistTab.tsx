import React, { useState } from 'react';
import { ChecklistItem, WeddingRole } from '../../types/wedding';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Calendar,
  AlertCircle,
  X,
  Share2,
} from 'lucide-react';

interface ChecklistTabProps {
  checklists: ChecklistItem[];
  sideFilter: WeddingRole;
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: Omit<ChecklistItem, 'id' | 'updatedAt' | 'lastUpdatedBy'>) => void;
  onDeleteChecklist: (id: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  checklists,
  sideFilter,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [activeSide, setActiveSide] = useState<WeddingRole>(sideFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newMilestone, setNewMilestone] = useState<ChecklistItem['milestone']>('H-30');
  const [newSide, setNewSide] = useState<ChecklistItem['side']>('joint');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<ChecklistItem['priority']>('Sedang');
  const [newCategory, setNewCategory] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleToggle = (id: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      // Trigger subtle celebration confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#b45309', '#f59e0b', '#10b981', '#3b82f6'],
      });
    }
    onToggleChecklist(id);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddChecklist({
      title: newTitle.trim(),
      milestone: newMilestone,
      side: newSide,
      assignedTo: newAssignedTo.trim() || (newSide === 'groom' ? 'Pihak Pria' : newSide === 'bride' ? 'Pihak Wanita' : 'Bersama'),
      completed: false,
      dueDate: newDueDate || '2026-11-01',
      priority: newPriority,
      category: newCategory.trim() || 'Persiapan Umum',
      notes: newNotes.trim(),
    });

    // Reset and close
    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const filteredItems = checklists.filter((item) => {
    const matchesMilestone = selectedMilestone === 'all' || item.milestone === selectedMilestone;
    const matchesSide = activeSide === 'joint' || item.side === activeSide || item.side === 'joint';
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMilestone && matchesSide && matchesSearch;
  });

  const milestones: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua Milestone' },
    { id: 'H-180', label: 'H-180 (6 Bulan)' },
    { id: 'H-90', label: 'H-90 (3 Bulan)' },
    { id: 'H-30', label: 'H-30 (1 Bulan)' },
    { id: 'H-14', label: 'H-14 (2 Minggu)' },
    { id: 'H-7', label: 'H-7 (1 Minggu)' },
    { id: 'Hari H', label: 'Hari H (Pelaksanaan)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Ceklist Terintegrasi
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Ceklist Persiapan Otomatis & Sinkronisasi Dual Pihak
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Setiap perubahan disinkronisasikan antara pihak calon mempelai pria dan wanita secara transparan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateSync}
              disabled={isSyncing}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-800' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Otomatis'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Segmented Side Tabs and Milestone Select */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Tampilkan:</span>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setActiveSide('joint')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'joint'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Tugas
              </button>
              <button
                onClick={() => setActiveSide('groom')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'groom'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-blue-700'
                }`}
              >
                Tugas Pihak Pria
              </button>
              <button
                onClick={() => setActiveSide('bride')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'bride'
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                Tugas Pihak Wanita
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari tugas atau PIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>
        </div>

        {/* Milestone Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {milestones.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMilestone(m.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedMilestone === m.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Task Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-amber-700/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-800">Ceklist Persiapan Masih Kosong</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Data dummy telah dibersihkan. Anda sekarang dapat mengisi dan menyusun daftar tugas persiapan secara mandiri.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas Pertama</span>
            </button>
          </div>
        ) : (
          filteredItems.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border transition-all p-4.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'border-stone-200/80 bg-stone-50/60 opacity-80'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id, task.completed)}
                  className="mt-1 w-5 h-5 text-amber-700 rounded border-stone-300 focus:ring-amber-700 cursor-pointer"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.side === 'groom'
                          ? 'bg-blue-100 text-blue-800'
                          : task.side === 'bride'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {task.side === 'groom'
                        ? 'Pihak Pria'
                        : task.side === 'bride'
                        ? 'Pihak Wanita'
                        : 'Bersama'}
                    </span>
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {task.milestone}
                    </span>
                  </div>

                  {task.notes && (
                    <p className="text-xs text-stone-500 leading-relaxed">{task.notes}</p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
                    <span>PIC: <strong className="text-stone-700">{task.assignedTo}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Tenggat: <strong className="text-stone-700">{task.dueDate}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-400">Sinkronisasi: {task.lastUpdatedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onDeleteChecklist(task.id)}
                  className="text-stone-400 hover:text-red-600 transition-colors text-xs p-1"
                  title="Hapus Tugas"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Ceklist Baru
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  Tambah Tugas Persiapan
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
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Tugas / Keperluan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengurusan Surat Rekomendasi Nikah KUA"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Pihak Penanggung Jawab
                  </label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as ChecklistItem['side'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="joint">Bersama (Dua Pihak)</option>
                    <option value="groom">Pihak Pria (Afif)</option>
                    <option value="bride">Pihak Wanita (Nabila)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Tahap Milestone
                  </label>
                  <select
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value as ChecklistItem['milestone'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="H-180">H-180 (6 Bulan)</option>
                    <option value="H-90">H-90 (3 Bulan)</option>
                    <option value="H-30">H-30 (1 Bulan)</option>
                    <option value="H-14">H-14 (2 Minggu)</option>
                    <option value="H-7">H-7 (1 Minggu)</option>
                    <option value="Hari H">Hari H</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    PIC (Person in Charge)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama penanggung jawab"
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruksi khusus, detail berkas, dsb."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
