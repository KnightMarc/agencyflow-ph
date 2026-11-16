import React from 'react';
import { DeliverableItem, ClientCode, ApprovalStage } from '../types';
import { CLIENTS } from '../constants/clients';
import { Clock, ExternalLink, ArrowRight } from 'lucide-react';

interface KanbanViewProps {
  deliverables: DeliverableItem[];
  selectedClient: ClientCode | 'ALL';
  onOpenItemDetail: (item: DeliverableItem) => void;
  onUpdateStage: (itemId: string, newStage: ApprovalStage) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  deliverables,
  selectedClient,
  onOpenItemDetail,
  onUpdateStage
}) => {
  // Focus on current work: Today & Tomorrow
  const relevantItems = deliverables.filter(item => {
    const isRelevantDate = item.targetDate === '2026-11-16' || item.targetDate === '2026-11-17';
    const matchesClient = selectedClient === 'ALL' || item.clientCode === selectedClient;
    return isRelevantDate && matchesClient;
  });

  const columns: { stage: ApprovalStage; title: string; colorClass: string; badgeClass: string }[] = [
    { stage: 'Draft', title: '1. Draft', colorClass: 'border-slate-300', badgeClass: 'bg-slate-100 text-slate-700' },
    { stage: 'For Checking', title: '2. For Checking', colorClass: 'border-blue-300', badgeClass: 'bg-blue-100 text-blue-800' },
    { stage: 'OA', title: '3. OA & Client Review', colorClass: 'border-purple-300', badgeClass: 'bg-purple-100 text-purple-800' },
    { stage: 'Scheduled', title: '4. Scheduled 🟢', colorClass: 'border-emerald-300', badgeClass: 'bg-emerald-100 text-emerald-800' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Deliverables Pipeline Board (Today & Tomorrow)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Standard 4-stage agency review hierarchy. Move items across stages until they hit <strong>Scheduled</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colItems = relevantItems.filter(item => {
            if (col.stage === 'OA') {
              return item.stage === 'OA' || item.stage === 'Client Approval';
            }
            return item.stage === col.stage;
          });

          return (
            <div
              key={col.stage}
              className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {colItems.length}
                </span>
              </div>

              <div className="space-y-3">
                {colItems.map(item => {
                  const client = CLIENTS[item.clientCode];
                  const completedChecks = item.checklist.filter(c => c.completed).length;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onOpenItemDetail(item)}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.badgeBg} ${client.badgeText}`}>
                          {item.clientCode}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timePHT}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>

                      {item.stage === 'Client Approval' && (
                        <div className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                          ⚠️ Waiting for IM Client WhatsApp approval
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Checklist: {completedChecks}/{item.checklist.length}</span>
                        {item.assetUrl && (
                          <a
                            href={item.assetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            <span>Asset</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Advance Stage Button */}
                      <div className="pt-1 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400">
                          {item.targetDate === '2026-11-16' ? 'Today' : 'Tomorrow'}
                        </span>

                        {col.stage === 'Draft' && (
                          <button
                            onClick={() => onUpdateStage(item.id, 'For Checking')}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold rounded flex items-center gap-1"
                          >
                            <span>Submit Checking</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {col.stage === 'For Checking' && (
                          <button
                            onClick={() => onUpdateStage(item.id, item.clientCode === 'IM' ? 'Client Approval' : 'OA')}
                            className="px-2 py-0.5 bg-purple-50 text-purple-700 hover:bg-purple-100 text-[10px] font-bold rounded flex items-center gap-1"
                          >
                            <span>Submit for OA</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {col.stage === 'OA' && (
                          <button
                            onClick={() => onUpdateStage(item.id, 'Scheduled')}
                            className="px-2 py-0.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold rounded flex items-center gap-1"
                          >
                            <span>Approve & Schedule</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
