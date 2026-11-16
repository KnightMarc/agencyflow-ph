import React from 'react';
import { ClientCode } from '../types';
import { LayoutDashboard, Calendar, Kanban, CheckSquare, Clock, ShieldCheck } from 'lucide-react';
import { CLIENTS } from '../constants/clients';

export type NavTab = 'dashboard' | 'calendar' | 'kanban' | 'mytasks';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedClient: ClientCode | 'ALL';
  onSelectClient: (client: ClientCode | 'ALL') => void;
  urgentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedClient,
  onSelectClient,
  urgentCount
}) => {
  return (
    <aside className="w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-5">
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
            Workspaces
          </span>
          <nav className="mt-1.5 space-y-1">
            
            {/* Dashboard Tab */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition ${
                currentTab === 'dashboard'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Task Dashboard
              </span>
              {urgentCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-bold animate-pulse">
                  {urgentCount} Urgent
                </span>
              )}
            </button>

            {/* Calendar Tab */}
            <button
              onClick={() => onSelectTab('calendar')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition ${
                currentTab === 'calendar'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Progress Calendar
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Turn Green
              </span>
            </button>

            {/* Kanban Tab */}
            <button
              onClick={() => onSelectTab('kanban')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition ${
                currentTab === 'kanban'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Kanban className="w-4 h-4" />
                Kanban Pipeline
              </span>
              <span className="text-[10px] text-slate-400">4 Stages</span>
            </button>

            {/* My Tasks Tab */}
            <button
              onClick={() => onSelectTab('mytasks')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition ${
                currentTab === 'mytasks'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                My Assignments
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                3
              </span>
            </button>

          </nav>
        </div>

        {/* 5 Clients Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              5 Agency Clients
            </span>
            {selectedClient !== 'ALL' && (
              <button 
                onClick={() => onSelectClient('ALL')}
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
              >
                Reset (All)
              </button>
            )}
          </div>

          <div className="space-y-1">
            {(Object.keys(CLIENTS) as ClientCode[]).map(code => {
              const client = CLIENTS[code];
              const isSelected = selectedClient === code;
              return (
                <button
                  key={code}
                  onClick={() => onSelectClient(code)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: client.color }} 
                    />
                    <span>{client.name}</span>
                  </div>
                  {client.requiresClientApproval ? (
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-800">
                      Approval
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      {code === 'GAE' ? '4/day' : '2/day'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily PHT Schedule Timetable Widget */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-[11px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Schedule Matrix (PHT)</span>
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[10px]">
            <div className="flex justify-between">
              <strong className="text-slate-900 dark:text-slate-200">08:00 AM</strong>
              <span>GAE Bible Verse</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-slate-900 dark:text-slate-200">10:00 AM</strong>
              <span>All Clients Static/Reel</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-slate-900 dark:text-slate-200">10:15 AM</strong>
              <span>All Clients 5 Stories</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-slate-900 dark:text-slate-200">12:00 PM</strong>
              <span>GAE & OAA Reels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Storage Quota Meter */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Supabase Free Tier
            </span>
            <span className="font-bold text-emerald-600 text-[10px]">Active</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[8%]"></div>
          </div>
          <p className="text-[10px] text-slate-400">0.8 MB of 500 MB used (0.16%)</p>
        </div>
      </div>
    </aside>
  );
};
