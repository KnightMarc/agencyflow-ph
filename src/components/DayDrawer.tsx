import React from 'react';
import { DeliverableItem, ClientCode, ApprovalStage } from '../types';
import { CLIENTS } from '../constants/clients';
import { X, ExternalLink, Clock, CheckSquare } from 'lucide-react';

interface DayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  clientCode: ClientCode;
  onSelectClient: (code: ClientCode) => void;
  deliverables: DeliverableItem[];
  onUpdateItem: (updated: DeliverableItem) => void;
}

export const DayDrawer: React.FC<DayDrawerProps> = ({
  isOpen,
  onClose,
  dateStr,
  clientCode,
  onSelectClient,
  deliverables,
  onUpdateItem
}) => {
  if (!isOpen) return null;

  const client = CLIENTS[clientCode];
  const clientItems = deliverables.filter(
    item => item.targetDate === dateStr && item.clientCode === clientCode
  );

  const total = clientItems.length;
  const scheduledCount = clientItems.filter(i => i.stage === 'Scheduled').length;
  const isAllGreen = total > 0 && scheduledCount === total;
  const percentage = total > 0 ? Math.round((scheduledCount / total) * 100) : 0;

  const handleStageChange = (item: DeliverableItem, newStage: ApprovalStage) => {
    onUpdateItem({
      ...item,
      stage: newStage,
      completedAt: newStage === 'Scheduled' ? new Date().toISOString() : undefined
    });
  };

  const handleAssetChange = (item: DeliverableItem, newUrl: string) => {
    onUpdateItem({
      ...item,
      assetUrl: newUrl
    });
  };

  const handleCaptionChange = (item: DeliverableItem, newCaption: string) => {
    onUpdateItem({
      ...item,
      caption: newCaption
    });
  };

  const handleToggleChecklist = (item: DeliverableItem, checkId: string) => {
    const updatedChecklist = item.checklist.map(c => 
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );
    onUpdateItem({
      ...item,
      checklist: updatedChecklist
    });
  };

  const clientList: ClientCode[] = ['GAE', 'AE', 'Bitstop', 'OAA', 'IM'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
        
        <div className="space-y-5">
          {/* Top Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {client.name} Deliverables
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {dateStr} (PHT)
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Client Fast Switcher inside Drawer */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Switch Client:</span>
            {clientList.map(c => (
              <button
                key={c}
                onClick={() => onSelectClient(c)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                  clientCode === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Progress / Green Status Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs transition ${
              isAllGreen
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center justify-between font-extrabold text-sm">
              <span>{isAllGreen ? '🟢 100% COMPLETE: Calendar Is Green!' : `In Progress: ${scheduledCount} of ${total} Scheduled`}</span>
              <span>{percentage}%</span>
            </div>
            <p className="text-[11px] mt-1 opacity-90">
              {isAllGreen
                ? `All required daily posts for ${client.name} are approved & scheduled.`
                : `Advance all items to Scheduled to turn ${client.name}'s calendar tile GREEN.`}
            </p>
          </div>

          {/* Deliverables List */}
          <div className="space-y-4">
            {clientItems.map(item => {
              const availableStages: ApprovalStage[] = ['Draft', 'For Checking', 'OA'];
              if (item.clientCode === 'IM') {
                availableStages.push('Client Approval');
              }
              availableStages.push('Scheduled');
              availableStages.push('Needs Revision');

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        {item.timePHT}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Assignee: <strong>{item.assigneeName}</strong> ({item.assigneeRole})
                      </p>
                    </div>

                    {/* Approval Stage Dropdown */}
                    <div className="text-right shrink-0">
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Approval Stage</label>
                      <select
                        value={item.stage}
                        onChange={e => handleStageChange(item, e.target.value as ApprovalStage)}
                        className="text-xs font-bold p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs focus:ring-2 focus:ring-indigo-500"
                      >
                        {availableStages.map(st => (
                          <option key={st} value={st}>
                            {st === 'Scheduled' ? '🟢 Scheduled' : st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Asset URL (Option A: Drive/Canva) */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">Asset Proof:</span>
                      <input
                        type="url"
                        value={item.assetUrl || ''}
                        onChange={e => handleAssetChange(item, e.target.value)}
                        placeholder="Paste Google Drive, Canva, or Figma link..."
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    {item.assetUrl && (
                      <a
                        href={item.assetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold shrink-0 flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Caption & Hashtags Textarea */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Caption & Target Hashtags</label>
                    <textarea
                      rows={2}
                      value={item.caption || ''}
                      onChange={e => handleCaptionChange(item, e.target.value)}
                      placeholder="Enter copywriting or target caption..."
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Checklist SOP Items */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" />
                      Actionable Checklist SOP
                    </span>
                    <div className="space-y-1">
                      {item.checklist.map(check => (
                        <label
                          key={check.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={check.completed}
                            onChange={() => handleToggleChecklist(item, check.id)}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span className={check.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                            {check.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Save & Update Calendar
          </button>
        </div>

      </div>
    </div>
  );
};
