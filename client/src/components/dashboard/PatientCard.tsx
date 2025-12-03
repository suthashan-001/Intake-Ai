// PatientCard component for IntakeAI
// Shows a single patient's appointment info and brief stats in a card format
// This card is clickable for a more indepth view that is a separate page

import Avatar from "../ui/Avatar";

interface PatientCardProps {
  patientName: string;
  appointmentTime: string;
  chiefComplaint: string;
  status: "ready" | "arrived" | "pending";
  hasConcerns: boolean;
  concernCount: number;
  updatedTime: string;
  isReturning: boolean;
}

function PatientCard({
  patientName,
  appointmentTime,
  chiefComplaint,
  status,
  hasConcerns,
  concernCount,
  updatedTime,
  isReturning,
}: PatientCardProps) {
  // Figure out which badge style to show based on status
  let badgeStyles = "";
  let badgeText = "";

  if (status === "ready") {
    badgeStyles = "bg-green-100 text-green-700";
    badgeText = "READY FOR VISIT";
  } else if (status === "arrived") {
    badgeStyles = "bg-teal-100 text-teal-700";
    badgeText = "JUST ARRIVED";
  } else {
    badgeStyles = "bg-gray-100 text-gray-600";
    badgeText = "PENDING";
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 mb-3 hover:shadow-sm transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        {/* Left side - time and avatar */}
        <div className="flex gap-4">
          <div className="text-center w-16">
            <p className="text-gray-900 font-semibold text-sm">
              {appointmentTime}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Arrival
            </p>
            <div className="mt-3">
              <Avatar name={patientName} />
            </div>
          </div>

          {/* Middle - patient info */}
          <div className="flex-1">
            {/* Name and status badge */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900">
                {patientName}
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyles}`}
              >
                {badgeText}
              </span>
            </div>

            {/* Chief complaint */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-1">
              {chiefComplaint}
            </p>

            {/* Updated time and patient type */}
            <p className="text-gray-400 text-xs">
              Updated {updatedTime} ·{" "}
              {isReturning ? "Returning Patient" : "New Patient"}
            </p>
          </div>
        </div>

        {/* Right side - status indicator */}
        <div className="ml-4">
          {hasConcerns ? (
            // Alert indicator with review button
            <div className="flex items-center gap-3">
              {/* Alert text */}
              <div className="text-right">
                <p className="text-danger-500 font-medium text-sm">
                  {concernCount} Critical Alert{concernCount > 1 ? "s" : ""}
                </p>
                <p className="text-gray-400 text-xs">Needs review</p>
              </div>
              {/* Review button */}
              <button className="bg-danger-500 hover:bg-danger-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Review
              </button>
            </div>
          ) : (
            // Green checkmark for patients without concerns
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-green-500"
              >
                <path
                  d="M13.3 4.3L6 11.6L2.7 8.3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>All Clear</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientCard;
