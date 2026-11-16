import React from 'react';
import { DeliverableItem, ClientCode, ApprovalStage } from '../types';
import { CLIENTS } from '../constants/clients';
import { getStageBadge } from '../lib/utils';
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  deliverables: DeliverableItem[];
  selectedClient: ClientCode | 'ALL';
  onOpenItemDetail: (item: DeliverableItem) => void;
  onUpdateStage: (itemId: string, newStage: ApprovalStage) => void;
  onSwitchToCalendar: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deliverables,
  selectedClient,
  onOpenItemDetail,
  onUpdateStage,
  onSwitchToCalendar
}) => {
  // Target date is today (Nov 16, 2026)
  const todayStr = '2026-11-16';

  const todayItems = deliverables.filter(item => {
    const matchesDate = item.targetDate === todayStr;
    const matchesClient = selectedClient === 'ALL' || item.clientCode === selectedClient;
    return matchesDate && matchesClient;
  });

  const totalToday = todayItems.length;
  const scheduledToday = todayItems.filter(i => i.stage === 'Scheduled').length;
  const pendingOA = todayItems.filter(i => i.stage === 'OA').length;
  const pendingClient = todayItems.filter(i => i.stage === 'Client Approval').length;

  const urgentItems = todayItems.filter(i => i.stage === 'OA' || i.stage === 'Client Approval' || i.stage === 'For Checking');

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Agency Operations Dashboard
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {selectedClient === 'ALL' ? 'All 5 Clients' : `Filter: ${selectedClient}`}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time Philippine Standard Time (PHT) pipeline, approval bottlenecks, and today's schedule.
          </p>
        </div>

        <button
          onClick={onSwitchToCalendar}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
        >
          <span>📅 Open Progress Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priority Radar Banner */}
      {urgentItems.length > 0 ? (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-red-950 dark:text-red-200 text-sm">
                Priority Radar: {urgentItems.length} Deliverable(s) Need Immediate Sign-off Today
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5 leading-relaxed">
                Review and approve assets to ensure all posts hit their scheduled PHT drop times and turn the calendar <strong>GREEN</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-lg">
              {pendingOA} OA • {pendingClient} Client Appr
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/20 p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            All caught up! All of today's deliverables are officially approved and scheduled.
          </p>
        </div>
      )}

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Today's Target Posts</span>
          <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {totalToday} Posts
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            {scheduledToday} of {totalToday} Scheduled ({totalToday > 0 ? Math.round((scheduledToday / totalToday) * 100) : 100}%)
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Waiting for Lead (OA)</span>
          <div className="text-2xl font-black mt-1 text-purple-600">
            {pendingOA} Item(s)
          </div>
          <span className="text-[11px] font-medium text-slate-400">Needs overall lead sign-off</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Waiting for Client</span>
          <div className="text-2xl font-black mt-1 text-amber-600">
            {pendingClient} Item(s)
          </div>
          <span className="text-[11px] font-semibold text-amber-600">IM Mandatory approval</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500">November Green Record</span>
          <div className="text-2xl font-black mt-1 text-emerald-600">
            15 / 16 Days
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">93.7% On-Time Completion</span>
        </div>
      </div>

      {/* Action Priority Queue: Deliverables for Today */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Today's Live Deliverable Pipeline (Nov 16, 2026)
            </h3>
            <p className="text-xs text-slate-500">Organized by Philippine Standard Time (PHT)</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {todayItems.length} Deliverables
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {todayItems.map(item => {
            const client = CLIENTS[item.clientCode];
            const badge = getStageBadge(item.stage);
            const isScheduled = item.stage === 'Scheduled';

            return (
              <div
                key={item.id}
                onClick={() => onOpenItemDetail(item)}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition ${
                  item.stage === 'OA' ? 'bg-purple-50/30 dark:bg-purple-950/10' : ''
                } ${item.stage === 'Client Approval' ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${client.badgeBg} ${client.badgeText}`}
                  >
                    {item.clientCode}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {item.timePHT}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <span>Assignee: <strong>{item.assigneeName}</strong> ({item.assigneeRole})</span>
                      {item.assetUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={item.assetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            <span>Asset Proof</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className={`px-2.5 py-1 rounded-full text-xs border ${badge.badgeClass}`}>
                    {badge.label}
                  </span>

                  {/* Quick Approve Action Buttons for Leads */}
                  {item.stage === 'OA' && (
                    <button
                      onClick={() => onUpdateStage(item.id, 'Scheduled')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition"
                    >
                      Approve (OA) ✓
                    </button>
                  )}

                  {item.stage === 'Client Approval' && (
                    <button
                      onClick={() => onUpdateStage(item.id, 'Scheduled')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition"
                    >
                      Client Approved ✓
                    </button>
                  )}

                  {isScheduled && (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 px-1">
                      ✓ Ready
                    </span>
                  )}

                  <button
                    onClick={() => onOpenItemDetail(item)}
                    className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
