import {
  WeddingProfile,
  ChecklistItem,
  GuestItem,
  VendorItem,
  PaymentItem,
  RundownItem,
  CoordinationNote,
  InvitationWish,
  DigitalInvitationConfig,
  SupabaseSettings,
  UserSession
} from '../types/wedding';

// Fresh storage key prefix so all legacy dummy data is completely cleared
const STORAGE_KEY_PREFIX = 'satucerita_planner_v3_';

export function clearAllPlannerData(): void {
  try {
    const keys = [
      'profile',
      'checklists',
      'guests',
      'vendors',
      'payments',
      'rundowns',
      'coordination_notes',
      'invitation_wishes',
      'user_session',
    ];
    // Clear legacy keys and current keys
    keys.forEach((k) => {
      localStorage.removeItem(STORAGE_KEY_PREFIX + k);
      localStorage.removeItem('satucerita_planner_' + k);
      localStorage.removeItem('janjisuci_wedding_' + k);
    });
  } catch (err) {
    console.error('Error clearing storage:', err);
  }
}

export const initialProfile: WeddingProfile = {
  id: 'wedding-afif-ayu-2027',
  groomName: 'Afif Khoiruddin',
  groomNickname: 'Afif',
  groomFamily: '',
  brideName: 'Ayu May Lestari',
  brideNickname: 'Ayu',
  brideFamily: '',
  conceptTheme: 'Modern Elegance',
  roomCode: 'AFIF-AYU-2027',
  // Event Pihak Wanita
  brideEventTitle: 'Akad & Resepsi Pihak Ayu May Lestari',
  brideEventDate: '2027-06-20',
  brideEventTime: '08:00 - 14:00 WIB',
  brideEventLocation: '',
  brideBudgetLimit: 0,
  brideTargetGuests: 0,
  // Event Pihak Pria
  groomEventTitle: 'Ngunduh Mantu Pihak Afif Khoiruddin',
  groomEventDate: '2027-06-27',
  groomEventTime: '11:00 - 15:00 WIB',
  groomEventLocation: '',
  groomBudgetLimit: 0,
  groomTargetGuests: 0,
  // General
  weddingDate: '2027-06-20',
  weddingTime: '08:00',
  receptionTime: '11:00',
  venueName: '',
  venueCity: '',
  venueAddress: '',
  totalBudgetLimit: 0,
  jointBudgetLimit: 0,
  targetGuestsCount: 0,
  storyQuote: 'Dua keluarga, satu niat suci melangkah menuju ridho-Nya.',
};

export const initialInvitationConfig: DigitalInvitationConfig = {
  theme: 'burgundy_sundanese',
  brideBankAccount: { bank: 'BCA', number: '', name: 'Ayu May Lestari' },
  groomBankAccount: { bank: 'Mandiri', number: '', name: 'Afif Khoiruddin' },
  mapsUrlBride: '',
  mapsUrlGroom: '',
  musicAutoPlay: true,
  musicTitle: 'Gamelan Degung & Kecapi Suling Sunda',
};

// Clean initial states so the user can fill data manually
export const initialChecklists: ChecklistItem[] = [];
export const initialGuests: GuestItem[] = [];
export const initialVendors: VendorItem[] = [];
export const initialPayments: PaymentItem[] = [];
export const initialRundowns: RundownItem[] = [];
export const initialNotes: CoordinationNote[] = [];
export const initialWishes: InvitationWish[] = [];

// Helper functions for reading & writing to localStorage
export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

export function saveData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}
