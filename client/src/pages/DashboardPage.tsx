//Main dashboard

import { useState } from "react";
import "../index.css";

// Layout components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// Dashboard components
import StatsBox from "../components/dashboard/StatsBox";
import FilterTabs from "../components/dashboard/FilterTabs";
import PatientList from "../components/dashboard/PatientList";
import type { Patient } from "../components/dashboard/PatientList";

// Modal components
import InvitePatientModal from "../components/modals/InvitePatientModal";

// !Note : Mock data for testing - this would come from the API in future versions
// Includes patients for today and tomorrow
const mockPatients: Patient[] = [
  // Today's patients
  {
    id: 1,
    name: "Michael Chen",
    time: "10:00 AM",
    complaint:
      "Insomnia and high stress levels affecting work performance. Waking up at 3am every night.",
    status: "ready",
    hasConcerns: false,
    concernCount: 0,
    updatedTime: "2h ago",
    isReturning: true,
    day: "today",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    time: "2:30 PM",
    complaint:
      "Chronic fatigue and digestive issues worsening over the last 3 months. Feeling drained constantly.",
    status: "arrived",
    hasConcerns: true,
    concernCount: 2,
    updatedTime: "2h ago",
    isReturning: true,
    day: "today",
  },
  {
    id: 3,
    name: "Emma Wilson",
    time: "4:15 PM",
    complaint:
      "History of anemia, now experiencing shortness of breath and dizziness on minimal exertion.",
    status: "pending",
    hasConcerns: true,
    concernCount: 1,
    updatedTime: "2h ago",
    isReturning: true,
    day: "today",
  },
  // Tomorrow's patients
  {
    id: 4,
    name: "Liam Patel",
    time: "9:00 AM",
    complaint:
      "Bloating, alternating constipation and loose stools, and brain fog, especially after meals.",
    status: "arrived",
    hasConcerns: false,
    concernCount: 0,
    updatedTime: "2h ago",
    isReturning: true,
    day: "tomorrow",
  },
  {
    id: 5,
    name: "David Thompson",
    time: "11:00 AM",
    complaint:
      "Recurring headaches and neck pain. Has been taking ibuprofen daily for the past 2 weeks.",
    status: "pending",
    hasConcerns: true,
    concernCount: 1,
    updatedTime: "3h ago",
    isReturning: false,
    day: "tomorrow",
  },
  {
    id: 6,
    name: "Emily Watson",
    time: "2:00 PM",
    complaint:
      "Follow-up for anxiety management. Feeling much better since starting the new protocol.",
    status: "ready",
    hasConcerns: false,
    concernCount: 0,
    updatedTime: "4h ago",
    isReturning: true,
    day: "tomorrow",
  },
];

function DashboardPage() {
  // State for the active filter tab
  const [activeTab, setActiveTab] = useState<"today" | "pending" | "alerts">(
    "today"
  );

  // State for the Invite Patient modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Handle tab click
  function handleTabClick(tab: "today" | "pending" | "alerts") {
    setActiveTab(tab);
  }

  // Handle opening the invite patients action
  function handleInviteClick() {
    setIsInviteModalOpen(true);
  }

  // Handle closing the invite patient action
  function handleInviteModalClose() {
    setIsInviteModalOpen(false);
  }

  // Filter patients based on active tab
  let filteredPatients = mockPatients;

  if (activeTab === "pending") {
    filteredPatients = mockPatients.filter(
      (patient) => patient.status === "pending" || patient.status === "arrived"
    );
  } else if (activeTab === "alerts") {
    filteredPatients = mockPatients.filter(
      (patient) => patient.hasConcerns === true
    );
  }

  // Count dashboard stats
  const alertsCount = mockPatients.filter((p) => p.hasConcerns).length;
  const appointmentsCount = mockPatients.length;
  const pendingCount = mockPatients.filter(
    (p) => p.status === "pending" || p.status === "arrived"
  ).length;

  return (
    // main dashboard output layout
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      {/* Display doctor credentials */}
      <Sidebar doctorName="Dr. Rey" doctorTitle="NATUROPATHIC ND" />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sage-50/50 to-transparent pointer-events-none"></div>

        <Header
          doctorName="Dr. Rey"
          patients={mockPatients.map(p => ({ id: p.id, name: p.name, complaint: p.complaint }))}
          onInviteClick={handleInviteClick}
        />

        {/* Dashboard content */}
        <div className="p-6 relative">
          {/* Stats box */}
          <div className="mb-6">
            <StatsBox
              alertsCount={alertsCount}
              appointmentsCount={appointmentsCount}
              pendingCount={pendingCount}
            />
          </div>

          {/* Filter tabs */}
          <FilterTabs
            activeTab={activeTab}
            alertsCount={alertsCount}
            onTabClick={handleTabClick}
          />

          {/* Patient list */}
          <PatientList patients={filteredPatients} />
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

export default DashboardPage;
