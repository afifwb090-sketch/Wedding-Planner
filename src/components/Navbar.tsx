import React, { useState } from 'react';
import { UserSession, WeddingRole, WeddingProfile } from '../types/wedding';
import {
  ChevronDown,
  Database,
  Menu,
  ShieldCheck,
  User,
  Sparkles,
  RefreshCw,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  profile: WeddingProfile;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenLogin: () => void;
  userSession: UserSession;
  onLogout: () => void;
  selectedSideFilter: WeddingRole;
  onSelectSideFilter: (side: WeddingRole) => void;
  weddingDate: string;
  onToggleMobileSidebar: () => void;
  onTriggerManualSync: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  profile,
  activeTab,
  onSelectTab,
  onOpenLogin,
  userSession,
  onLogout,
  selectedSideFilter,
  onSelectSideFilter,
  onToggleMobileSidebar,
  onTriggerManualSync,
  isSyncing,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#fcfbf9] border-b border-[#ece6db] px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & PROJECT AKTIF Dropdown */}
        <div className="flex items-center gap-3">
          {currentView === 'dashboard' && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 lg:hidden"
              aria-label="Buka Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {currentView === 'dashboard' ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b7238]">
                PROJECT AKTIF
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c6] bg-white text-xs font-semibold text-stone-900 shadow-xs">
                <span className="truncate max-w-[140px] sm:max-w-[220px]">
                  {profile.groomName} & {profile.brideName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </div>
            </div>
          ) : (
            <a href="#root" className="font-serif-luxury text-xl font-bold text-stone-900">
              SatuCerita Planner
            </a>
          )}
        </div>

        {/* Center: Segmented Event Switcher (Semua Acara | Acara Pihak Wanita | Acara Pihak Pria) */}
        {currentView === 'dashboard' && (
          <div className="hidden md:flex items-center gap-1 p-1 bg-[#f3ecdf] rounded-xl border border-[#e2d8c7] text-xs font-medium">
            <button
              onClick={() => onSelectSideFilter('joint')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSideFilter === 'joint'
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Acara
            </button>

            <button
              onClick={() => onSelectSideFilter('bride')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedSideFilter === 'bride'
                  ? 'bg-white text-rose-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-rose-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Acara Pihak Wanita</span>
            </button>

            <button
              onClick={() => onSelectSideFilter('groom')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedSideFilter === 'groom'
                  ? 'bg-white text-blue-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-blue-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Acara Pihak Pria</span>
            </button>
          </div>
        )}

        {/* Right: Backend & Supabase Button + ROLE LOGIN Profile Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView === 'dashboard' ? (
            <>
              {/* Backend & Supabase / Sheets Button */}
              <button
                onClick={() => onSelectTab?.('settings')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#ded5c6] bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 shadow-xs transition-colors"
                title="Konfigurasi Database Supabase & Cloudflare"
              >
                <Database className="w-3.5 h-3.5 text-[#8e6834]" />
                <span>Backend & Supabase</span>
              </button>

              {/* Multi-Device Sync Indicator button */}
              <button
                onClick={onTriggerManualSync}
                className="p-2 rounded-xl border border-[#ded5c6] bg-white hover:bg-stone-50 text-stone-600 shadow-xs transition-colors"
                title="Sinkronkan data antar device"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isSyncing ? 'animate-spin text-emerald-600' : 'text-stone-500'
                  }`}
                />
              </button>

              {/* Role Login Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#ded5c6] bg-white hover:bg-stone-50 shadow-xs text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#bf9b6b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {userSession.name.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#9b7238] block leading-none">
                      ROLE LOGIN
                    </span>
                    <span className="text-xs font-semibold text-stone-900 block leading-tight truncate max-w-[120px]">
                      {userSession.name || 'Admin WO'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-xs text-stone-700 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <div className="font-semibold text-stone-900">{userSession.name}</div>
                      <div className="text-[11px] text-stone-500 truncate">{userSession.email}</div>
                      <div className="text-[10px] font-bold text-amber-800 uppercase mt-0.5">
                        {userSession.role === 'groom'
                          ? 'Mempelai Pria'
                          : userSession.role === 'bride'
                          ? 'Mempelai Wanita'
                          : 'Admin Wedding Organizer'}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onSelectTab?.('invitation_gen');
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Generator Undangan</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectTab?.('settings');
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Database className="w-3.5 h-3.5 text-sky-700" />
                        <span>Pengaturan & Supabase</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setIsRoleDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
            >
              Masuk ke Planner
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
