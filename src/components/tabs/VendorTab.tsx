import React, { useState } from 'react';
import {
  VendorItem,
  CoordinationNote,
  WeddingRole,
  UserSession,
} from '../../types/wedding';
import {
  Building2,
  Plus,
  MessageSquare,
  Phone,
  Instagram,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface VendorTabProps {
  vendors: VendorItem[];
  notes: CoordinationNote[];
  sideFilter: WeddingRole;
  userSession: UserSession;
  onAddVendor: (vendor: Omit<VendorItem, 'id'>) => void;
  onAddNote: (note: Omit<CoordinationNote, 'id' | 'createdAt'>) => void;
  onDeleteVendor: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const VendorTab: React.FC<VendorTabProps> = ({
  vendors,
  notes,
  sideFilter,
  userSession,
  onAddVendor,
  onAddNote,
  onDeleteVendor,
  onDeleteNote,
}) => {
  const [activeSide, setActiveSide] = useState<WeddingRole>(sideFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // New Note State
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedVendorForNote, setSelectedVendorForNote] = useState<string>(vendors[0]?.name || '');
  const [newNoteTag, setNewNoteTag] = useState<CoordinationNote['tag']>('Penting');

  // New Vendor Form State
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<VendorItem['category']>('Venue');
  const [vContactPerson, setVContactPerson] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vInstagram, setVInstagram] = useState('');
  const [vTotalCost, setVTotalCost] = useState<number>(10000000);
  const [vNotes, setVNotes] = useState('');
  const [vResponsibleSide, setVResponsibleSide] = useState<VendorItem['responsibleSide']>('joint');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return;

    onAddVendor({
      name: vName.trim(),
      category: vCategory,
      contactPerson: vContactPerson.trim() || 'PIC Vendor',
      phone: vPhone.trim(),
      instagram: vInstagram.trim(),
      totalCost: Number(vTotalCost) || 0,
      paidAmount: 0,
      status: 'Proses Nego',
      notes: vNotes.trim(),
      responsibleSide: vResponsibleSide,
    });

    setVName('');
    setVContactPerson('');
    setVPhone('');
    setVInstagram('');
    setVNotes('');
    setIsAddVendorModalOpen(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddNote({
      vendorName: selectedVendorForNote,
      authorName: `${userSession.name} (${userSession.role === 'groom' ? 'Pria' : userSession.role === 'bride' ? 'Wanita' : 'Planner'})`,
      authorSide: userSession.role === 'groom' ? 'groom' : userSession.role === 'bride' ? 'bride' : 'joint',
      content: newNoteContent.trim(),
      tag: newNoteTag,
    });

    setNewNoteContent('');
  };

  const generateVendorWhatsAppUrl = (phone: string, vendorName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '62' + cleanPhone.slice(1);
    }
    const message = `Halo ${vendorName}, saya ${userSession.name} dari perwakilan calon pengantin. Ingin berkoordinasi mengenai kelanjutan persiapan pernikahan. Mohon infonya ya. Terima kasih.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSide = activeSide === 'joint' || v.responsibleSide === activeSide || v.responsibleSide === 'joint';
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesSide && matchesCategory;
  });

  const categories = [
    'all',
    'Venue',
    'Catering',
    'Dekorasi',
    'MUA & Busana',
    'Dokumentasi',
    'Sound & Band',
    'MC & WO',
    'Undangan & Souvenir',
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Vendor Management Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Direktori & Kolaborasi
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Koordinasi Vendor & Log Catatan Real-Time
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Kontrak, kontak darurat WhatsApp, status DP & pelunasan, serta catatan revisi antar kedua belah pihak.
            </p>
          </div>

          <button
            onClick={() => setIsAddVendorModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Vendor</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Penanggung Jawab:</span>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setActiveSide('joint')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'joint'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Vendor ({vendors.length})
              </button>
              <button
                onClick={() => setActiveSide('groom')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'groom'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-blue-700'
                }`}
              >
                Pihak Pria
              </button>
              <button
                onClick={() => setActiveSide('bride')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'bride'
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                Pihak Wanita
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedCategory === c
                    ? 'bg-amber-800 text-white'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
                }`}
              >
                {c === 'all' ? 'Semua Kategori' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Vendor Cards on Left, Real-Time Coordination Notes Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Vendor Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
            <span>Daftar Vendor Terpilih ({filteredVendors.length})</span>
            <span className="text-xs text-stone-400 normal-case">Klik WhatsApp untuk kontak langsung</span>
          </h3>

          <div className="space-y-3.5">
            {filteredVendors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
                <div className="text-xs font-semibold text-stone-700">Daftar Vendor Masih Kosong</div>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                  Data dummy telah dibersihkan. Klik tombol "+ Tambah Vendor" di atas untuk mulai mencatat vendor & kontrak secara manual.
                </p>
              </div>
            ) : (
              filteredVendors.map((vendor) => {
                const remaining = vendor.totalCost - vendor.paidAmount;
                return (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 p-5 shadow-xs transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-stone-900">
                            {vendor.name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              vendor.responsibleSide === 'groom'
                                ? 'bg-blue-100 text-blue-800'
                                : vendor.responsibleSide === 'bride'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {vendor.responsibleSide === 'groom'
                              ? 'Pihak Pria'
                              : vendor.responsibleSide === 'bride'
                              ? 'Pihak Wanita'
                              : 'Bersama'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-stone-700">{vendor.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>PIC: {vendor.contactPerson}</span>
                          {vendor.instagram && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-800">{vendor.instagram}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {vendor.phone && (
                          <a
                            href={generateVendorWhatsAppUrl(vendor.phone, vendor.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Chat WhatsApp Vendor"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">WA</span>
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteVendor(vendor.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Hapus"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {vendor.notes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                        {vendor.notes}
                      </p>
                    )}

                    {/* Financial summary bar */}
                    <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Nilai Kontrak</span>
                        <span className="font-semibold text-stone-900 tabular-nums">{formatRupiah(vendor.totalCost)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Terbayar</span>
                        <span className="font-semibold text-emerald-700 tabular-nums">{formatRupiah(vendor.paidAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Sisa Pelunasan</span>
                        <span className="font-semibold text-amber-900 tabular-nums">{formatRupiah(remaining)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Real-Time Coordination Notes Thread (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Log Catatan Real-Time
              </span>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Koordinasi Antar Pasangan & Vendor
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">Sinkron otomatis</span>
          </div>

          {/* New Note Input Box */}
          <form onSubmit={handleCreateNote} className="space-y-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-stone-500 font-medium block mb-1">Terkait Vendor:</label>
                <select
                  value={selectedVendorForNote}
                  onChange={(e) => setSelectedVendorForNote(e.target.value)}
                  className="w-full p-1.5 text-xs border border-stone-200 rounded-lg bg-white"
                >
                  <option value="Semua Vendor / Umum">Semua Vendor / Umum</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-medium block mb-1">Label Tag:</label>
                <select
                  value={newNoteTag}
                  onChange={(e) => setNewNoteTag(e.target.value as CoordinationNote['tag'])}
                  className="w-full p-1.5 text-xs border border-stone-200 rounded-lg bg-white"
                >
                  <option value="Penting">Penting</option>
                  <option value="Revisi">Revisi</option>
                  <option value="Konfirmasi">Konfirmasi</option>
                  <option value="Pembayaran">Pembayaran</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                required
                rows={2}
                placeholder="Tulis catatan, instruksi teknis, atau perubahan konsep..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Catatan Koordinasi</span>
            </button>
          </form>

          {/* Notes Feed Timeline */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {notes.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Belum ada catatan koordinasi yang dibuat.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors space-y-1.5 relative group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold ${
                          note.authorSide === 'groom'
                            ? 'text-blue-800'
                            : note.authorSide === 'bride'
                            ? 'text-rose-800'
                            : 'text-amber-800'
                        }`}
                      >
                        {note.authorName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          note.tag === 'Penting'
                            ? 'bg-rose-100 text-rose-800'
                            : note.tag === 'Revisi'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {note.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 text-[10px] tabular-nums">{note.createdAt}</span>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-stone-300 hover:text-rose-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus Catatan"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {note.vendorName && (
                    <div className="text-[11px] font-medium text-stone-500">
                      Terkait: <strong className="text-stone-700">{note.vendorName}</strong>
                    </div>
                  )}

                  <p className="text-xs text-stone-800 leading-relaxed pt-0.5">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Vendor Baru
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  Tambah Rekanan Vendor
                </h3>
              </div>
              <button
                onClick={() => setIsAddVendorModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Vendor / Bisnis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lotus Botanical Decor"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Kategori Vendor
                  </label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value as VendorItem['category'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Dekorasi">Dekorasi</option>
                    <option value="MUA & Busana">MUA & Busana</option>
                    <option value="Dokumentasi">Dokumentasi</option>
                    <option value="Sound & Band">Sound & Band</option>
                    <option value="MC & WO">MC & WO</option>
                    <option value="Undangan & Souvenir">Undangan & Souvenir</option>
                    <option value="Seserahan & Mas Kawin">Seserahan & Mas Kawin</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Pihak Penanggung Jawab
                  </label>
                  <select
                    value={vResponsibleSide}
                    onChange={(e) => setVResponsibleSide(e.target.value as VendorItem['responsibleSide'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="joint">Bersama (50:50)</option>
                    <option value="groom">Pihak Pria (Afif)</option>
                    <option value="bride">Pihak Wanita (Nabila)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama PIC Kontak
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Mas Randy"
                    value={vContactPerson}
                    onChange={(e) => setVContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nomor WhatsApp PIC
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Total Nilai Kontrak (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={500000}
                    value={vTotalCost}
                    onChange={(e) => setVTotalCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Akun Instagram
                  </label>
                  <input
                    type="text"
                    placeholder="@vendor.official"
                    value={vInstagram}
                    onChange={(e) => setVInstagram(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Catatan Paket / Perjanjian Kontrak
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail fasilitas paket, bonus yang dijanjikan, dsb."
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddVendorModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
                >
                  Simpan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
