import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApprovalStage } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStageBadge(stage: ApprovalStage) {
  switch (stage) {
    case 'Draft':
      return {
        label: '1. Draft',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
      };
    case 'For Checking':
      return {
        label: '2. For Checking',
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200'
      };
    case 'OA':
      return {
        label: '3. OA Review',
        badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200'
      };
    case 'Client Approval':
      return {
        label: 'Client Approval ⚠️',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 animate-pulse'
      };
    case 'Scheduled':
      return {
        label: 'Scheduled 🟢',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-300'
      };
    case 'Needs Revision':
      return {
        label: 'Needs Revision 🔴',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200'
      };
  }
}

export function formatPhilippineDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
