// MyPatientsPage - Shows the list of all patients

import { useState } from "react";
import "../index.css";

// Layout components
import Sidebar from "../components/layout/Sidebar";

// Patient page components
import PatientsHeader from "../components/patients/PatientsHeader";
import PatientsStats from "../components/patients/PatientsStats";
import PatientsFilterTabs from "../components/patients/PatientsFilterTabs";
import PatientsList from "../components/patients/PatientsList";
import type { Patient } from "../components/patients/PatientsList";

// Modal components
import InvitePatientModal from "../components/modals/InvitePatientModal";

// Mock data for testing ui purposes - this would come from the API in future versions of the app
const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    focusArea: "Fatigue",
    nextVisit: "Jan 12",
    lastSeen: "Nov 12",
    hasAlerts: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    focusArea: "Sleep optimization",
    nextVisit: "Jan 14",
    lastSeen: "Oct 10",
    hasAlerts: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    focusArea: "Iron deficiency workup",
    nextVisit: "Scheduling...",
    lastSeen: null,
    hasAlerts: true,
  },
  {
    id: 4,
    name: "Liam Patel",
    focusArea: "regular checkup",
    nextVisit: "Feb 01",
    lastSeen: "Nov 01",
    hasAlerts: false,
  },
];

function MyPatientsPage() {
  // State for the selected filter tab
  const [selectedTab, setSelectedTab] = useState<
    "all" | "active" | "alerts" | "pending"
  >("all");

  // State for the Invite Patient modal --- clicking invite patient button
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Handle tab change
  function handleTabChange(tab: "all" | "active" | "alerts" | "pending") {
    setSelectedTab(tab);
  }

  // Handle opening the invite modal
  function handleInviteClick() {
    setIsInviteModalOpen(true);
  }

  // Handle closing the invite modal
  function handleInviteModalClose() {
    setIsInviteModalOpen(false);
  }

  // Filter patients based on selected tab
  let filteredPatients = mockPatients;

  // ========================================
  //  Logic of how patients are displayed in dashboard
  // ========================================

  if (selectedTab === "active") {
    // Show patients with a last seen date (they are in active care)
    filteredPatients = mockPatients.filter(
      (patient) => patient.lastSeen !== null
    );
  } else if (selectedTab === "alerts") {
    // Show patients with alerts
    filteredPatients = mockPatients.filter(
      (patient) => patient.hasAlerts === true
    );
  } else if (selectedTab === "pending") {
    // Show patients with no last seen date (intake pending)
    filteredPatients = mockPatients.filter(
      (patient) => patient.lastSeen === null
    );
  }

  // Calculate stats
  const totalCount = mockPatients.length;
  const activeCount = mockPatients.filter((p) => p.lastSeen !== null).length;
  const alertsCount = mockPatients.filter((p) => p.hasAlerts).length;

  return (
    <div className="flex min-h-screen">
      {/*left side sidebar*/}
      <Sidebar doctorName="Dr. Rey" doctorTitle="NATUROPATHIC ND" />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sage-50/50 to-transparent pointer-events-none"></div>

        {/* Page content */}
        <div className="relative">
          {/* Header with title and search */}
          <PatientsHeader
            patients={mockPatients.map(p => ({ id: p.id, name: p.name, complaint: p.focusArea }))}
            onInviteClick={handleInviteClick}
          />

          {/* Stats line */}
          <PatientsStats
            totalCount={totalCount}
            activeCount={activeCount}
            alertsCount={alertsCount}
          />

          {/* Filter tabs */}
          <PatientsFilterTabs
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />

          {/* Patient list */}
          <PatientsList patients={filteredPatients} />
        </div>
      </div>

      {/* Invite Patient Modal */}
      <InvitePatientModal
        isOpen={isInviteModalOpen}
        onClose={handleInviteModalClose}
      />
    </div>
  );
}

export default MyPatientsPage;
