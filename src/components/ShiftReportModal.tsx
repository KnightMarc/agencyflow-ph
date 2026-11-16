import React, { useState, useEffect } from 'react';
import { DeliverableItem } from '../types';
import { X, Copy, Check, Moon } from 'lucide-react';
import { saveShiftReport } from '../lib/storage';

interface ShiftReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverables: DeliverableItem[];
  onShowToast: (msg: string) => void;
}

export const ShiftReportModal: React.FC<ShiftReportModalProps> = ({
  isOpen,
  onClose,
  deliverables,
  onShowToast
}) => {
  const [reportText, setReportText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const todayStr = '2026-11-16';
    const todayItems = deliverables.filter(d => d.targetDate === todayStr);

    const lines: string[] = [
      `📋 PHILIPPINE MARKETING END OF SHIFT REPORT — Jeevi (Lead)`,
      `Date: ${todayStr} (Philippine Standard Time, UTC+8)`,
      `==================================================================`,
      `LIVE CLIENT DELIVERABLES STATUS:`,
      ``
    ];

    const clients: ('GAE' | 'AE' | 'Bitstop' | 'OAA' | 'IM')[] = ['GAE', 'AE', 'Bitstop', 'OAA', 'IM'];

    clients.forEach(c => {
      const cItems = todayItems.filter(i => i.clientCode === c);
      const scheduled = cItems.filter(i => i.stage === 'Scheduled').length;
      const isFull = scheduled === cItems.length && cItems.length > 0;

      lines.push(`${isFull ? '🟢' : '🟡'} ${c} (${scheduled}/${cItems.length} Scheduled):`);
      cItems.forEach(item => {
        const isDone = item.stage === 'Scheduled';
        const assetInfo = item.assetUrl ? ` (Asset: ${item.assetUrl})` : '';
        lines.push(`  • ${item.timePHT} - ${item.title}: [${item.stage}] ${isDone ? '✅' : '⏳'}${assetInfo}`);
      });
      lines.push(``);
    });

    lines.push(`==================================================================`);
    lines.push(`⚠️ SHIFT HANDOVER & BLOCKERS:`);
    lines.push(`  • Follow up with IM client on WhatsApp regarding Static Graphic approval.`);
    lines.push(`  • Lead sign-off on GAE Reel is ready for scheduled drop at 12:00 PM PHT.`);
    lines.push(`  • All morning static posts (10:00 AM) & stories (10:15 AM) published.`);

    setReportText(lines.join('\n'));
  }, [isOpen, deliverables]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    onShowToast('📋 End-of-shift report copied to clipboard!');
    saveShiftReport({
      id: Date.now().toString(),
      userName: 'Jeevi (Lead)',
      date: '2026-11-16',
      summaryText: reportText,
      createdAt: new Date().toISOString()
    });
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Philippine Marketing End-of-Shift Report
              </h3>
              <p className="text-xs text-slate-500">Auto-compiled from all 5 clients for seamless Slack/Email handover</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ready-to-Paste Summary (Slack / Teams / WhatsApp)
          </label>
          <textarea
            rows={12}
            value={reportText}
            onChange={e => setReportText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-emerald-600">
            ✓ Auto-calculated across 5 clients (PHT)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
