import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD
  targetTime?: string; // HH:mm
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalDays: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  targetTime = '08:00',
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    totalDays: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`);
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
          totalDays: 0,
        });
        return;
      }

      const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        totalDays,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/90 border border-amber-200/60 px-3 py-1.5 rounded-lg tabular-nums">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        {timeLeft.isPast ? (
          <span>Hari Bahagia Telah Tiba!</span>
        ) : (
          <span>
            H-{timeLeft.totalDays} Menuju Akad ({timeLeft.days}h {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Hitung Mundur Hari Bahagia</span>
          <h4 className="text-lg font-serif-luxury font-semibold text-stone-900">Menuju Ikrar Janji Suci</h4>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone-500 block">Jadwal Acara</span>
          <span className="text-sm font-semibold text-stone-800">
            {new Date(targetDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })} · {targetTime} WIB
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
          <div className="text-2xl sm:text-4xl font-serif-luxury font-bold text-stone-900 tabular-nums">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mt-1">Hari</div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
          <div className="text-2xl sm:text-4xl font-serif-luxury font-bold text-stone-900 tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mt-1">Jam</div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
          <div className="text-2xl sm:text-4xl font-serif-luxury font-bold text-stone-900 tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mt-1">Menit</div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
          <div className="text-2xl sm:text-4xl font-serif-luxury font-bold text-amber-700 tabular-nums">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mt-1">Detik</div>
        </div>
      </div>
    </div>
  );
};
