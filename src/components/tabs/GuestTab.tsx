import React, { useState } from 'react';
import { GuestItem, WeddingRole, WeddingProfile } from '../../types/wedding';
import {
  Users,
  UserPlus,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Filter,
  X,
  Send,
  Sparkles,
} from 'lucide-react';

interface GuestTabProps {
  guests: GuestItem[];
  profile: WeddingProfile;
  sideFilter: WeddingRole;
  onAddGuest: (guest: Omit<GuestItem, 'id'>) => void;
  onUpdateGuest: (id: string, updates: Partial<GuestItem>) => void;
  onDeleteGuest: (id: string) => void;
}

export const GuestTab: React.FC<GuestTabProps> = ({
  guests,
  profile,
  sideFilter,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
}) => {
  const [activeSide, setActiveSide] = useState<WeddingRole>(sideFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeWaModalGuest, setActiveWaModalGuest] = useState<GuestItem | null>(null);

  // New Guest Form State
  const [name, setName] = useState('');
  const [side, setSide] = useState<GuestItem['side']>('joint');
  const [category, setCategory] = useState<GuestItem['category']>('Sahabat');
  const [pax, setPax] = useState<number>(2);
  const [rsvp, setRsvp] = useState<GuestItem['rsvp']>('Menunggu');
  const [tableNumber, setTableNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Stats calculation
  const totalGuestsCount = guests.length;
  const totalPaxCount = guests.reduce((sum, g) => sum + g.pax, 0);

  const groomPax = guests
    .filter((g) => g.side === 'groom')
    .reduce((sum, g) => sum + g.pax, 0);

  const bridePax = guests
    .filter((g) => g.side === 'bride')
    .reduce((sum, g) => sum + g.pax, 0);

  const jointPax = guests
    .filter((g) => g.side === 'joint')
    .reduce((sum, g) => sum + g.pax, 0);

  const confirmedPax = guests
    .filter((g) => g.rsvp === 'Hadir')
    .reduce((sum, g) => sum + g.pax, 0);

  const pendingPax = guests
    .filter((g) => g.rsvp === 'Menunggu')
    .reduce((sum, g) => sum + g.pax, 0);

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGuest({
      name: name.trim(),
      side,
      category,
      pax: Number(pax) || 1,
      rsvp,
      tableNumber: tableNumber.trim() || 'Meja Bebas',
      phone: phone.trim(),
      invitationSent: false,
      checkedIn: false,
      notes: notes.trim(),
    });

    setName('');
    setPhone('');
    setTableNumber('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Nama Tamu,Pihak,Kategori,Pax,Status RSVP,No Meja,No HP,Catatan\n';
    const rows = guests
      .map(
        (g) =>
          `"${g.id}","${g.name}","${g.side}","${g.category}",${g.pax},"${g.rsvp}","${g.tableNumber}","${g.phone}","${g.notes}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftar_Tamu_Pernikahan_${profile.groomNickname}_${profile.brideNickname}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateWhatsAppUrl = (guest: GuestItem) => {
    const cleanPhone = guest.phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '62' + cleanPhone.slice(1);
    }
    const slug = guest.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    const inviteUrl = `${window.location.origin}/invite/${slug}`;

    const message = `Assalamu'alaikum Wr. Wb. / Salam Sejahtera,\n\nKepada Yth. *${guest.name}*,\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam momen sakral pernikahan kami:\n\n*${profile.groomName} & ${profile.brideName}*\n\nBuka Undangan Digital Resmi Anda di sini:\n👉 ${inviteUrl}\n\nKuota Kursi Anda: ${guest.pax} Pax (${guest.tableNumber || 'Area Resepsi'})\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu. Terima kasih.`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSide = activeSide === 'joint' || g.side === activeSide || g.side === 'joint';
    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;
    const matchesRsvp = rsvpFilter === 'all' || g.rsvp === rsvpFilter;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery) ||
      g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.notes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSide && matchesCategory && matchesRsvp && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Daftar Undangan & RSVP
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Manajemen Tamu Pria, Wanita & Seating Plot
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Alokasi kuota seimbang, sebar undangan digital via WhatsApp dan absensi check-in tamu di lokasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Tamu</span>
            </button>
          </div>
        </div>

        {/* Dual Allocation Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Total Undangan</span>
            <span className="text-xl font-bold font-serif-luxury text-stone-900 tabular-nums">
              {totalGuestsCount} <span className="text-xs font-normal text-stone-500">({totalPaxCount} Pax)</span>
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-center">
            <span className="text-[11px] text-blue-800 uppercase tracking-wider block">Pihak Pria</span>
            <span className="text-xl font-bold font-serif-luxury text-blue-900 tabular-nums">
              {groomPax} Pax
            </span>
          </div>

          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/80 text-center">
            <span className="text-[11px] text-rose-800 uppercase tracking-wider block">Pihak Wanita</span>
            <span className="text-xl font-bold font-serif-luxury text-rose-900 tabular-nums">
              {bridePax} Pax
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-center">
            <span className="text-[11px] text-emerald-800 uppercase tracking-wider block">Konfirmasi Hadir</span>
            <span className="text-xl font-bold font-serif-luxury text-emerald-900 tabular-nums">
              {confirmedPax} Pax
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Pihak:</span>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setActiveSide('joint')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'joint'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Tamu
              </button>
              <button
                onClick={() => setActiveSide('groom')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'groom'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-blue-700'
                }`}
              >
                Tamu Pria ({groomPax})
              </button>
              <button
                onClick={() => setActiveSide('bride')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'bride'
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                Tamu Wanita ({bridePax})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-stone-200 rounded-lg bg-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="VIP">VIP</option>
              <option value="Keluarga Inti">Keluarga Inti</option>
              <option value="Keluarga Besar">Keluarga Besar</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-stone-200 rounded-lg bg-white"
            >
              <option value="all">Semua RSVP</option>
              <option value="Hadir">Hadir</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
            </select>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama / meja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Undangan</th>
                <th className="py-3 px-3">Pihak</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-center">Pax</th>
                <th className="py-3 px-3">RSVP</th>
                <th className="py-3 px-3">No. Meja</th>
                <th className="py-3 px-3 text-center">Undangan WA</th>
                <th className="py-3 px-3 text-center">Check-In Hari H</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400 space-y-2">
                    <Users className="w-8 h-8 text-stone-300 mx-auto" />
                    <div className="text-xs font-semibold text-stone-700">Belum Ada Tamu Terdaftar</div>
                    <p className="text-[11px] text-stone-400">
                      Data dummy telah dihapus. Klik tombol "Tambah Tamu" di kanan atas untuk mulai memasukkan daftar undangan secara manual.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{guest.name}</div>
                      {guest.notes && (
                        <div className="text-[11px] text-stone-400 truncate max-w-xs">{guest.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          guest.side === 'groom'
                            ? 'bg-blue-100 text-blue-800'
                            : guest.side === 'bride'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {guest.side === 'groom'
                          ? 'Pria'
                          : guest.side === 'bride'
                          ? 'Wanita'
                          : 'Bersama'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600 font-medium">
                      {guest.category}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-stone-900 tabular-nums">
                      {guest.pax}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={guest.rsvp}
                        onChange={(e) =>
                          onUpdateGuest(guest.id, { rsvp: e.target.value as GuestItem['rsvp'] })
                        }
                        className={`text-[11px] font-medium py-1 px-2 rounded-lg border focus:outline-none ${
                          guest.rsvp === 'Hadir'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : guest.rsvp === 'Tidak Hadir'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-stone-700 font-medium">
                      {guest.tableNumber || '-'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {guest.phone ? (
                          <a
                            href={generateWhatsAppUrl(guest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            <span>WA</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-stone-400">-</span>
                        )}
                        <a
                          href={`/invite/${guest.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors"
                          title="Buka Undangan Digital Tamu"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() =>
                          onUpdateGuest(guest.id, { checkedIn: !guest.checkedIn })
                        }
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                          guest.checkedIn
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {guest.checkedIn ? 'Sudah Masuk' : 'Belum Hadir'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteGuest(guest.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Hapus"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Tamu Baru
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  Tambah Tamu Undangan
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Tamu / Pasangan / Keluarga *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. H. Rahmat & Istri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Pihak Pengundang
                  </label>
                  <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as GuestItem['side'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="joint">Bersama</option>
                    <option value="groom">Pihak Pria (Afif)</option>
                    <option value="bride">Pihak Wanita (Nabila)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Kategori Relasi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GuestItem['category'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Keluarga Inti">Keluarga Inti</option>
                    <option value="Keluarga Besar">Keluarga Besar</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Jumlah Pax (Kursi)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={pax}
                    onChange={(e) => setPax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    No. Meja / Seating
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: VIP 1 / Meja 4"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Status RSVP
                  </label>
                  <select
                    value={rsvp}
                    onChange={(e) => setRsvp(e.target.value as GuestItem['rsvp'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Catatan Khusus (Alergi / Permintaan)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Menginap di hotel dekat venue H-1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
