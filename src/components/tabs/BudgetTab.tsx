import React, { useState } from 'react';
import {
  PaymentItem,
  VendorItem,
  WeddingProfile,
  WeddingRole,
} from '../../types/wedding';
import {
  CreditCard,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  X,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';

interface BudgetTabProps {
  profile: WeddingProfile;
  vendors: VendorItem[];
  payments: PaymentItem[];
  sideFilter: WeddingRole;
  onAddPayment: (payment: Omit<PaymentItem, 'id'>) => void;
  onUpdatePayment: (id: string, updates: Partial<PaymentItem>) => void;
  onDeletePayment: (id: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  profile,
  vendors,
  payments,
  sideFilter,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const [activeSide, setActiveSide] = useState<WeddingRole>(sideFilter);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  // Form State
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [customVendorName, setCustomVendorName] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(5000000);
  const [dueDate, setDueDate] = useState('2026-11-01');
  const [paymentSide, setPaymentSide] = useState<PaymentItem['paymentSide']>('joint');
  const [notes, setNotes] = useState('');

  // Calculations
  const totalVendorCost = vendors.reduce((sum, v) => sum + v.totalCost, 0);

  const groomPayments = payments.filter((p) => p.paymentSide === 'groom');
  const groomTotal = groomPayments.reduce((sum, p) => sum + p.amount, 0);
  const groomPaid = groomPayments
    .filter((p) => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const bridePayments = payments.filter((p) => p.paymentSide === 'bride');
  const brideTotal = bridePayments.reduce((sum, p) => sum + p.amount, 0);
  const bridePaid = bridePayments
    .filter((p) => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const jointPayments = payments.filter((p) => p.paymentSide === 'joint');
  const jointTotal = jointPayments.reduce((sum, p) => sum + p.amount, 0);
  const jointPaid = jointPayments
    .filter((p) => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaidAll = payments
    .filter((p) => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRemainingAll = payments
    .filter((p) => p.status !== 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVendor = vendors.find((v) => v.id === vendorId);
    const vendorName = selectedVendor ? selectedVendor.name : (customVendorName.trim() || 'Pos Pengeluaran');

    onAddPayment({
      vendorId: vendorId || `vnd-manual-${Date.now()}`,
      vendorName,
      title: title.trim() || 'Termin Pembayaran',
      amount: Number(amount) || 0,
      dueDate,
      status: 'Belum Bayar',
      paymentSide,
      notes: notes.trim(),
    });

    setTitle('');
    setCustomVendorName('');
    setNotes('');
    setIsAddPaymentModalOpen(false);
  };

  const generatePaymentReminderText = (p: PaymentItem) => {
    const text = `Halo, mengingatkan jadwal pembayaran pernikahan:\n\n*${p.vendorName}*\nKeterangan: ${p.title}\nNominal: ${formatRupiah(p.amount)}\nJatuh Tempo: ${p.dueDate}\nPenanggung Jawab: ${p.paymentSide === 'groom' ? 'Pihak Pria' : p.paymentSide === 'bride' ? 'Pihak Wanita' : 'Bersama'}\n\nMohon lakukan transfer sebelum tanggal jatuh tempo. Terima kasih!`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSide = activeSide === 'joint' || p.paymentSide === activeSide || p.paymentSide === 'joint';
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSide && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Overview & Budget Allocation Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Transparansi Finansial
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Manajemen Budget & Tracking Pembayaran Vendor
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pemisahan anggaran pihak pria, pihak wanita, serta tanggungan bersama dengan pengingat jatuh tempo.
            </p>
          </div>

          <button
            onClick={() => setIsAddPaymentModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Termin / Tagihan</span>
          </button>
        </div>

        {/* 3 Pillars of Financial Responsibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Pihak Pria */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Alokasi Pihak Pria
              </span>
              <span className="text-[11px] text-blue-700">Plafon: {formatRupiah(profile.groomBudgetLimit)}</span>
            </div>
            <div className="text-2xl font-serif-luxury font-bold text-blue-950 tabular-nums">
              {formatRupiah(groomTotal)}
            </div>
            <div className="space-y-1.5 pt-1 border-t border-blue-200/60 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sudah Dibayar:</span>
                <span className="font-semibold text-emerald-700 tabular-nums">{formatRupiah(groomPaid)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Sisa Kewajiban:</span>
                <span className="font-semibold text-amber-900 tabular-nums">{formatRupiah(groomTotal - groomPaid)}</span>
              </div>
            </div>
          </div>

          {/* Pihak Wanita */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Alokasi Pihak Wanita
              </span>
              <span className="text-[11px] text-rose-700">Plafon: {formatRupiah(profile.brideBudgetLimit)}</span>
            </div>
            <div className="text-2xl font-serif-luxury font-bold text-rose-950 tabular-nums">
              {formatRupiah(brideTotal)}
            </div>
            <div className="space-y-1.5 pt-1 border-t border-rose-200/60 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sudah Dibayar:</span>
                <span className="font-semibold text-emerald-700 tabular-nums">{formatRupiah(bridePaid)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Sisa Kewajiban:</span>
                <span className="font-semibold text-amber-900 tabular-nums">{formatRupiah(brideTotal - bridePaid)}</span>
              </div>
            </div>
          </div>

          {/* Alokasi Bersama */}
          <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                Tanggungan Bersama (50:50)
              </span>
              <span className="text-[11px] text-stone-600">Venue & Catering</span>
            </div>
            <div className="text-2xl font-serif-luxury font-bold text-stone-900 tabular-nums">
              {formatRupiah(jointTotal)}
            </div>
            <div className="space-y-1.5 pt-1 border-t border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sudah Dibayar:</span>
                <span className="font-semibold text-emerald-700 tabular-nums">{formatRupiah(jointPaid)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Sisa Kewajiban:</span>
                <span className="font-semibold text-amber-900 tabular-nums">{formatRupiah(jointTotal - jointPaid)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Filter Pihak:</span>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setActiveSide('joint')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'joint'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Termin
              </button>
              <button
                onClick={() => setActiveSide('groom')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'groom'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-blue-700'
                }`}
              >
                Kewajiban Pria
              </button>
              <button
                onClick={() => setActiveSide('bride')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeSide === 'bride'
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                Kewajiban Wanita
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 border border-stone-200 rounded-lg bg-white"
            >
              <option value="all">Semua Status Bayar</option>
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Jatuh Tempo">Jatuh Tempo</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Tracker Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Vendor & Keterangan</th>
                <th className="py-3 px-3">Penanggung Jawab</th>
                <th className="py-3 px-3">Nominal (Rp)</th>
                <th className="py-3 px-3">Jatuh Tempo</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Metode / Catatan</th>
                <th className="py-3 px-3 text-center">Pengingat WA</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 space-y-2">
                    <CreditCard className="w-8 h-8 text-stone-300 mx-auto" />
                    <div className="text-xs font-semibold text-stone-700">Belum Ada Termin Pembayaran Terdaftar</div>
                    <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                      Data dummy telah dihapus. Klik tombol "+ Tambah Pembayaran" untuk mulai mengelola anggaran dan termin vendor secara manual.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{p.vendorName}</div>
                      <div className="text-[11px] text-stone-500">{p.title}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.paymentSide === 'groom'
                            ? 'bg-blue-100 text-blue-800'
                            : p.paymentSide === 'bride'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {p.paymentSide === 'groom'
                          ? 'Pria'
                          : p.paymentSide === 'bride'
                          ? 'Wanita'
                          : 'Bersama'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-stone-900 tabular-nums">
                      {formatRupiah(p.amount)}
                    </td>

                    <td className="py-3.5 px-3 tabular-nums font-medium text-stone-700">
                      {p.dueDate}
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          onUpdatePayment(p.id, {
                            status: e.target.value as PaymentItem['status'],
                            paidDate: e.target.value === 'Lunas' ? new Date().toISOString().split('T')[0] : undefined,
                          })
                        }
                        className={`text-[11px] font-semibold py-1 px-2.5 rounded-lg border focus:outline-none ${
                          p.status === 'Lunas'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : p.status === 'Jatuh Tempo'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="Belum Bayar">Belum Bayar</option>
                        <option value="Jatuh Tempo">Jatuh Tempo</option>
                        <option value="Lunas">Lunas</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 text-stone-600">
                      {p.notes || p.method || '-'}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {p.status !== 'Lunas' && (
                        <a
                          href={generatePaymentReminderText(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                          title="Kirim pengingat pembayaran ke WhatsApp"
                        >
                          <Send className="w-3 h-3 text-amber-700" />
                          <span>Ingatkan</span>
                        </a>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeletePayment(p.id)}
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

      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Termin Baru
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  Tambah Jadwal Pembayaran
                </h3>
              </div>
              <button
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Pilih Vendor / Pos Pengeluaran *
                </label>
                {vendors.length > 0 ? (
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="">-- Pilih Vendor Terdaftar --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gedung, Catering, Dekorasi, dsb."
                    value={customVendorName}
                    onChange={(e) => setCustomVendorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Keterangan Termin *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: DP 30% / Termin 2 / Pelunasan H-7"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nominal Pembayaran (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={100000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Tanggal Jatuh Tempo *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Penanggung Jawab Pembayaran
                </label>
                <select
                  value={paymentSide}
                  onChange={(e) => setPaymentSide(e.target.value as PaymentItem['paymentSide'])}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                >
                  <option value="joint">Bersama (50:50 / Rekening Bersama)</option>
                  <option value="groom">Pihak Pria (Afif)</option>
                  <option value="bride">Pihak Wanita (Nabila)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Catatan / Rekening Tujuan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rekening BCA 8820xxx a.n Vendor"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
