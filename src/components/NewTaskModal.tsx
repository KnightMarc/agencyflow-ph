import React, { useState } from 'react';
import { DeliverableItem, ClientCode, ApprovalStage } from '../types';
import { CLIENTS, SAMPLE_TEAM } from '../constants/clients';
import { X, Plus } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeliverable: (item: DeliverableItem) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddDeliverable
}) => {
  const [clientCode, setClientCode] = useState<ClientCode>('GAE');
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-16');
  const [timePHT, setTimePHT] = useState('10:00 AM PHT');
  const [assigneeName, setAssigneeName] = useState('Chloe Ramos');
  const [assetUrl, setAssetUrl] = useState('');
  const [stage, setStage] = useState<ApprovalStage>('Draft');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const member = SAMPLE_TEAM.find(m => m.name === assigneeName) || SAMPLE_TEAM[0];

    const newItem: DeliverableItem = {
      id: `${clientCode}-${targetDate}-${Date.now()}`,
      clientCode,
      title: title.trim(),
      targetDate,
      timePHT,
      stage,
      assetUrl: assetUrl.trim() || undefined,
      assigneeName: member.name,
      assigneeRole: member.role,
      checklist: [
        { id: 'c1', title: 'Asset rendered & uploaded', completed: false },
        { id: 'c2', title: 'Copywriting & hashtags verified', completed: false },
        { id: 'c3', title: 'Scheduled in Meta Business Suite', completed: false }
      ]
    };

    onAddDeliverable(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Create New Social Media Deliverable
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Client</label>
            <select
              value={clientCode}
              onChange={e => setClientCode(e.target.value as ClientCode)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
            >
              {(Object.keys(CLIENTS) as ClientCode[]).map(c => (
                <option key={c} value={c}>{CLIENTS[c].name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Deliverable Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Black Friday Static Graphic #2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PHT Schedule Time</label>
              <select
                value={timePHT}
                onChange={e => setTimePHT(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              >
                <option value="08:00 AM PHT">08:00 AM PHT (Bible Verse)</option>
                <option value="10:00 AM PHT">10:00 AM PHT (Static / Reel)</option>
                <option value="10:15 AM PHT">10:15 AM PHT (5 Stories)</option>
                <option value="12:00 PM PHT">12:00 PM PHT (Reels)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assignee</label>
              <select
                value={assigneeName}
                onChange={e => setAssigneeName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {SAMPLE_TEAM.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Starting Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as ApprovalStage)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              >
                <option value="Draft">1. Draft</option>
                <option value="For Checking">2. For Checking</option>
                <option value="OA">3. OA Review</option>
                <option value="Scheduled">4. Scheduled 🟢</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Asset Link (Canva / Drive)</label>
            <input
              type="url"
              placeholder="https://canva.com/design/..."
              value={assetUrl}
              onChange={e => setAssetUrl(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
            >
              Create Deliverable
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
