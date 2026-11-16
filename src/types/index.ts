export type ClientCode = 'GAE' | 'AE' | 'Bitstop' | 'OAA' | 'IM';

export type ApprovalStage = 
  | 'Draft' 
  | 'For Checking' 
  | 'OA' 
  | 'Client Approval' 
  | 'Scheduled' 
  | 'Needs Revision';

export interface DeliverableItem {
  id: string;
  clientCode: ClientCode;
  title: string;
  targetDate: string; // YYYY-MM-DD
  timePHT: string; // e.g. "08:00 AM PHT"
  stage: ApprovalStage;
  assetUrl?: string;
  caption?: string;
  assigneeName: string;
  assigneeAvatar?: string;
  assigneeRole: 'Designer' | 'Video Editor' | 'SMM' | 'Lead';
  notes?: string;
  checklist: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  completedAt?: string;
}

export interface ClientProfile {
  code: ClientCode;
  name: string;
  color: string;
  bgLight: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  requiresClientApproval?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Lead' | 'Designer' | 'Video Editor' | 'SMM';
  avatarBg: string;
}

export interface ShiftReport {
  id: string;
  userName: string;
  date: string;
  summaryText: string;
  blockersText?: string;
  createdAt: string;
}
