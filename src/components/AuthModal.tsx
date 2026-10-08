import React, { useState } from 'react';
import { UserSession } from '../types/wedding';
import { X, Lock, User, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verify Master Login: apipyumay / Bismillah2027
    if (cleanUser === 'apipyumay' && cleanPass === 'Bismillah2027') {
      onLoginSuccess({
        isLoggedIn: true,
        name: 'Afif & Ayu (Master Planner)',
        email: 'apipyumay@satucerita.id',
        role: 'planner',
      });
      onClose();
      return;
    }

    // Support direct party logins
    if (cleanUser === 'apip' && cleanPass === 'Bismillah2027') {
      onLoginSuccess({
        isLoggedIn: true,
        name: 'Afif Khoiruddin (Pihak Pria)',
        email: 'afif@satucerita.id',
        role: 'groom',
      });
      onClose();
      return;
    }

    if (cleanUser === 'yumay' && cleanPass === 'Bismillah2027') {
      onLoginSuccess({
        isLoggedIn: true,
        name: 'Ayu May Lestari (Pihak Wanita)',
        email: 'ayumay@satucerita.id',
        role: 'bride',
      });
      onClose();
      return;
    }

    setErrorMessage('Username atau kata sandi tidak sesuai. Silakan periksa kembali.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-[#fbf9f5] border-b border-[#ece6db] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs uppercase tracking-widest text-[#9b7238] font-semibold">
            SatuCerita Planner
          </div>
          <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mt-1">
            Masuk ke Wedding Dashboard
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Sistem perencana pernikahan independen & terpadu
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Username / Akun *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-10 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Masuk ke SatuCerita Planner</span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-[11px] text-stone-400">
              SatuCerita Planner · Keamanan Terenkripsi & Akses Privat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
