// Patients Stats component for My Patients page

interface PatientsStatsProps {
  totalCount: number;
  activeCount: number;
  alertsCount: number;
}

function PatientsStats({
  totalCount,
  activeCount,
  alertsCount,
}: PatientsStatsProps) {
  return (
    <div className="px-6 mb-4">
      <p className="text-gray-500 text-sm">
        <span className="text-sage-700 font-semibold">{totalCount}</span>{" "}
        patients ·{" "}
        <span className="text-sage-700 font-semibold">{activeCount}</span> in
        active care ·{" "}
        <span className="text-sage-700 font-semibold">{alertsCount}</span> with
        alerts
      </p>
    </div>
  );
}

export default PatientsStats;
