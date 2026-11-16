import React, { useState } from 'react';
import { DeliverableItem, ClientCode } from '../types';
import { CLIENTS } from '../constants/clients';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalendarViewProps {
  deliverables: DeliverableItem[];
  selectedClient: ClientCode | 'ALL';
  onSelectClient: (client: ClientCode | 'ALL') => void;
  onOpenDayDrawer: (dateStr: string, clientCode: ClientCode) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  deliverables,
  selectedClient,
  onSelectClient,
  onOpenDayDrawer
}) => {
  const [isHolidayMode, setIsHolidayMode] = useState(false);

  // November 2026 constants
  const year = 2026;
  const month = 11;
  const daysInMonth = 30;
  const startDayOffset = 6; // Starts on Sunday (offset 6 for Monday start)

  const handleDayClick = (dayNum: number) => {
    const dayStr = dayNum.toString().padStart(2, '0');
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;
    const targetClient = selectedClient === 'ALL' ? 'GAE' : selectedClient;
    onOpenDayDrawer(dateStr, targetClient);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const clientCodes: ClientCode[] = ['GAE', 'AE', 'Bitstop', 'OAA', 'IM'];

  return (
    <div className="space-y-6">
      
      {/* Top Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {selectedClient === 'ALL' ? 'MASTER VIEW' : `CLIENT: ${selectedClient}`}
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {selectedClient === 'ALL' ? 'Master Agency Posting Calendar' : `${CLIENTS[selectedClient].name} Progress Calendar`}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {selectedClient === 'ALL'
              ? 'Multi-client overview. When all 5 clients complete their required daily deliverables, the day turns GREEN.'
              : CLIENTS[selectedClient].description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedClient === 'OAA' && (
            <label className="flex items-center gap-2 px-3 py-1.5 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 rounded-lg text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isHolidayMode}
                onChange={e => setIsHolidayMode(e.target.checked)}
                className="rounded text-red-600"
              />
              <span className="font-semibold text-red-700 dark:text-red-300">
                Holiday Rule (2 Reels, 2 Static, 5 Stories)
              </span>
            </label>
          )}

          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs shadow-2xs font-semibold">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 border-x border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              November 2026 (PHT)
            </span>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Fast Switcher for Calendar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => onSelectClient('ALL')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition ${
              selectedClient === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All 5 Clients (Master Matrix)
          </button>
          {clientCodes.map(code => (
            <button
              key={code}
              onClick={() => onSelectClient(code)}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition ${
                selectedClient === code
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <button
          onClick={triggerCelebration}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Celebrate On-Time Rate</span>
        </button>
      </div>

      {/* 7-Day Week Calendar Grid */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center text-xs font-bold py-2.5 text-slate-600 dark:text-slate-400">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span className="text-indigo-600 dark:text-indigo-400">SAT</span>
          <span className="text-indigo-600 dark:text-indigo-400">SUN</span>
        </div>

        {/* 30 Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-[1px] bg-slate-200 dark:bg-slate-800">
          
          {/* Empty Offset Leading Cells */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div
              key={`blank-${i}`}
              className="min-h-[105px] bg-slate-50/50 dark:bg-slate-900/40 p-2 text-slate-300 text-xs select-none"
            >
              {25 + i}
            </div>
          ))}

          {/* Active Month Days (1 to 30) */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = dayNum.toString().padStart(2, '0');
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;
            const isToday = dayNum === 16;

            // Filter deliverables for this day
            const dayItems = deliverables.filter(item => item.targetDate === dateStr);

            if (selectedClient === 'ALL') {
              // MASTER MATRIX: Evaluate status of each client
              let allFiveScheduled = true;
              const clientStatuses = clientCodes.map(code => {
                const cItems = dayItems.filter(i => i.clientCode === code);
                const isComplete = cItems.length > 0 && cItems.every(i => i.stage === 'Scheduled');
                if (!isComplete) allFiveScheduled = false;
                return {
                  code,
                  isComplete,
                  hasItems: cItems.length > 0,
                  inProgress: cItems.some(i => i.stage !== 'Draft')
                };
              });

              const isMasterGreen = allFiveScheduled && dayNum <= 16;

              return (
                <div
                  key={dayNum}
                  onClick={() => handleDayClick(dayNum)}
                  className={`min-h-[110px] p-2 flex flex-col justify-between cal-day cursor-pointer bg-white dark:bg-slate-900 hover:border-indigo-400 transition ${
                    isToday ? 'ring-2 ring-indigo-500 shadow-md' : ''
                  } ${isMasterGreen ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum} {isToday && <span className="text-[9px] uppercase font-bold px-1 bg-indigo-600 text-white rounded">Today</span>}
                    </span>
                    {isMasterGreen && <span className="text-emerald-600 text-xs">🟢</span>}
                  </div>

                  {/* 5 Mini Pills Matrix */}
                  <div className="space-y-0.5 mt-1.5">
                    {clientStatuses.map(st => {
                      let badgeColor = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
                      if (st.isComplete) {
                        badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold';
                      } else if (st.inProgress) {
                        badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold';
                      }

                      return (
                        <div
                          key={st.code}
                          className={`flex items-center justify-between text-[10px] px-1 py-0.2 rounded ${badgeColor}`}
                        >
                          <span>{st.code}</span>
                          <span>{st.isComplete ? '✓' : '...'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              // FOCUSED SINGLE CLIENT VIEW
              const cItems = dayItems.filter(i => i.clientCode === selectedClient);
              const total = cItems.length;
              const scheduledCount = cItems.filter(i => i.stage === 'Scheduled').length;
              const isComplete = total > 0 && scheduledCount === total;

              let statusBg = 'bg-white dark:bg-slate-900';
              let badgeContent = null;

              if (isComplete) {
                statusBg = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100';
                badgeContent = (
                  <div className="mt-2 text-center">
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500 text-white block">
                      🟢 100% Scheduled
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1 block">
                      ✓ {total} posts published
                    </span>
                  </div>
                );
              } else if (scheduledCount > 0) {
                statusBg = 'bg-amber-50 dark:bg-amber-950/20';
                badgeContent = (
                  <div className="mt-2 text-center">
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500 text-white block">
                      {scheduledCount}/{total} Scheduled
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold mt-1 block">
                      In Review Pipeline
                    </span>
                  </div>
                );
              } else {
                badgeContent = (
                  <div className="mt-2 text-center text-[10px] text-slate-400">
                    {total} items scheduled
                  </div>
                );
              }

              return (
                <div
                  key={dayNum}
                  onClick={() => handleDayClick(dayNum)}
                  className={`min-h-[110px] p-2 flex flex-col justify-between cal-day cursor-pointer hover:border-indigo-400 transition ${statusBg} ${
                    isToday ? 'ring-2 ring-indigo-500 shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum} {isToday && <span className="text-[9px] uppercase font-bold px-1 bg-indigo-600 text-white rounded">Today</span>}
                    </span>
                    {isComplete && <span className="text-emerald-600 text-xs">🟢</span>}
                  </div>

                  {badgeContent}
                </div>
              );
            }
          })}

        </div>

      </div>

    </div>
  );
};
