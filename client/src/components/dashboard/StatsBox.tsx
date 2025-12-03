// StatsBox component for IntakeAI
// Shows a white box with 3 stats: alerts, appointments, pending review

interface StatsBoxProps {
  alertsCount: number;
  appointmentsCount: number;
  pendingCount: number;
}

function StatsBox({
  alertsCount,
  appointmentsCount,
  pendingCount,
}: StatsBoxProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 py-4 px-6 flex items-center shadow-sm">
      {/* Alerts to review - has red dot indicator */}
      <div className="flex items-center gap-2 pr-6">
        <span className="w-2 h-2 bg-danger-500 rounded-full"></span>
        <span className="text-gray-700 text-sm">
          <span className="font-semibold text-gray-900">{alertsCount}</span>{" "}
          alerts to review
        </span>
      </div>

      {/* Divider line */}
      <div className="w-px h-5 bg-gray-200"></div>

      {/* Appointments count */}
      <div className="flex items-center gap-2 px-6">
        <span className="text-gray-700 text-sm">
          <span className="font-semibold text-gray-900">
            {appointmentsCount}
          </span>{" "}
          appointments
        </span>
      </div>

      {/* Divider line */}
      <div className="w-px h-5 bg-gray-200"></div>

      {/* Pending review count */}
      <div className="flex items-center gap-2 pl-6">
        <span className="text-gray-700 text-sm">
          <span className="font-semibold text-gray-900">{pendingCount}</span>{" "}
          pending review
        </span>
      </div>
    </div>
  );
}

export default StatsBox;
