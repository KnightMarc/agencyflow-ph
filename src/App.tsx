import { useState, useEffect } from 'react';
import { DeliverableItem, ClientCode, ApprovalStage } from './types';
import { loadDeliverables, saveDeliverables } from './lib/storage';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { KanbanView } from './components/KanbanView';
import { MyTasksView } from './components/MyTasksView';
import { DayDrawer } from './components/DayDrawer';
import { ShiftReportModal } from './components/ShiftReportModal';
import { NewTaskModal } from './components/NewTaskModal';

export function App() {
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedClient, setSelectedClient] = useState<ClientCode | 'ALL'>('ALL');

  // Drawer & Modals state
  const [dayDrawerOpen, setDayDrawerOpen] = useState(false);
  const [selectedDrawerDate, setSelectedDrawerDate] = useState('2026-11-16');
  const [selectedDrawerClient, setSelectedDrawerClient] = useState<ClientCode>('GAE');
  
  const [shiftReportOpen, setShiftReportOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadDeliverables();
    setDeliverables(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateDeliverable = (updated: DeliverableItem) => {
    const updatedList = deliverables.map(item => item.id === updated.id ? updated : item);
    setDeliverables(updatedList);
    saveDeliverables(updatedList);
    showToast(`Updated: ${updated.clientCode} ${updated.title} → ${updated.stage}`);
  };

  const handleUpdateStage = (itemId: string, newStage: ApprovalStage) => {
    const updatedList = deliverables.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stage: newStage,
          completedAt: newStage === 'Scheduled' ? new Date().toISOString() : undefined
        };
      }
      return item;
    });
    setDeliverables(updatedList);
    saveDeliverables(updatedList);
    showToast(`Deliverable moved to: ${newStage}`);
  };

  const handleAddDeliverable = (newItem: DeliverableItem) => {
    const updatedList = [newItem, ...deliverables];
    setDeliverables(updatedList);
    saveDeliverables(updatedList);
    showToast(`Created new deliverable for ${newItem.clientCode}!`);
  };

  const handleOpenDayDrawer = (dateStr: string, clientCode: ClientCode) => {
    setSelectedDrawerDate(dateStr);
    setSelectedDrawerClient(clientCode);
    setDayDrawerOpen(true);
  };

  const handleOpenItemDetail = (item: DeliverableItem) => {
    setSelectedDrawerDate(item.targetDate);
    setSelectedDrawerClient(item.clientCode);
    setDayDrawerOpen(true);
  };

  // Urgent count for today
  const urgentCount = deliverables.filter(
    i => i.targetDate === '2026-11-16' && (i.stage === 'OA' || i.stage === 'Client Approval')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Sticky Navigation */}
      <Header
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
        onOpenShiftReport={() => setShiftReportOpen(true)}
        onOpenNewTask={() => setNewTaskOpen(true)}
      />

      {/* Workspace Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
          urgentCount={urgentCount}
        />

        {/* Main Dynamic Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentTab === 'dashboard' && (
            <DashboardView
              deliverables={deliverables}
              selectedClient={selectedClient}
              onOpenItemDetail={handleOpenItemDetail}
              onUpdateStage={handleUpdateStage}
              onSwitchToCalendar={() => setCurrentTab('calendar')}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              deliverables={deliverables}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
              onOpenDayDrawer={handleOpenDayDrawer}
            />
          )}

          {currentTab === 'kanban' && (
            <KanbanView
              deliverables={deliverables}
              selectedClient={selectedClient}
              onOpenItemDetail={handleOpenItemDetail}
              onUpdateStage={handleUpdateStage}
            />
          )}

          {currentTab === 'mytasks' && (
            <MyTasksView
              deliverables={deliverables}
              onOpenItemDetail={handleOpenItemDetail}
              onUpdateStage={handleUpdateStage}
            />
          )}
        </main>
      </div>

      {/* Slide-Over: Day Deliverables & Checklists */}
      <DayDrawer
        isOpen={dayDrawerOpen}
        onClose={() => setDayDrawerOpen(false)}
        dateStr={selectedDrawerDate}
        clientCode={selectedDrawerClient}
        onSelectClient={setSelectedDrawerClient}
        deliverables={deliverables}
        onUpdateItem={handleUpdateDeliverable}
      />

      {/* End of Shift Report Handover Modal */}
      <ShiftReportModal
        isOpen={shiftReportOpen}
        onClose={() => setShiftReportOpen(false)}
        deliverables={deliverables}
        onShowToast={showToast}
      />

      {/* Create Deliverable Modal */}
      <NewTaskModal
        isOpen={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onAddDeliverable={handleAddDeliverable}
      />

      {/* Instant Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-3 animate-slideUp">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
