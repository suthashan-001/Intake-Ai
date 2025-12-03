// PatientsFilterTabs component for My Patients page
// Shows filter tabs: All, Active care, With alerts, Intake pending

interface PatientsFilterTabsProps {
  selectedTab: "all" | "active" | "alerts" | "pending";
  onTabChange: (tab: "all" | "active" | "alerts" | "pending") => void;
}

function PatientsFilterTabs({
  selectedTab,
  onTabChange,
}: PatientsFilterTabsProps) {
  // All the tab options
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active care" },
    { id: "alerts", label: "With alerts" },
    { id: "pending", label: "Intake pending" },
  ] as const;

  return (
    <div className="px-6 mb-6">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          // Check if this tab is selected
          const isSelected = selectedTab === tab.id;

          // Different styles for selected vs not selected
          const tabStyles = isSelected
            ? "bg-sage-800 text-white"
            : "bg-transparent text-gray-500 hover:bg-gray-100";

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tabStyles}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PatientsFilterTabs;
