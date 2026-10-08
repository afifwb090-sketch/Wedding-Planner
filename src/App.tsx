import React, { useState, useEffect } from 'react';
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
  WeddingRole,
  UserSession,
  SupabaseSettings,
} from './types/wedding';
import {
  initialProfile,
  initialChecklists,
  initialGuests,
  initialVendors,
  initialPayments,
  initialRundowns,
  initialNotes,
  initialWishes,
  initialInvitationConfig,
  loadData,
  saveData,
} from './services/storage';
import {
  getSupabaseSettings,
  saveSupabaseSettings,
} from './services/supabase';
import {
  initSupabaseRealtime,
  broadcastWeddingUpdate,
  subscribeWeddingUpdates,
  SyncPayload,
} from './services/syncEngine';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DigitalInvitationPage } from './components/DigitalInvitationPage';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ChecklistTab } from './components/tabs/ChecklistTab';
import { GuestTab } from './components/tabs/GuestTab';
import { BudgetTab } from './components/tabs/BudgetTab';
import { VendorTab } from './components/tabs/VendorTab';
import { RundownTab } from './components/tabs/RundownTab';
import { InvitationGeneratorTab } from './components/tabs/InvitationGeneratorTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { Check, RefreshCw, X } from 'lucide-react';

export default function App() {
  // Check URL for direct digital invitation route: /invite/:slug or ?invite=:slug or #invite/:slug
  const [directInviteSlug, setDirectInviteSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/invite/')) {
        return path.replace('/invite/', '').trim();
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('invite')) {
        return params.get('invite')!.trim();
      }
      if (window.location.hash.startsWith('#/invite/')) {
        return window.location.hash.replace('#/invite/', '').trim();
      }
    }
    return null;
  });

  // Navigation & Session State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedSideFilter, setSelectedSideFilter] = useState<WeddingRole>('joint');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync state & toast notification
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Preview invitation modal state
  const [previewInviteSlug, setPreviewInviteSlug] = useState<string | null>(null);

  const [userSession, setUserSession] = useState<UserSession>(() =>
    loadData<UserSession>('user_session', {
      isLoggedIn: false,
      name: 'Admin Wedding Organizer',
      email: 'admin@weddingorganizer.id',
      role: 'planner',
    })
  );

  // Core Data States
  const [profile, setProfile] = useState<WeddingProfile>(() =>
    loadData<WeddingProfile>('profile', initialProfile)
  );

  const [checklists, setChecklists] = useState<ChecklistItem[]>(() =>
    loadData<ChecklistItem[]>('checklists', initialChecklists)
  );

  const [guests, setGuests] = useState<GuestItem[]>(() =>
    loadData<GuestItem[]>('guests', initialGuests)
  );

  const [vendors, setVendors] = useState<VendorItem[]>(() =>
    loadData<VendorItem[]>('vendors', initialVendors)
  );

  const [payments, setPayments] = useState<PaymentItem[]>(() =>
    loadData<PaymentItem[]>('payments', initialPayments)
  );

  const [rundowns, setRundowns] = useState<RundownItem[]>(() =>
    loadData<RundownItem[]>('rundowns', initialRundowns)
  );

  const [notes, setNotes] = useState<CoordinationNote[]>(() =>
    loadData<CoordinationNote[]>('coordination_notes', initialNotes)
  );

  const [wishes, setWishes] = useState<InvitationWish[]>(() =>
    loadData<InvitationWish[]>('invitation_wishes', initialWishes)
  );

  const [invitationConfig, setInvitationConfig] = useState<DigitalInvitationConfig>(() =>
    loadData<DigitalInvitationConfig>('invitation_config', initialInvitationConfig)
  );

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseSettings>(() =>
    getSupabaseSettings()
  );

  // Save states locally
  useEffect(() => { saveData('profile', profile); }, [profile]);
  useEffect(() => { saveData('checklists', checklists); }, [checklists]);
  useEffect(() => { saveData('guests', guests); }, [guests]);
  useEffect(() => { saveData('vendors', vendors); }, [vendors]);
  useEffect(() => { saveData('payments', payments); }, [payments]);
  useEffect(() => { saveData('rundowns', rundowns); }, [rundowns]);
  useEffect(() => { saveData('coordination_notes', notes); }, [notes]);
  useEffect(() => { saveData('invitation_wishes', wishes); }, [wishes]);
  useEffect(() => { saveData('invitation_config', invitationConfig); }, [invitationConfig]);
  useEffect(() => { saveData('user_session', userSession); }, [userSession]);

  // Set up real-time multi-device sync
  useEffect(() => {
    const room = profile.roomCode || 'AFIF-AYU-2027';

    // Init Supabase Realtime if credentials exist
    initSupabaseRealtime(room, handleRemoteSync);

    // Subscribe to cross-tab / cross-device broadcasts
    const unsubscribe = subscribeWeddingUpdates(handleRemoteSync);

    return () => {
      unsubscribe();
    };
  }, [profile.roomCode]);

  const handleRemoteSync = (payload: SyncPayload) => {
    setIsSyncing(true);
    if (payload.type === 'FULL_SYNC' && payload.data) {
      if (payload.data.profile) setProfile(payload.data.profile);
      if (payload.data.checklists) setChecklists(payload.data.checklists);
      if (payload.data.guests) setGuests(payload.data.guests);
      if (payload.data.vendors) setVendors(payload.data.vendors);
      if (payload.data.payments) setPayments(payload.data.payments);
      if (payload.data.rundowns) setRundowns(payload.data.rundowns);
      if (payload.data.wishes) setWishes(payload.data.wishes);
    } else if (payload.type === 'CHECKLIST_UPDATE' && payload.data) {
      setChecklists(payload.data);
    } else if (payload.type === 'GUEST_UPDATE' && payload.data) {
      setGuests(payload.data);
    } else if (payload.type === 'BUDGET_UPDATE' && payload.data) {
      setPayments(payload.data);
    } else if (payload.type === 'VENDOR_UPDATE' && payload.data) {
      setVendors(payload.data);
    } else if (payload.type === 'WISH_ADDED' && payload.data) {
      setWishes((prev) => [payload.data, ...prev]);
    } else if (payload.type === 'PROFILE_UPDATE' && payload.data) {
      setProfile(payload.data);
    }

    setSyncToastMessage('Data disinkronkan dari perangkat lain!');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToastMessage(null);
    }, 2500);
  };

  const triggerManualSync = () => {
    setIsSyncing(true);
    broadcastWeddingUpdate(profile.roomCode, 'FULL_SYNC', {
      profile,
      checklists,
      guests,
      vendors,
      payments,
      rundowns,
      wishes,
    });
    setSyncToastMessage('Sinkronisasi disiarkan ke semua perangkat!');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToastMessage(null);
    }, 2000);
  };

  // Auth handlers
  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    if (session.role === 'groom') {
      setSelectedSideFilter('groom');
    } else if (session.role === 'bride') {
      setSelectedSideFilter('bride');
    } else {
      setSelectedSideFilter('joint');
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserSession({
      isLoggedIn: false,
      name: '',
      email: '',
      role: 'planner',
    });
    setCurrentView('landing');
  };

  const handleQuickDemo = (role: 'groom' | 'bride' | 'planner') => {
    const session: UserSession = {
      isLoggedIn: true,
      name: role === 'groom' ? 'Afif Khoiruddin' : role === 'bride' ? 'Ayu May Lestari' : 'Admin Wedding Organizer',
      email: `${role}@eternalplanner.id`,
      role,
    };
    handleLoginSuccess(session);
  };

  // Checklist handlers
  const handleToggleChecklist = (id: string) => {
    const updated = checklists.map((item) =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
            lastUpdatedBy: `${userSession.name} (${userSession.role === 'groom' ? 'Pria' : userSession.role === 'bride' ? 'Wanita' : 'WO'})`,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : item
    );
    setChecklists(updated);
    broadcastWeddingUpdate(profile.roomCode, 'CHECKLIST_UPDATE', updated);
  };

  const handleAddChecklist = (
    item: Omit<ChecklistItem, 'id' | 'updatedAt' | 'lastUpdatedBy'>
  ) => {
    const newItem: ChecklistItem = {
      ...item,
      id: `chk-${Date.now()}`,
      lastUpdatedBy: userSession.name,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...checklists];
    setChecklists(updated);
    broadcastWeddingUpdate(profile.roomCode, 'CHECKLIST_UPDATE', updated);
  };

  const handleDeleteChecklist = (id: string) => {
    const updated = checklists.filter((item) => item.id !== id);
    setChecklists(updated);
    broadcastWeddingUpdate(profile.roomCode, 'CHECKLIST_UPDATE', updated);
  };

  // Guest handlers
  const handleAddGuest = (guest: Omit<GuestItem, 'id'>) => {
    const newGuest: GuestItem = {
      ...guest,
      id: `gst-${Date.now()}`,
    };
    const updated = [newGuest, ...guests];
    setGuests(updated);
    broadcastWeddingUpdate(profile.roomCode, 'GUEST_UPDATE', updated);
  };

  const handleUpdateGuest = (id: string, updates: Partial<GuestItem>) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGuests(updated);
    broadcastWeddingUpdate(profile.roomCode, 'GUEST_UPDATE', updated);
  };

  const handleDeleteGuest = (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    broadcastWeddingUpdate(profile.roomCode, 'GUEST_UPDATE', updated);
  };

  // Budget & Payment handlers
  const handleAddPayment = (payment: Omit<PaymentItem, 'id'>) => {
    const newPayment: PaymentItem = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    broadcastWeddingUpdate(profile.roomCode, 'BUDGET_UPDATE', updated);
  };

  const handleUpdatePayment = (id: string, updates: Partial<PaymentItem>) => {
    const updated = payments.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPayments(updated);
    broadcastWeddingUpdate(profile.roomCode, 'BUDGET_UPDATE', updated);
  };

  const handleDeletePayment = (id: string) => {
    const updated = payments.filter((p) => p.id !== id);
    setPayments(updated);
    broadcastWeddingUpdate(profile.roomCode, 'BUDGET_UPDATE', updated);
  };

  // Vendor handlers
  const handleAddVendor = (vendor: Omit<VendorItem, 'id'>) => {
    const newVendor: VendorItem = {
      ...vendor,
      id: `vnd-${Date.now()}`,
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    broadcastWeddingUpdate(profile.roomCode, 'VENDOR_UPDATE', updated);
  };

  const handleDeleteVendor = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    setVendors(updated);
    broadcastWeddingUpdate(profile.roomCode, 'VENDOR_UPDATE', updated);
  };

  // Note handlers
  const handleAddNote = (note: Omit<CoordinationNote, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNote: CoordinationNote = {
      ...note,
      id: `nte-${Date.now()}`,
      createdAt: formatted,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Rundown handlers
  const handleAddRundown = (item: Omit<RundownItem, 'id'>) => {
    const newItem: RundownItem = {
      ...item,
      id: `rdn-${Date.now()}`,
    };
    setRundowns((prev) => [...prev, newItem]);
  };

  const handleUpdateRundown = (id: string, updates: Partial<RundownItem>) => {
    setRundowns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleDeleteRundown = (id: string) => {
    setRundowns((prev) => prev.filter((r) => r.id !== id));
  };

  // Invitation wish handler
  const handleAddWish = (wish: Omit<InvitationWish, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newWish: InvitationWish = {
      ...wish,
      id: `wsh-${Date.now()}`,
      createdAt: formatted,
    };
    setWishes((prev) => [newWish, ...prev]);

    // Also update guest's RSVP if name matches
    const matchedGuest = guests.find((g) => g.name.toLowerCase() === wish.guestName.toLowerCase());
    if (matchedGuest) {
      handleUpdateGuest(matchedGuest.id, {
        rsvp: wish.attendance === 'Hadir' ? 'Hadir' : 'Tidak Hadir',
        pax: wish.pax,
      });
    }

    broadcastWeddingUpdate(profile.roomCode, 'WISH_ADDED', newWish);
  };

  // Profile and Settings handlers
  const handleUpdateProfile = (newProfile: WeddingProfile) => {
    setProfile(newProfile);
    broadcastWeddingUpdate(newProfile.roomCode, 'PROFILE_UPDATE', newProfile);
  };

  const handleUpdateSupabaseConfig = (newConfig: SupabaseSettings) => {
    setSupabaseConfig(newConfig);
    saveSupabaseSettings(newConfig);
  };

  const handleExportFullData = () => {
    const fullData = {
      profile,
      checklists,
      guests,
      vendors,
      payments,
      rundowns,
      coordination_notes: notes,
      wishes,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SatuCerita_Backup_${profile.groomNickname}_${profile.brideNickname}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetToDemoData = () => {
    setProfile(initialProfile);
    setChecklists([]);
    setGuests([]);
    setVendors([]);
    setPayments([]);
    setRundowns([]);
    setNotes([]);
    setWishes([]);
  };

  // 1. Direct Digital Invitation URL View: If guest visits /invite/:slug directly
  if (directInviteSlug) {
    return (
      <DigitalInvitationPage
        guestSlug={directInviteSlug}
        profile={profile}
        invitationConfig={invitationConfig}
        wishes={wishes}
        onAddWish={handleAddWish}
        onBackToPlanner={() => {
          setDirectInviteSlug(null);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans-clean flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification for Cross-Device Sync */}
      {syncToastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{syncToastMessage}</span>
        </div>
      )}

      {/* Main Switcher: Landing Page vs Dashboard */}
      {currentView === 'landing' ? (
        <>
          <Navbar
            currentView="landing"
            profile={profile}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            userSession={userSession}
            onLogout={handleLogout}
            selectedSideFilter={selectedSideFilter}
            onSelectSideFilter={setSelectedSideFilter}
            weddingDate={profile.weddingDate}
            onToggleMobileSidebar={() => {}}
            onTriggerManualSync={triggerManualSync}
            isSyncing={isSyncing}
          />
          <main className="flex-1">
            <LandingPage
              profile={profile}
              onOpenLogin={() => setIsAuthModalOpen(true)}
              onQuickDemo={handleQuickDemo}
            />
          </main>
        </>
      ) : (
        /* Dashboard Mode with Left Sidebar Layout (from screenshot) */
        <div className="flex-1 flex">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            tasksCount={{
              done: checklists.filter((c) => c.completed).length,
              total: checklists.length,
            }}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
            {/* Top Bar with PROJECT AKTIF dropdown & Role login button */}
            <Navbar
              currentView="dashboard"
              profile={profile}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenLogin={() => setIsAuthModalOpen(true)}
              userSession={userSession}
              onLogout={handleLogout}
              selectedSideFilter={selectedSideFilter}
              onSelectSideFilter={setSelectedSideFilter}
              weddingDate={profile.weddingDate}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
              onTriggerManualSync={triggerManualSync}
              isSyncing={isSyncing}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* Tab: Main Dashboard */}
              {activeTab === 'overview' && (
                <OverviewTab
                  profile={profile}
                  checklists={checklists}
                  guests={guests}
                  vendors={vendors}
                  payments={payments}
                  sideFilter={selectedSideFilter}
                  onNavigateTab={setActiveTab}
                  onToggleChecklist={handleToggleChecklist}
                />
              )}

              {/* Tab: Checklist Persiapan */}
              {activeTab === 'checklist' && (
                <ChecklistTab
                  checklists={checklists}
                  sideFilter={selectedSideFilter}
                  onToggleChecklist={handleToggleChecklist}
                  onAddChecklist={handleAddChecklist}
                  onDeleteChecklist={handleDeleteChecklist}
                />
              )}

              {/* Tab: Guest & RSVP */}
              {activeTab === 'guests' && (
                <GuestTab
                  guests={guests}
                  profile={profile}
                  sideFilter={selectedSideFilter}
                  onAddGuest={handleAddGuest}
                  onUpdateGuest={handleUpdateGuest}
                  onDeleteGuest={handleDeleteGuest}
                />
              )}

              {/* Tab: Generator Undangan Digital */}
              {activeTab === 'invitation_gen' && (
                <InvitationGeneratorTab
                  profile={profile}
                  guests={guests}
                  invitationConfig={invitationConfig}
                  wishes={wishes}
                  onUpdateConfig={setInvitationConfig}
                  onPreviewInvitation={(slug) => setPreviewInviteSlug(slug)}
                />
              )}

              {/* Tab: Dual Budget Management */}
              {activeTab === 'budget' && (
                <BudgetTab
                  profile={profile}
                  vendors={vendors}
                  payments={payments}
                  sideFilter={selectedSideFilter}
                  onAddPayment={handleAddPayment}
                  onUpdatePayment={handleUpdatePayment}
                  onDeletePayment={handleDeletePayment}
                />
              )}

              {/* Tab: Vendor & Booking */}
              {activeTab === 'vendors' && (
                <VendorTab
                  vendors={vendors}
                  notes={notes}
                  sideFilter={selectedSideFilter}
                  userSession={userSession}
                  onAddVendor={handleAddVendor}
                  onAddNote={handleAddNote}
                  onDeleteVendor={handleDeleteVendor}
                  onDeleteNote={handleDeleteNote}
                />
              )}

              {/* Tab: Wedding Events & Rundown */}
              {activeTab === 'rundown' && (
                <RundownTab
                  rundowns={rundowns}
                  profile={profile}
                  sideFilter={selectedSideFilter}
                  onAddRundown={handleAddRundown}
                  onUpdateRundown={handleUpdateRundown}
                  onDeleteRundown={handleDeleteRundown}
                />
              )}

              {/* Tab: Admin WO Panel & Settings */}
              {activeTab === 'settings' && (
                <SettingsTab
                  profile={profile}
                  supabaseConfig={supabaseConfig}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateSupabaseConfig={handleUpdateSupabaseConfig}
                  onExportFullData={handleExportFullData}
                  onResetToDemoData={handleResetToDemoData}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Login / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Live Invitation Preview Modal */}
      {previewInviteSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setPreviewInviteSlug(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 text-stone-700 hover:bg-stone-100 shadow-md border border-stone-200"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <DigitalInvitationPage
              guestSlug={previewInviteSlug}
              profile={profile}
              invitationConfig={invitationConfig}
              wishes={wishes}
              onAddWish={handleAddWish}
              isPreviewModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
