// FilterTabs component for IntakeAI
// Shows filter buttons on left (Today, Pending Review, Alerts)
// Shows the AI LLM message on the right

interface FilterTabsProps {
  activeTab: "today" | "pending" | "alerts";
  alertsCount: number;
  onTabClick: (tab: "today" | "pending" | "alerts") => void;
}

function FilterTabs({ activeTab, alertsCount, onTabClick }: FilterTabsProps) {
  const baseTabStyles =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  const activeStyles = "bg-sage-800 text-white";
  const inactiveStyles =
    "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50";

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side - filter tabs */}
      <div className="flex items-center gap-2">
        {/* Today tab */}
        <button
          onClick={() => onTabClick("today")}
          className={`${baseTabStyles} ${
            activeTab === "today" ? activeStyles : inactiveStyles
          }`}
        >
          Today
        </button>

        {/* Pending Review tab */}
        <button
          onClick={() => onTabClick("pending")}
          className={`${baseTabStyles} ${
            activeTab === "pending" ? activeStyles : inactiveStyles
          }`}
        >
          Pending Review
        </button>

        {/* Alerts tab with red badge */}
        <button
          onClick={() => onTabClick("alerts")}
          className={`${baseTabStyles} flex items-center gap-2 ${
            activeTab === "alerts" ? activeStyles : inactiveStyles
          }`}
        >
          Alerts
          <span className="bg-danger-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {alertsCount}
          </span>
        </button>
      </div>

      {/* Right side - AI message in italics */}
      <div className="flex items-center gap-2 text-gray-400 text-sm italic">
        <span className="ai-symbol">✨</span>
        <span>
          All patient summaries are AI-prepared and ready for your review.
        </span>
      </div>
    </div>
  );
}

export default FilterTabs;
