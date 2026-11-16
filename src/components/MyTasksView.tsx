import React from 'react';
import { DeliverableItem } from '../types';
import { CLIENTS } from '../constants/clients';
import { getStageBadge } from '../lib/utils';
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface MyTasksViewProps {
  deliverables: DeliverableItem[];
  onOpenItemDetail: (item: DeliverableItem) => void;
  onUpdateStage: (itemId: string, newStage: DeliverableItem['stage']) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  deliverables,
  onOpenItemDetail,
  onUpdateStage
}) => {
  // Items assigned to Lead or where Lead OA / check is required
  const myActionItems = deliverables.filter(item => {
    return item.targetDate === '2026-11-16' && (item.stage === 'OA' || item.stage === 'Client Approval');
  });

  const myScheduledToday = deliverables.filter(item => {
    return item.targetDate === '2026-11-16' && item.stage === 'Scheduled';
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Active Assignments & Approvals
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Zero-confusion personal view for <strong>Jeevi (Lead)</strong>. Focus only on what requires your attention today.
        </p>
      </div>

      {/* Section: Urgent Approvals Needed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
          <span>⚠️ Actions Required Today ({myActionItems.length})</span>
        </h3>

        {myActionItems.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No pending approvals! All assigned deliverables are cleared.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {myActionItems.map(item => {
              const client = CLIENTS[item.clientCode];
              const badge = getStageBadge(item.stage);

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenItemDetail(item)}
                  className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-400 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${client.badgeBg} ${client.badgeText}`}>
                      {item.clientCode}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>⏰ Target: <strong>{item.timePHT}</strong></span>
                        {item.assetUrl && (
                          <>
                            <span>•</span>
                            <a
                              href={item.assetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                            >
                              <span>Proof</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => onUpdateStage(item.id, 'Scheduled')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition"
                    >
                      Approve & Schedule ✓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: Completed & Scheduled Today */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          ✓ Scheduled & Live Today ({myScheduledToday.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {myScheduledToday.map(item => {
            const client = CLIENTS[item.clientCode];
            return (
              <div
                key={item.id}
                onClick={() => onOpenItemDetail(item)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.badgeBg} ${client.badgeText}`}>
                    {item.clientCode}
                  </span>
                  <div>
                    <h5 className="font-semibold text-xs text-slate-700 dark:text-slate-300 line-through">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timePHT}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Scheduled 🟢
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
