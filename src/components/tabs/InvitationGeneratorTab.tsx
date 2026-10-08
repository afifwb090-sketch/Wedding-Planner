import React, { useState, useRef } from 'react';
import {
  WeddingProfile,
  GuestItem,
  DigitalInvitationConfig,
  InvitationWish,
  InvitationTheme,
} from '../../types/wedding';
import {
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Send,
  Eye,
  Settings,
  Users,
  Heart,
  QrCode,
  Share2,
  Upload,
  Music,
  Image as ImageIcon,
  Play,
  Pause,
  Trash2,
  Palette,
} from 'lucide-react';

interface InvitationGeneratorTabProps {
  profile: WeddingProfile;
  guests: GuestItem[];
  invitationConfig: DigitalInvitationConfig;
  wishes: InvitationWish[];
  onUpdateConfig: (config: DigitalInvitationConfig) => void;
  onPreviewInvitation: (guestSlug: string) => void;
}

export const InvitationGeneratorTab: React.FC<InvitationGeneratorTabProps> = ({
  profile,
  guests,
  invitationConfig,
  wishes,
  onUpdateConfig,
  onPreviewInvitation,
}) => {
  const [selectedGuestName, setSelectedGuestName] = useState('');
  const [customGuestInput, setCustomGuestInput] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'links' | 'theme' | 'media' | 'settings' | 'wishes'>('theme');

  // Config form state
  const [cfg, setCfg] = useState<DigitalInvitationConfig>(invitationConfig);
  const [savedNotice, setSavedNotice] = useState(false);

  // Audio testing preview state
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.satucerita.id';

  const makeSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const activeGuestName = customGuestInput.trim() || selectedGuestName.trim() || 'Tamu Kehormatan';
  const activeSlug = makeSlug(activeGuestName);
  const generatedUrl = `${baseUrl}/invite/${activeSlug}`;

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSaveConfig = (newCfg: DigitalInvitationConfig) => {
    setCfg(newCfg);
    onUpdateConfig(newCfg);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Image upload handler (converts file to base64)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroPhotoUrl' | 'couplePhotoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = { ...cfg, [field]: base64 };
      handleSaveConfig(updated);
    };
    reader.readAsDataURL(file);
  };

  // Audio upload handler (converts file to base64)
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file musik maksimal 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated: DigitalInvitationConfig = {
        ...cfg,
        customMusicUrl: base64,
        musicTitle: file.name.replace(/\.[^/.]+$/, ''),
      };
      handleSaveConfig(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTestAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingTestAudio) {
      audioRef.current.pause();
      setIsPlayingTestAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingTestAudio(true);
    }
  };

  const generateWhatsAppMessage = (name: string, url: string) => {
    const text = `Assalamu'alaikum Wr. Wb. / Salam Sejahtera,\n\nKepada Yth. *${name}*,\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam momen sakral akad & resepsi pernikahan kami:\n\n*${profile.groomName} & ${profile.brideName}*\n\nBerikut tautan undangan digital resmi Anda:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu. Terima kasih.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Generator Undangan Digital
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Kustomisasi Tema, Foto & Tautan Undangan
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Hasilkan tautan personal <code className="text-amber-800 font-mono font-bold">domain/invite/nama-tamu</code> dengan 2 pilihan tema adat nusantara, upload foto, dan musik.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('theme')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'theme'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-700" />
              <span>Tema Adat</span>
            </button>
            <button
              onClick={() => setActiveSubTab('media')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'media'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-amber-700" />
              <span>Upload Foto & Musik</span>
            </button>
            <button
              onClick={() => setActiveSubTab('links')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'links'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tautan Tamu
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'settings'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Rekening & Peta
            </button>
            <button
              onClick={() => setActiveSubTab('wishes')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'wishes'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Doa Tamu ({wishes.length})
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan tema dan media undangan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: TEMA ADAT (Traditional Burgundy Sundanese & Traditional Blue Javanese) */}
      {activeSubTab === 'theme' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Pilih Tema Desain Undangan Digital
              </h3>
              <p className="text-xs text-stone-500">
                Tersedia 2 tema adat mewah dengan ornamen tradisional, palet warna otentik, dan tipografi elegan.
              </p>
            </div>
            <button
              onClick={() => onPreviewInvitation(activeSlug)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Tema Saat Ini</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme 1: Traditional Burgundy Sundanese */}
            <div
              onClick={() => handleSaveConfig({
                ...cfg,
                theme: 'burgundy_sundanese',
                musicTitle: cfg.customMusicUrl ? cfg.musicTitle : 'Gamelan Degung & Kecapi Suling Sunda',
              })}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                cfg.theme === 'burgundy_sundanese'
                  ? 'border-[#7b1b31] bg-gradient-to-br from-[#fcf5f6] via-[#faf0f2] to-[#f5e3e7] shadow-md ring-2 ring-[#7b1b31]/20'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              {cfg.theme === 'burgundy_sundanese' && (
                <div className="absolute top-3 right-3 bg-[#7b1b31] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>Tema Aktif</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7b1b31] text-[#f5d082] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                  BS
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b1b31]">
                    Opsi Tema 1
                  </span>
                  <h4 className="text-lg font-serif-luxury font-bold text-stone-900 mt-0.5">
                    Traditional Burgundy Sundanese
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Nuansa anggun warna Burgundy / Marun Mendalam dipadu dengan ornamen keemasan hangat, motif melati runtuy Sunda, siger pengantin, dan sentuhan kecapi suling.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#f0d4db]">
                  <span className="w-5 h-5 rounded-full bg-[#631425] border border-white shadow-xs" title="Deep Burgundy" />
                  <span className="w-5 h-5 rounded-full bg-[#8b233a] border border-white shadow-xs" title="Rose Wine" />
                  <span className="w-5 h-5 rounded-full bg-[#f3cb77] border border-white shadow-xs" title="Gold Warm" />
                  <span className="w-5 h-5 rounded-full bg-[#fbf5ee] border border-white shadow-xs" title="Champagne Canvas" />
                  <span className="text-[11px] text-stone-500 ml-2">Palet: Burgundy & Emas Sunda</span>
                </div>
              </div>
            </div>

            {/* Theme 2: Traditional Blue Javanese */}
            <div
              onClick={() => handleSaveConfig({
                ...cfg,
                theme: 'blue_javanese',
                musicTitle: cfg.customMusicUrl ? cfg.musicTitle : 'Gamelan Kebo Giro & Ladrang Wilujeng Jawa',
              })}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                cfg.theme === 'blue_javanese'
                  ? 'border-[#1b3562] bg-gradient-to-br from-[#f2f6fc] via-[#edf3fa] to-[#e1eaf7] shadow-md ring-2 ring-[#1b3562]/20'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              {cfg.theme === 'blue_javanese' && (
                <div className="absolute top-3 right-3 bg-[#1b3562] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>Tema Aktif</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1b3562] text-[#e0b75a] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                  BJ
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b3562]">
                    Opsi Tema 2
                  </span>
                  <h4 className="text-lg font-serif-luxury font-bold text-stone-900 mt-0.5">
                    Traditional Blue Javanese
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Kemegahan keraton Jawa Gagrak Ngayogyakarta & Surakarta dengan warna Royal Navy / Indigo Blue, garis prada emas klasik, ornamen motif truntum & parang, serta gending gamelan.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#d2def0]">
                  <span className="w-5 h-5 rounded-full bg-[#122340] border border-white shadow-xs" title="Midnight Navy" />
                  <span className="w-5 h-5 rounded-full bg-[#1e3b6e] border border-white shadow-xs" title="Royal Blue" />
                  <span className="w-5 h-5 rounded-full bg-[#e0b75a] border border-white shadow-xs" title="Prada Gold" />
                  <span className="w-5 h-5 rounded-full bg-[#f8f9fa] border border-white shadow-xs" title="Ivory Canvas" />
                  <span className="text-[11px] text-stone-500 ml-2">Palet: Royal Blue & Prada Jawa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: UPLOAD FOTO & MUSIK */}
      {activeSubTab === 'media' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-8">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-stone-900">
              Upload Foto Mempelai & Musik Latar Undangan
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Personalisasikan undangan dengan foto asli calon mempelai serta musik pengiring favorit.
            </p>
          </div>

          {/* Section: Upload Photos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-700" />
              <span>1. Upload Foto Undangan</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo 1: Foto Sampul / Hero Background */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                <span className="text-xs font-semibold text-stone-900 block">
                  Foto Sampul / Venue Background
                </span>

                <div className="aspect-16/9 rounded-xl overflow-hidden bg-stone-200 relative border border-stone-300">
                  <img
                    src={cfg.heroPhotoUrl || '/src/assets/images/wedding_hero_luxury_1791452635754.jpg'}
                    alt="Foto Sampul"
                    className="w-full h-full object-cover"
                  />
                  {cfg.heroPhotoUrl && (
                    <button
                      onClick={() => handleSaveConfig({ ...cfg, heroPhotoUrl: undefined })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      title="Hapus Foto Kustom"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2 px-3 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-stone-600" />
                      <span>Upload Foto Sampul Baru</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'heroPhotoUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Atau tempel URL gambar sampul online (https://...)"
                      value={cfg.heroPhotoUrl?.startsWith('data:') ? '' : (cfg.heroPhotoUrl || '')}
                      onChange={(e) => handleSaveConfig({ ...cfg, heroPhotoUrl: e.target.value.trim() || undefined })}
                      className="w-full px-3 py-1.5 text-[11px] border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-stone-400">Format: JPG, PNG, WEBP (maks. 5MB) atau tautan URL online.</p>
              </div>

              {/* Photo 2: Foto Pasangan Mempelai */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                <span className="text-xs font-semibold text-stone-900 block">
                  Foto Potret Mempelai Berdua
                </span>

                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-stone-200 relative border-2 border-amber-300 shadow-md">
                  <img
                    src={cfg.couplePhotoUrl || '/src/assets/images/couple_portrait_elegant_1791452649950.jpg'}
                    alt="Foto Potret Pasangan"
                    className="w-full h-full object-cover"
                  />
                  {cfg.couplePhotoUrl && (
                    <button
                      onClick={() => handleSaveConfig({ ...cfg, couplePhotoUrl: undefined })}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      title="Hapus Foto Kustom"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2 px-3 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-stone-600" />
                      <span>Upload Foto Potret Mempelai</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'couplePhotoUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Atau tempel URL gambar potret mempelai (https://...)"
                      value={cfg.couplePhotoUrl?.startsWith('data:') ? '' : (cfg.couplePhotoUrl || '')}
                      onChange={(e) => handleSaveConfig({ ...cfg, couplePhotoUrl: e.target.value.trim() || undefined })}
                      className="w-full px-3 py-1.5 text-[11px] border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 text-center">Format kotak 1:1, JPG, PNG (maks. 5MB) atau URL.</p>
              </div>
            </div>
          </div>

          {/* Section: Upload Music */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-700" />
              <span>2. Pengaturan Musik Latar Undangan</span>
            </h4>

            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">
                    Lagu Aktif: {cfg.musicTitle || 'Instrumental Romantis Nusantara'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {cfg.customMusicUrl
                      ? 'File audio kustom yang Anda tentukan'
                      : 'Audio bawaan tema pernikahan'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleTestAudio}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    {isPlayingTestAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-700" />
                        <span>Jeda Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-amber-700" />
                        <span>Tes Putar Lagu</span>
                      </>
                    )}
                  </button>

                  <label className="cursor-pointer py-1.5 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Musik Sendiri</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>

                  {cfg.customMusicUrl && (
                    <button
                      onClick={() => handleSaveConfig({
                        ...cfg,
                        customMusicUrl: undefined,
                        musicTitle: cfg.theme === 'burgundy_sundanese'
                          ? 'Gamelan Degung & Kecapi Suling Sunda'
                          : 'Gamelan Kebo Giro & Ladrang Wilujeng Jawa'
                      })}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Kembalikan ke Preset Musik Bawaan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Audio URL input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Atau tempel link file audio online langsung (.mp3 / https://...)"
                  value={cfg.customMusicUrl?.startsWith('data:') ? '' : (cfg.customMusicUrl || '')}
                  onChange={(e) => {
                    const url = e.target.value.trim();
                    handleSaveConfig({
                      ...cfg,
                      customMusicUrl: url || undefined,
                      musicTitle: url ? 'Lagu Kustom Online' : cfg.musicTitle,
                    });
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Preset selection */}
              <div className="space-y-2 pt-2 border-t border-stone-200/70">
                <span className="text-xs font-medium text-stone-700 block">
                  Atau Pilih Preset Musik Adat:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      handleSaveConfig({
                        ...cfg,
                        customMusicUrl: undefined,
                        musicTitle: 'Gamelan Degung & Kecapi Suling Sunda',
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors ${
                      cfg.musicTitle?.includes('Sunda') && !cfg.customMusicUrl
                        ? 'border-amber-700 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    🎵 Kecapi Suling Sunda
                  </button>

                  <button
                    onClick={() =>
                      handleSaveConfig({
                        ...cfg,
                        customMusicUrl: undefined,
                        musicTitle: 'Gamelan Kebo Giro & Ladrang Wilujeng Jawa',
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors ${
                      cfg.musicTitle?.includes('Jawa') && !cfg.customMusicUrl
                        ? 'border-blue-700 bg-blue-50 text-blue-950 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    🎵 Gamelan Kuno Jawa
                  </button>

                  <button
                    onClick={() =>
                      handleSaveConfig({
                        ...cfg,
                        customMusicUrl: undefined,
                        musicTitle: 'Romantic Acoustic Wedding Orchestra',
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors ${
                      cfg.musicTitle?.includes('Acoustic') && !cfg.customMusicUrl
                        ? 'border-purple-700 bg-purple-50 text-purple-950 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    🎵 Akustik Romantis Modern
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="musicAutoPlay"
                  checked={cfg.musicAutoPlay}
                  onChange={(e) => handleSaveConfig({ ...cfg, musicAutoPlay: e.target.checked })}
                  className="rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                />
                <label htmlFor="musicAutoPlay" className="text-xs text-stone-700 cursor-pointer">
                  Putar musik otomatis saat tamu mengetuk tombol "Buka Undangan"
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TAUTAN TAMU */}
      {activeSubTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">
              Hasilkan Link Undangan Instan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Pilih dari Daftar Tamu:
                </label>
                <select
                  value={selectedGuestName}
                  onChange={(e) => {
                    setSelectedGuestName(e.target.value);
                    setCustomGuestInput('');
                  }}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none bg-white"
                >
                  <option value="">-- Pilih Tamu Terdaftar --</option>
                  {guests.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name} ({g.side === 'groom' ? 'Pria' : g.side === 'bride' ? 'Wanita' : 'Bersama'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Atau Ketik Nama Tamu Baru:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Bambang Pamungkas & Istri"
                  value={customGuestInput}
                  onChange={(e) => {
                    setCustomGuestInput(e.target.value);
                    setSelectedGuestName('');
                  }}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-amber-900">
                  Tautan Undangan Personal:
                </span>
                <span className="text-[11px] text-amber-700 font-mono">
                  Nama di Sampul: <strong>{activeGuestName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-xl text-stone-800"
                />
                <button
                  onClick={() => handleCopyLink(generatedUrl, 'main-gen')}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {copiedLink === 'main-gen' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onPreviewInvitation(activeSlug)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka Live</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-500">
                  Format URL: <code className="text-amber-800 font-mono font-bold">domain/invite/{activeSlug}</code>
                </span>
                <a
                  href={generateWhatsAppMessage(activeGuestName, generatedUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-300"
                >
                  <Send className="w-3 h-3 text-emerald-600" />
                  <span>Kirim Undangan ke WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bulk Guest Table Link Generator */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">
                Daftar Undangan Semua Tamu ({guests.length})
              </h3>
              <span className="text-xs text-stone-400">
                Format: /invite/nama-tamu
              </span>
            </div>

            {guests.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Belum ada data tamu. Tambahkan tamu di modul "Guest & RSVP" untuk menghasilkan link personal otomatis.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Nama Tamu</th>
                      <th className="py-3 px-3">Pihak</th>
                      <th className="py-3 px-3">Tautan Undangan (URL)</th>
                      <th className="py-3 px-3 text-center">Aksi Link</th>
                      <th className="py-3 px-4 text-center">Share WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {guests.map((g) => {
                      const slug = makeSlug(g.name);
                      const link = `${baseUrl}/invite/${slug}`;

                      return (
                        <tr key={g.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-stone-900">
                            {g.name}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                g.side === 'groom'
                                  ? 'bg-blue-100 text-blue-800'
                                  : g.side === 'bride'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {g.side === 'groom' ? 'Pria' : g.side === 'bride' ? 'Wanita' : 'Bersama'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-stone-600 max-w-xs truncate">
                            /invite/{slug}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleCopyLink(link, g.id)}
                                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700"
                                title="Salin Link"
                              >
                                {copiedLink === g.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => onPreviewInvitation(slug)}
                                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700"
                                title="Lihat Tampilan"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <a
                              href={generateWhatsAppMessage(g.name, link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                            >
                              <Send className="w-3 h-3 text-emerald-600" />
                              <span>Kirim WA</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SETTINGS REKENING & PETA */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Pengaturan Amplop Digital & Peta Lokasi
              </h3>
              <p className="text-xs text-stone-500">
                Informasi ini ditampilkan di halaman undangan digital untuk tanda kasih dan rute jalan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bride Bank */}
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3">
              <span className="text-xs font-bold text-rose-900 block">
                Rekening Mempelai Wanita (Amplop Digital)
              </span>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={cfg.brideBankAccount.bank}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      brideBankAccount: { ...cfg.brideBankAccount, bank: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={cfg.brideBankAccount.number}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      brideBankAccount: { ...cfg.brideBankAccount, number: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Atas Nama (Pemilik)</label>
                <input
                  type="text"
                  value={cfg.brideBankAccount.name}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      brideBankAccount: { ...cfg.brideBankAccount, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Groom Bank */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
              <span className="text-xs font-bold text-blue-900 block">
                Rekening Mempelai Pria (Amplop Digital)
              </span>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={cfg.groomBankAccount.bank}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      groomBankAccount: { ...cfg.groomBankAccount, bank: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={cfg.groomBankAccount.number}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      groomBankAccount: { ...cfg.groomBankAccount, number: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-stone-600 block mb-1">Atas Nama (Pemilik)</label>
                <input
                  type="text"
                  value={cfg.groomBankAccount.name}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...cfg,
                      groomBankAccount: { ...cfg.groomBankAccount, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Maps URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Link Google Maps Lokasi Acara Wanita
              </label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={cfg.mapsUrlBride}
                onChange={(e) => handleSaveConfig({ ...cfg, mapsUrlBride: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Link Google Maps Lokasi Acara Pria
              </label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={cfg.mapsUrlGroom}
                onChange={(e) => handleSaveConfig({ ...cfg, mapsUrlGroom: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: WISHES */}
      {activeSubTab === 'wishes' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Buku Tamu & Doa Restu Digital ({wishes.length})
              </h3>
              <p className="text-xs text-stone-500">
                Semua ucapan yang dikirimkan tamu dari halaman undangan digital disinkronisasikan ke sini secara real-time.
              </p>
            </div>
          </div>

          {wishes.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Belum ada ucapan doa dari tamu undangan.
            </div>
          ) : (
            <div className="space-y-3">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-stone-900">{w.guestName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          w.attendance === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {w.attendance} ({w.pax} Pax)
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 tabular-nums">{w.createdAt}</span>
                  </div>
                  <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                    "{w.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
