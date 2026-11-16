# AgencyFlow PH — Marketing Operations & Deliverables Web App

An Asana-inspired social media management web app specifically architected for a Philippine digital marketing agency managing **5 core clients**: **GAE**, **AE**, **Bitstop**, **OAA**, and **IM**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🇵🇭 Core Features

### 1. Operations Command Center (Task Dashboard)
- **Priority Radar**: Flags tasks due within 2 hours or pending critical approvals.
- **Philippine Standard Time (PHT, UTC+8)**: Live Manila clock and schedule alarms.
- **1-Click Approvals**: Leads can sign off on OA or mark client approvals directly from the queue.

### 2. Progress Calendar ("Turn Green" Engine)
- **Master Agency Matrix**: View status of all 5 clients simultaneously across each day.
- **Client Green Rule**: When 100% of the day's post deliverables for a client reach `Scheduled`, that day turns solid **GREEN**!
- Amber indicates in-progress review; Red indicates an overdue/missed item.

### 3. Exact 5-Client Posting Timetables (PHT)
- **GAE (4 posts/day, Mon–Sun)**:
  - `08:00 AM`: 1 Bible Verse (BV)
  - `10:00 AM`: 1 Static Graphic
  - `10:15 AM`: 5 Stories Batch
  - `12:00 PM`: 1 Reel Video
- **AE (2 posts/day)**:
  - `10:00 AM`: 1 Static Graphic or Reel
  - `10:15 AM`: 5 Stories Batch
- **Bitstop (2 posts/day)**:
  - `10:00 AM`: 1 Static Graphic or Reel
  - `10:15 AM`: 5 Stories Batch
- **OAA (Dynamic Schedule)**:
  - *Weekdays*: 1 Static (10am), 5 Stories (10:15am), 1 Reel (12pm)
  - *Saturday*: 2 Static (10am), 5 Stories (10:15am), 1 Reel (12pm)
  - *Sunday*: 1 Static (10am), 5 Stories (10:15am), 2 Reels (12pm)
  - *Holiday*: 2 Reels (12pm), 2 Static (10am), 5 Stories (10:15am)
- **IM (Daily + Weekly Target)**:
  - `10:00 AM`: 1 Static or Reel
  - `10:15 AM`: 5 Stories Batch
  - Mandatory **Client Approval** stage before scheduling!

### 4. 4-Stage Approval Pipeline
- `1. Draft` ➔ `2. For Checking` ➔ `3. OA Review` (Lead Sign-off) ➔ `Client Approval` (IM) ➔ `4. Scheduled 🟢`

### 5. Creative Asset Proofs & Copywriting
- Direct links for **Google Drive**, **Canva**, or **Figma** with 1-click "Open" buttons.
- Caption and hashtags editor for copywriters.
- Step-by-step SOP checklist on every deliverable.

### 6. End of Shift Report Generator
- 1-click compilation of today's deliverables, completed items, and shift blockers.
- 1-click **"Copy to Clipboard"** formatted for Slack, Microsoft Teams, or WhatsApp handovers.

### 7. Dual-Mode Storage (Free Tier)
- Works out-of-the-box with browser `localStorage` persistence.
- Ready to plug into your free **Supabase PostgreSQL** database (500MB free quota).
