import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Users,
  Building2,
  Clock,
  FolderOpen,
  DollarSign,
  ShieldCheck,
  Heart,
  Sparkles,
  Mail,
  X,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  tasksCount: { done: number; total: number };
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  tasksCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'rundown',
      label: 'Wedding Events (2 Sisi)',
      icon: CalendarDays,
      badge: 'Wanita & Pria',
      badgeColor: 'bg-stone-200/80 text-stone-700',
    },
    {
      id: 'budget',
      label: 'Dual Budget Management',
      icon: CreditCard,
    },
    {
      id: 'checklist',
      label: 'Checklist Persiapan',
      icon: CheckCircle2,
      badge: `${tasksCount.done}/${tasksCount.total}`,
      badgeColor: 'bg-stone-200/80 text-stone-700',
    },
    {
      id: 'guests',
      label: 'Guest & RSVP',
      icon: Users,
    },
    {
      id: 'invitation_gen',
      label: 'Generator Undangan Digital',
      icon: Mail,
      badge: 'Baru',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'vendors',
      label: 'Vendor & Booking',
      icon: Building2,
    },
    {
      id: 'timeline',
      label: 'Timeline & Rundown H',
      icon: Clock,
    },
    {
      id: 'documents',
      label: 'Dokumen & Google Drive / Supabase',
      icon: FolderOpen,
    },
    {
      id: 'payments',
      label: 'Payment Tracking',
      icon: DollarSign,
    },
    {
      id: 'settings',
      label: 'Admin WO Panel',
      icon: ShieldCheck,
      badge: 'WO Only',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  const handleItemClick = (id: string) => {
    // Map timeline -> rundown, documents -> settings, payments -> budget
    if (id === 'timeline') onSelectTab('rundown');
    else if (id === 'documents') onSelectTab('settings');
    else if (id === 'payments') onSelectTab('budget');
    else onSelectTab(id);
    onCloseMobile();
  };

  const getIsActive = (id: string) => {
    if (id === 'timeline') return activeTab === 'rundown';
    if (id === 'documents') return activeTab === 'settings';
    if (id === 'payments') return activeTab === 'budget';
    return activeTab === id;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#fcfbf9] border-r border-[#ece6db] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#ece6db] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#bf9b6b] text-white flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-lg font-bold text-stone-900 leading-tight">
                  SatuCerita Planner
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0e7d8] text-[#8e6834] uppercase tracking-wider">
                  DUAL-EVENT
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                Wedding Planner Management System
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 text-stone-400 hover:text-stone-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b7238]">
            NAVIGASI MODUL
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = getIsActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#f0e7d8] text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-600 hover:bg-[#f5efe4] hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-[#8e6834]' : 'text-stone-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                      item.badgeColor || 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info: Room Code Sync */}
        <div className="p-4 border-t border-[#ece6db] bg-[#f8f5ee] text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center justify-between text-stone-700 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sinkron Multi-Device
            </span>
            <span className="font-mono text-[10px] text-[#8e6834] font-bold bg-white px-2 py-0.5 rounded border border-[#e0d6c4]">
              AFIF-AYU
            </span>
          </div>
          <p className="text-[10px] text-stone-400">
            Perubahan otomatis tersinkronkan antar laptop & HP.
          </p>
        </div>
      </aside>
    </>
  );
};
