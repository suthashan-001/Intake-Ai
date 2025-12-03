// PatientRow component for My Patients page
// Shows a single patient row with their info and status
// Clicking the row navigates to the patient detail page

import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

interface PatientRowProps {
  id: number;
  name: string;
  focusArea: string;
  nextVisit: string;
  lastSeen: string | null;
  hasAlerts: boolean;
}

function PatientRow({
  id,
  name,
  focusArea,
  nextVisit,
  lastSeen,
  hasAlerts,
}: PatientRowProps) {
  return (
    <Link
      to={`/patients/${id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between">
        {/* Left side - avatar and patient info */}
        <div className="flex items-center gap-4">
          <Avatar name={name} />

          {/* Patient name and details */}
          <div>
            {/* Name and focus area on same line */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sage-800">{name}</span>
              <span className="text-gray-500 text-sm">{focusArea}</span>
            </div>

            {/* Visit dates info */}
            <p className="text-gray-400 text-xs mt-0.5">
              Next visit: {nextVisit}
              {lastSeen && <span> · Last seen: {lastSeen}</span>}
            </p>
          </div>
        </div>

        {/* Right side - alerts and arrow */}
        <div className="flex items-center gap-4">
          {/* Show alert indicator if patient has alerts */}
          {hasAlerts && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-danger-500 rounded-full"></span>
              <span className="text-danger-500 text-sm">Alerts present</span>
            </div>
          )}

          {/* Arrow icon to go to individual patient page */}
          <span className="text-gray-400 text-lg">&gt;</span>
        </div>
      </div>
    </Link>
  );
}

export default PatientRow;
