export type WeddingRole = 'groom' | 'bride' | 'joint' | 'planner';

export interface WeddingProfile {
  id: string;
  groomName: string;
  groomNickname: string;
  groomFamily: string;
  brideName: string;
  brideNickname: string;
  brideFamily: string;
  conceptTheme: string;
  roomCode: string;
  // Event Pihak Wanita (Akad & Resepsi)
  brideEventTitle: string;
  brideEventDate: string; // YYYY-MM-DD
  brideEventTime: string; // e.g. "08:00 - 14:00 WIB"
  brideEventLocation: string;
  brideBudgetLimit: number;
  brideTargetGuests: number;
  // Event Pihak Pria (Ngunduh Mantu)
  groomEventTitle: string;
  groomEventDate: string; // YYYY-MM-DD
  groomEventTime: string; // e.g. "11:00 - 15:00 WIB"
  groomEventLocation: string;
  groomBudgetLimit: number;
  groomTargetGuests: number;
  // General
  weddingDate: string; // Primary reference date
  weddingTime: string;
  receptionTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  totalBudgetLimit: number;
  jointBudgetLimit: number;
  targetGuestsCount: number;
  storyQuote: string;
}

export interface InvitationWish {
  id: string;
  guestName: string;
  message: string;
  attendance: 'Hadir' | 'Tidak Hadir' | 'Ragu-ragu';
  pax: number;
  createdAt: string;
}

export type InvitationTheme = 'burgundy_sundanese' | 'blue_javanese';

export interface DigitalInvitationConfig {
  theme: InvitationTheme;
  brideBankAccount: { bank: string; number: string; name: string };
  groomBankAccount: { bank: string; number: string; name: string };
  mapsUrlBride: string;
  mapsUrlGroom: string;
  musicAutoPlay: boolean;
  heroPhotoUrl?: string;
  couplePhotoUrl?: string;
  customMusicUrl?: string;
  musicTitle?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  milestone: 'H-180' | 'H-90' | 'H-30' | 'H-14' | 'H-7' | 'Hari H';
  side: 'groom' | 'bride' | 'joint';
  assignedTo: string;
  completed: boolean;
  dueDate: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  category: string;
  notes: string;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface GuestItem {
  id: string;
  name: string;
  side: 'groom' | 'bride' | 'joint';
  category: 'Keluarga Inti' | 'Keluarga Besar' | 'Sahabat' | 'Rekan Kerja' | 'VIP' | 'Lainnya';
  pax: number;
  rsvp: 'Hadir' | 'Menunggu' | 'Tidak Hadir';
  tableNumber: string;
  phone: string;
  invitationSent: boolean;
  checkedIn: boolean;
  notes: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: 'Venue' | 'Catering' | 'Dekorasi' | 'MUA & Busana' | 'Dokumentasi' | 'Sound & Band' | 'MC & WO' | 'Undangan & Souvenir' | 'Seserahan & Mas Kawin' | 'Lainnya';
  contactPerson: string;
  phone: string;
  instagram?: string;
  totalCost: number;
  paidAmount: number;
  status: 'Dikonfirmasi' | 'Proses Nego' | 'Selesai';
  notes: string;
  responsibleSide: 'groom' | 'bride' | 'joint';
}

export interface PaymentItem {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Lunas' | 'Jatuh Tempo' | 'Belum Bayar';
  paymentSide: 'groom' | 'bride' | 'joint';
  method?: string;
  notes?: string;
}

export interface RundownItem {
  id: string;
  session: 'Akad Nikah' | 'Temu Manten & Adat' | 'Resepsi' | 'Persiapan';
  timeStart: string;
  timeEnd: string;
  title: string;
  description: string;
  location: string;
  pic: string;
  picPhone: string;
  picSide: 'groom' | 'bride' | 'joint' | 'wo';
  vendorInvolved: string;
  audioVisualNotes: string;
  completed: boolean;
}

export interface CoordinationNote {
  id: string;
  vendorId?: string;
  vendorName?: string;
  authorName: string;
  authorSide: 'groom' | 'bride' | 'joint';
  content: string;
  createdAt: string;
  tag: 'Penting' | 'Revisi' | 'Konfirmasi' | 'Pembayaran' | 'Umum';
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  role: 'groom' | 'bride' | 'planner';
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  isConnected: boolean;
  autoSync: boolean;
  lastSyncedAt?: string;
}
