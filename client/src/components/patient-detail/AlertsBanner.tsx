// AlertsBanner component for Patient Detail page
// Shows critical alerts if patient has any

interface AlertsBannerProps {
  alerts: string[];
}

function AlertsBanner({ alerts }: AlertsBannerProps) {
  // Don't display anything if no alerts
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mx-6 mb-6 bg-danger-50 border border-danger-200 rounded-xl p-4">
      {/* Alert header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚠️</span>
        <span className="text-danger-600 font-semibold">
          {alerts.length} Critical Alert{alerts.length > 1 ? "s" : ""}{" "}
          Identified
        </span>
      </div>

      {/* List of alerts */}
      <ul className="list-disc list-inside text-danger-600 text-sm space-y-1">
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsBanner;
