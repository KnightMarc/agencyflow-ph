import { ClientCode, ClientProfile } from '../types';

export const CLIENTS: Record<ClientCode, ClientProfile> = {
  GAE: {
    code: 'GAE',
    name: 'GAE',
    color: '#8b5cf6',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    badgeBg: 'bg-purple-100 dark:bg-purple-950',
    badgeText: 'text-purple-800 dark:text-purple-300',
    description: '4 posts/day (Mon-Sun): 1 Bible Verse (8am), 1 Static (10am), 5 Stories (10:15am), 1 Reel (12pm)'
  },
  AE: {
    code: 'AE',
    name: 'AE',
    color: '#3b82f6',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    badgeBg: 'bg-blue-100 dark:bg-blue-950',
    badgeText: 'text-blue-800 dark:text-blue-300',
    description: '2 posts/day: 1 Static or Reel (10am), 5 Stories (10:15am)'
  },
  Bitstop: {
    code: 'Bitstop',
    name: 'Bitstop',
    color: '#f59e0b',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-800 dark:text-amber-300',
    description: '2 posts/day: 1 Static or Reel (10am), 5 Stories (10:15am)'
  },
  OAA: {
    code: 'OAA',
    name: 'OAA',
    color: '#f43f5e',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    badgeBg: 'bg-rose-100 dark:bg-rose-950',
    badgeText: 'text-rose-800 dark:text-rose-300',
    description: 'Dynamic Schedule: Weekdays (1S+1R+5St), Sat (2S+1R+5St), Sun (1S+2R+5St), Holiday (2R+2S+5St)'
  },
  IM: {
    code: 'IM',
    name: 'IM',
    color: '#10b981',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    description: '2 posts/day (10am, 10:15am) + 3 posts/week quota. Client Approval mandatory before scheduling.',
    requiresClientApproval: true
  }
};

export const SAMPLE_TEAM: { id: string; name: string; role: 'Lead' | 'Designer' | 'Video Editor' | 'SMM'; avatarBg: string }[] = [
  { id: 'u1', name: 'Jeevi', role: 'Lead', avatarBg: 'bg-indigo-600' },
  { id: 'u2', name: 'Sarah Chen', role: 'SMM', avatarBg: 'bg-purple-600' },
  { id: 'u3', name: 'Chloe Ramos', role: 'Designer', avatarBg: 'bg-pink-600' },
  { id: 'u4', name: 'Mark Bautista', role: 'Video Editor', avatarBg: 'bg-amber-600' }
];

export function getExpectedDeliverables(
  clientCode: ClientCode,
  dateStr: string,
  isHoliday = false
): { title: string; timePHT: string; role: 'Designer' | 'Video Editor' | 'SMM' | 'Lead' }[] {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

  switch (clientCode) {
    case 'GAE':
      return [
        { title: 'Bible Verse (BV)', timePHT: '08:00 AM PHT', role: 'SMM' },
        { title: 'Static Graphic', timePHT: '10:00 AM PHT', role: 'Designer' },
        { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' },
        { title: 'Reel Video', timePHT: '12:00 PM PHT', role: 'Video Editor' }
      ];

    case 'AE':
      return [
        { title: 'Static Graphic or Reel', timePHT: '10:00 AM PHT', role: 'Designer' },
        { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' }
      ];

    case 'Bitstop':
      return [
        { title: 'Static Graphic or Reel', timePHT: '10:00 AM PHT', role: 'Designer' },
        { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' }
      ];

    case 'OAA':
      if (isHoliday) {
        return [
          { title: 'Holiday Static Graphic #1', timePHT: '10:00 AM PHT', role: 'Designer' },
          { title: 'Holiday Static Graphic #2', timePHT: '10:00 AM PHT', role: 'Designer' },
          { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' },
          { title: 'Holiday Reel #1', timePHT: '12:00 PM PHT', role: 'Video Editor' },
          { title: 'Holiday Reel #2', timePHT: '12:00 PM PHT', role: 'Video Editor' }
        ];
      }
      if (dayOfWeek === 6) {
        // Saturday
        return [
          { title: 'Saturday Static #1', timePHT: '10:00 AM PHT', role: 'Designer' },
          { title: 'Saturday Static #2', timePHT: '10:00 AM PHT', role: 'Designer' },
          { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' },
          { title: 'Saturday Reel', timePHT: '12:00 PM PHT', role: 'Video Editor' }
        ];
      }
      if (dayOfWeek === 0) {
        // Sunday
        return [
          { title: 'Sunday Static Graphic', timePHT: '10:00 AM PHT', role: 'Designer' },
          { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' },
          { title: 'Sunday Reel #1', timePHT: '12:00 PM PHT', role: 'Video Editor' },
          { title: 'Sunday Reel #2', timePHT: '12:00 PM PHT', role: 'Video Editor' }
        ];
      }
      // Weekdays (Mon-Fri)
      return [
        { title: 'Weekday Static Graphic', timePHT: '10:00 AM PHT', role: 'Designer' },
        { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' },
        { title: 'Weekday Reel', timePHT: '12:00 PM PHT', role: 'Video Editor' }
      ];

    case 'IM':
      return [
        { title: 'Daily Post (Static or Reel)', timePHT: '10:00 AM PHT', role: 'Designer' },
        { title: '5 Stories Batch', timePHT: '10:15 AM PHT', role: 'SMM' }
      ];
  }
}
