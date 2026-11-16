import React, { useState, useEffect } from 'react';
import { ClientCode } from '../types';
import { Plus, Moon, Clock } from 'lucide-react';

interface HeaderProps {
  selectedClient: ClientCode | 'ALL';
  onSelectClient: (client: ClientCode | 'ALL') => void;
  onOpenShiftReport: () => void;
  onOpenNewTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedClient,
  onSelectClient,
  onOpenShiftReport,
  onOpenNewTask
}) => {
  const [phtTime, setPhtTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Philippines timezone is UTC+8
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setPhtTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const clients: (ClientCode | 'ALL')[] = ['ALL', 'GAE', 'AE', 'Bitstop', 'OAA', 'IM'];

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-900">
          🇵🇭
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
              AgencyFlow PH
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              5 Clients
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Marketing Operations Hub (PHT)</p>
        </div>
      </div>

      {/* Quick Fast-Switcher Pills */}
      <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
        {clients.map(c => {
          const isActive = selectedClient === c;
          return (
            <button
              key={c}
              onClick={() => onSelectClient(c)}
              className={`px-2.5 py-1 rounded-md font-semibold text-xs transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c === 'ALL' ? '🌟 Master (All 5)' : c}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {/* Live Philippine Standard Time Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Manila: <strong className="text-slate-900 dark:text-white">{phtTime || '09:45:00 AM'}</strong></span>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Post</span>
        </button>

        <button
          onClick={onOpenShiftReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs transition"
          title="End of shift report handover"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">End Shift</span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
            J
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:inline">Jeevi (Lead)</span>
        </div>
      </div>
    </header>
  );
};
