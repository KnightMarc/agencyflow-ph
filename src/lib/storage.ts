import { DeliverableItem, ClientCode, ShiftReport } from '../types';
import { CLIENTS, getExpectedDeliverables, SAMPLE_TEAM } from '../constants/clients';

const STORAGE_KEY = 'agencyflow_deliverables_v1';
const REPORTS_KEY = 'agencyflow_reports_v1';
const SUPABASE_CONFIG_KEY = 'agencyflow_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return { url: '', anonKey: '', connected: false };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
}

// Generate realistic seed data for November 2026
function generateSeedDeliverables(): DeliverableItem[] {
  const items: DeliverableItem[] = [];
  const currentYear = 2026;
  const currentMonth = 11; // November

  for (let day = 1; day <= 30; day++) {
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${dayStr}`;

    (Object.keys(CLIENTS) as ClientCode[]).forEach(clientCode => {
      const expected = getExpectedDeliverables(clientCode, dateStr, false);

      expected.forEach((exp, idx) => {
        let stage: DeliverableItem['stage'] = 'Draft';
        let assetUrl: string | undefined = undefined;

        if (day < 16) {
          // All prior days 100% Scheduled (Green!)
          stage = 'Scheduled';
          assetUrl = 'https://drive.google.com/agency-archive';
        } else if (day === 16) {
          // Today (Nov 16)
          if (clientCode === 'GAE') {
            if (exp.timePHT === '12:00 PM PHT') {
              stage = 'OA'; // In Lead OA review
              assetUrl = 'https://drive.google.com/gae-reel-v2';
            } else {
              stage = 'Scheduled';
              assetUrl = 'https://canva.com/design/gae-post';
            }
          } else if (clientCode === 'IM') {
            if (exp.timePHT === '10:00 AM PHT') {
              stage = 'Client Approval'; // Waiting on WhatsApp signoff
              assetUrl = 'https://canva.com/design/im-post';
            } else {
              stage = 'Scheduled';
              assetUrl = 'https://drive.google.com/im-stories';
            }
          } else {
            stage = 'Scheduled';
            assetUrl = 'https://canva.com/design/asset-live';
          }
        } else if (day === 17) {
          // Tomorrow
          stage = idx % 2 === 0 ? 'For Checking' : 'Draft';
          assetUrl = idx % 2 === 0 ? 'https://canva.com/design/draft' : undefined;
        } else {
          stage = 'Draft';
        }

        // Assign to sample team member
        const assignedMember = SAMPLE_TEAM.find(m => m.role === exp.role) || SAMPLE_TEAM[0];

        items.push({
          id: `${clientCode}-${dateStr}-${idx}`,
          clientCode,
          title: exp.title,
          targetDate: dateStr,
          timePHT: exp.timePHT,
          stage,
          assetUrl,
          caption: `Official posting for @${clientCode.toLowerCase()}_official. #Marketing #Philippines #AgencyLife`,
          assigneeName: assignedMember.name,
          assigneeRole: exp.role,
          notes: 'Ensure branding guidelines and logo spacing adhere to client brand book.',
          checklist: [
            { id: 'c1', title: 'Asset rendered & resolution verified (1080x1350 for static, 1080x1920 for reels)', completed: stage === 'Scheduled' || stage === 'OA' },
            { id: 'c2', title: 'Copywriting & target hashtags approved', completed: stage === 'Scheduled' || stage === 'OA' },
            { id: 'c3', title: 'Uploaded to Meta Business Suite / Scheduler', completed: stage === 'Scheduled' }
          ]
        });
      });
    });
  }

  return items;
}

export function loadDeliverables(): DeliverableItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = generateSeedDeliverables();
    saveDeliverables(seed);
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const seed = generateSeedDeliverables();
    saveDeliverables(seed);
    return seed;
  }
}

export function saveDeliverables(items: DeliverableItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadShiftReports(): ShiftReport[] {
  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveShiftReport(report: ShiftReport): void {
  const reports = loadShiftReports();
  reports.unshift(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}
