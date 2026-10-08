import React, { useState, useEffect, useRef } from 'react';
import {
  WeddingProfile,
  InvitationWish,
  DigitalInvitationConfig,
} from '../types/wedding';
import confetti from 'canvas-confetti';
import {
  Mail,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Send,
  Copy,
  Check,
  Music,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';

interface DigitalInvitationPageProps {
  guestSlug?: string;
  profile: WeddingProfile;
  invitationConfig: DigitalInvitationConfig;
  wishes: InvitationWish[];
  onAddWish: (wish: Omit<InvitationWish, 'id' | 'createdAt'>) => void;
  onBackToPlanner?: () => void;
  isPreviewModal?: boolean;
}

export const DigitalInvitationPage: React.FC<DigitalInvitationPageProps> = ({
  guestSlug = '',
  profile,
  invitationConfig,
  wishes,
  onAddWish,
  onBackToPlanner,
  isPreviewModal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isBurgundySundanese = invitationConfig.theme === 'burgundy_sundanese';

  // Format guest name from slug: "budi-santoso" -> "Budi Santoso"
  const formattedGuestName = guestSlug
    ? guestSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Tamu Undangan';

  // Form State
  const [rsvpName, setRsvpName] = useState(formattedGuestName !== 'Tamu Undangan' ? formattedGuestName : '');
  const [attendance, setAttendance] = useState<'Hadir' | 'Tidak Hadir' | 'Ragu-ragu'>('Hadir');
  const [paxCount, setPaxCount] = useState(2);
  const [wishMessage, setWishMessage] = useState('');
  const [hasSubmittedRsvp, setHasSubmittedRsvp] = useState(false);

  // Live countdown to primary event
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(`${profile.brideEventDate}T08:00:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [profile.brideEventDate]);

  // Audio source resolution: custom uploaded audio or theme preset
  const defaultSundaMusic = 'https://assets.mixkit.co/music/preview/mixkit-traditional-oriental-relax-628.mp3';
  const defaultJawaMusic = 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3';
  const activeAudioUrl = invitationConfig.customMusicUrl || (isBurgundySundanese ? defaultSundaMusic : defaultJawaMusic);

  // Audio setup
  useEffect(() => {
    if (isOpen && invitationConfig.musicAutoPlay) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true);
        }).catch(() => {
          // Auto-play was prevented by browser policy
          setIsPlayingMusic(false);
        });
      }
    }
  }, [isOpen, invitationConfig.musicAutoPlay, activeAudioUrl]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => setIsPlayingMusic(false));
    }
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: isBurgundySundanese ? ['#801830', '#c22d4d', '#f5d082', '#dfb15b'] : ['#1b3562', '#2f5b9e', '#e2ba64', '#f1cf7b'],
    });
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => setIsPlayingMusic(false));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) return;

    onAddWish({
      guestName: rsvpName.trim() || 'Tamu Undangan',
      message: wishMessage.trim(),
      attendance,
      pax: Number(paxCount) || 1,
    });

    setHasSubmittedRsvp(true);
    setWishMessage('');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // Theme-specific styling classes
  const themeClasses = isBurgundySundanese
    ? {
        bgCover: 'from-[#420d18] via-[#5c1322] to-[#2b080f]',
        goldText: 'text-[#f5d082]',
        goldBorder: 'border-[#dfb15b]',
        badgeBg: 'bg-[#520f1d] text-[#f8de9e] border-[#8a243b]',
        cardBg: 'bg-[#fffafb] border-[#edd6db]',
        accentBtn: 'bg-gradient-to-r from-[#7a182e] to-[#9c243f] text-[#faeccf] hover:from-[#6b1528] hover:to-[#8a1f37]',
        pillWanita: 'bg-[#661324] text-[#fae1a5]',
        pillPria: 'bg-[#400e18] text-[#f5d082]',
        highlightCard: 'bg-gradient-to-br from-[#fcf5f6] to-[#faecf0] border-[#e8c7cf]',
        traditionGreeting: 'Sampurasun · Bismillahir-Rahmanir-Rahim',
        traditionSub: 'Panganten Sunda · Siger & Kembang Melati Runtuy',
      }
    : {
        bgCover: 'from-[#0d1626] via-[#162744] to-[#0a111e]',
        goldText: 'text-[#e5bf6b]',
        goldBorder: 'border-[#cda24e]',
        badgeBg: 'bg-[#152540] text-[#f3d997] border-[#294573]',
        cardBg: 'bg-[#fafdff] border-[#d8e3f0]',
        accentBtn: 'bg-gradient-to-r from-[#173059] to-[#25467e] text-[#f7e6c1] hover:from-[#122647] hover:to-[#1e3c6d]',
        pillWanita: 'bg-[#1a335c] text-[#f7e3ad]',
        pillPria: 'bg-[#0f1f38] text-[#e5bf6b]',
        highlightCard: 'bg-gradient-to-br from-[#f2f7fc] to-[#e7eff8] border-[#c8d8ec]',
        traditionGreeting: 'Nuwun Sewu · Bismillahir-Rahmanir-Rahim',
        traditionSub: 'Pahargyan Temanten · Adat Jawa Gagrak Ngayogyakarta & Surakarta',
      };

  return (
    <div
      className={`min-h-screen text-stone-800 font-sans-clean relative selection:bg-amber-100 selection:text-amber-900 ${
        isBurgundySundanese ? 'bg-[#fcf8f9]' : 'bg-[#f8fafd]'
      }`}
    >
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        src={activeAudioUrl}
        loop
        preload="auto"
      />

      {/* Top Floating Control Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {onBackToPlanner && (
          <button
            onClick={onBackToPlanner}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white/90 backdrop-blur-md text-stone-800 border border-stone-300 rounded-full shadow-sm hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Planner</span>
          </button>
        )}

        {isOpen && (
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-stone-300 rounded-full py-1 px-3 shadow-md">
            <button
              onClick={handleToggleMusic}
              className="p-1 rounded-full text-stone-800 hover:text-amber-800 transition-colors"
              title={isPlayingMusic ? 'Hentikan Musik' : 'Putar Musik'}
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>
            <span className="text-[11px] font-medium text-stone-700 truncate max-w-[120px] sm:max-w-[180px]">
              {invitationConfig.musicTitle || (isBurgundySundanese ? 'Kecapi Suling Sunda' : 'Gamelan Jawa Kuno')}
            </span>
          </div>
        )}
      </div>

      {/* Screen 1: Cover / Envelope Overlay (Shown before clicking "Buka Undangan") */}
      {!isOpen ? (
        <div
          className={`min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-b ${themeClasses.bgCover} text-white`}
        >
          {/* Background image backdrop */}
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
            <img
              src={invitationConfig.heroPhotoUrl || '/src/assets/images/wedding_hero_luxury_1791452635754.jpg'}
              alt="Background"
              className="w-full h-full object-cover scale-105"
            />
          </div>

          <div className="relative z-10 max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Cultural Tradition Header Badge */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border backdrop-blur-md ${themeClasses.badgeBg}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{themeClasses.traditionSub}</span>
            </div>

            <div className="space-y-2">
              <h1 className={`text-4xl sm:text-5xl font-serif-luxury font-bold tracking-tight leading-tight ${themeClasses.goldText}`}>
                {profile.groomNickname} & {profile.brideNickname}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 tracking-wider">
                {profile.conceptTheme} · Dua Acara Suci
              </p>
            </div>

            {/* Guest Invitation Box */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2 text-stone-200 shadow-2xl">
              <span className={`text-xs uppercase tracking-wider block ${themeClasses.goldText}`}>
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-white">
                {formattedGuestName}
              </h2>
              <p className="text-[11px] text-stone-300">
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam hari bahagia kami
              </p>
            </div>

            <div>
              <button
                onClick={handleOpenInvitation}
                className="px-8 py-3.5 text-sm font-semibold rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 text-stone-950 font-medium"
              >
                <Mail className="w-4 h-4 text-amber-900" />
                <span>Buka Undangan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Screen 2: Full Interactive Wedding Invitation */
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-16 animate-in fade-in duration-500">
          {/* Hero Section */}
          <section className="text-center space-y-4 pt-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto shadow-lg border-3 border-amber-300/80">
              <img
                src={invitationConfig.couplePhotoUrl || '/src/assets/images/couple_portrait_elegant_1791452649950.jpg'}
                alt="Foto Mempelai"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-semibold block text-stone-500">
                {themeClasses.traditionGreeting}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900">
                {profile.groomName}
                <span className="text-amber-700 block sm:inline sm:mx-2">&</span>
                {profile.brideName}
              </h1>
            </div>

            <p className="text-xs text-stone-600 max-w-md mx-auto italic font-serif">
              "{profile.storyQuote}"
            </p>
          </section>

          {/* Ayat Suci Section */}
          <section className={`p-6 sm:p-8 rounded-3xl border shadow-xs text-center space-y-4 ${themeClasses.cardBg}`}>
            <Heart className="w-6 h-6 text-rose-500 mx-auto" />
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-serif">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu
              dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
              di antaramu rasa kasih dan sayang."
            </p>
            <span className="text-xs font-semibold text-stone-800 block">
              — QS. Ar-Rum: 21
            </span>
          </section>

          {/* Dual Countdown */}
          <section className={`p-6 rounded-3xl border text-center space-y-3 ${themeClasses.highlightCard}`}>
            <span className="text-xs uppercase tracking-widest font-bold text-stone-800">
              Menuju Hari Bahagia
            </span>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="text-xl font-bold font-serif-luxury text-stone-900 tabular-nums">
                  {countdown.days}
                </div>
                <div className="text-[10px] text-stone-500 uppercase">Hari</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="text-xl font-bold font-serif-luxury text-stone-900 tabular-nums">
                  {countdown.hours}
                </div>
                <div className="text-[10px] text-stone-500 uppercase">Jam</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="text-xl font-bold font-serif-luxury text-stone-900 tabular-nums">
                  {countdown.minutes}
                </div>
                <div className="text-[10px] text-stone-500 uppercase">Menit</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="text-xl font-bold font-serif-luxury text-amber-700 tabular-nums">
                  {countdown.seconds}
                </div>
                <div className="text-[10px] text-stone-500 uppercase">Detik</div>
              </div>
            </div>
          </section>

          {/* Dual Events Section (2 Sisi Acara) */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                Rangkaian Acara Pernikahan
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Jadwal & Lokasi 2 Sisi Acara
              </h2>
            </div>

            {/* Event 1: Pihak Wanita */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 relative overflow-hidden ${themeClasses.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${themeClasses.pillWanita}`}>
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Acara Pihak Mempelai Wanita
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  {profile.brideEventTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Akad Nikah, Upacara Adat, & Resepsi
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-semibold">
                    {new Date(profile.brideEventDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{profile.brideEventTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{profile.brideEventLocation || 'Gedung Pernikahan'}</span>
                  </div>
                </div>
              </div>

              {invitationConfig.mapsUrlBride && (
                <div className="pt-2">
                  <a
                    href={invitationConfig.mapsUrlBride}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah Google Maps</span>
                  </a>
                </div>
              )}
            </div>

            {/* Event 2: Pihak Pria */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 relative overflow-hidden ${themeClasses.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${themeClasses.pillPria}`}>
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Acara Pihak Mempelai Pria
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                  {profile.groomEventTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Resepsi & Ngunduh Mantu
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-semibold">
                    {new Date(profile.groomEventDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{profile.groomEventTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{profile.groomEventLocation || 'Gedung Acara Pria'}</span>
                  </div>
                </div>
              </div>

              {invitationConfig.mapsUrlGroom && (
                <div className="pt-2">
                  <a
                    href={invitationConfig.mapsUrlGroom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Interactive RSVP Form & Wishes */}
          <section className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 ${themeClasses.cardBg}`}>
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                Konfirmasi Kehadiran
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                RSVP & Doa Restu Tamu
              </h2>
            </div>

            {hasSubmittedRsvp ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-semibold text-emerald-900">
                  Terima kasih atas konfirmasi dan doa restunya!
                </h4>
                <p className="text-xs text-emerald-700">
                  Doa restu Anda telah tercatat dan tersinkronkan ke dalam planner.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRsvp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nama lengkap atau panggilan"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Konfirmasi Kehadiran
                    </label>
                    <select
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none bg-white"
                    >
                      <option value="Hadir">Insya Allah Hadir</option>
                      <option value="Tidak Hadir">Mohon Maaf Belum Bisa</option>
                      <option value="Ragu-ragu">Masih Ragu-ragu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Jumlah Tamu (Pax)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={paxCount}
                      onChange={(e) => setPaxCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Ucapan & Doa Restu *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat dan doa terbaik untuk kedua mempelai..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 ${themeClasses.accentBtn}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Konfirmasi & Doa Restu</span>
                </button>
              </form>
            )}

            {/* List of guest wishes */}
            <div className="pt-4 border-t border-stone-200/70 space-y-3">
              <span className="text-xs font-semibold text-stone-700 block">
                Doa Restu dari Sahabat & Keluarga ({wishes.length})
              </span>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {wishes.map((w) => (
                  <div key={w.id} className="p-3 bg-white rounded-xl border border-stone-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{w.guestName}</span>
                      <span className="text-[10px] text-stone-400">{w.createdAt}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed italic font-serif">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Amplop Digital / Gift Section */}
          <section className={`p-6 sm:p-8 rounded-3xl border shadow-xs text-center space-y-6 ${themeClasses.cardBg}`}>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                Tanda Kasih
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                Amplop Digital & Kado Kasih
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang berkenan memberikan tanda kasih secara cashless:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bride Account */}
              {invitationConfig.brideBankAccount.number && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-left shadow-xs">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    Rekening Pihak Wanita
                  </span>
                  <div className="text-xs font-bold text-stone-900">
                    Bank {invitationConfig.brideBankAccount.bank}
                  </div>
                  <div className="text-sm font-mono font-bold text-stone-900">
                    {invitationConfig.brideBankAccount.number}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    a.n {invitationConfig.brideBankAccount.name}
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(invitationConfig.brideBankAccount.number, 'acc-bride')
                    }
                    className="w-full py-1.5 text-[11px] font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    {copiedAccount === 'acc-bride' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Nomor Rekening Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-700" />
                        <span>Salin Nomor Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Groom Account */}
              {invitationConfig.groomBankAccount.number && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-left shadow-xs">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Rekening Pihak Pria
                  </span>
                  <div className="text-xs font-bold text-stone-900">
                    Bank {invitationConfig.groomBankAccount.bank}
                  </div>
                  <div className="text-sm font-mono font-bold text-stone-900">
                    {invitationConfig.groomBankAccount.number}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    a.n {invitationConfig.groomBankAccount.name}
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(invitationConfig.groomBankAccount.number, 'acc-groom')
                    }
                    className="w-full py-1.5 text-[11px] font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    {copiedAccount === 'acc-groom' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Nomor Rekening Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-700" />
                        <span>Salin Nomor Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Footer note */}
          <footer className="text-center text-xs text-stone-500 space-y-1 pb-16">
            <p className="font-serif-luxury text-base font-semibold text-stone-800">
              {profile.groomName} & {profile.brideName}
            </p>
            <p>Keluarga Besar Kedua Mempelai</p>
          </footer>
        </div>
      )}
    </div>
  );
};
