// PatientList component for IntakeAI
// Shows patients grouped by day (Today and Tomorrow)

import PatientCard from "./PatientCard";

// Define what a patient object looks like
export interface Patient {
  id: number;
  name: string;
  time: string;
  complaint: string;
  status: "ready" | "arrived" | "pending";
  hasConcerns: boolean;
  concernCount: number;
  updatedTime: string;
  isReturning: boolean;
  day: "today" | "tomorrow"; // Which day the appointment is on
}

interface PatientListProps {
  patients: Patient[];
}

function PatientList({ patients }: PatientListProps) {
  // Get today's date for the header
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Day and month names for formatting
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format today's date
  const todayDayName = dayNames[today.getDay()];
  const todayMonthName = monthNames[today.getMonth()];
  const todayDayNumber = today.getDate();

  // Format tomorrow's date
  const tomorrowDayName = dayNames[tomorrow.getDay()];
  const tomorrowMonthName = monthNames[tomorrow.getMonth()];
  const tomorrowDayNumber = tomorrow.getDate();

  // Split patients into today and tomorrow groups
  const todayPatients = patients.filter((p) => p.day === "today");
  const tomorrowPatients = patients.filter((p) => p.day === "tomorrow");

  return (
    <div>
      {/* Today's patients */}
      {todayPatients.length > 0 && (
        <div className="mb-8">
          {/* Schedule header for today */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              Schedule
            </span>
            <span className="text-gray-800 font-semibold">
              {todayDayName}, {todayMonthName} {todayDayNumber}
            </span>
          </div>

          {/* Today's patient cards */}
          <div>
            {todayPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patientName={patient.name}
                appointmentTime={patient.time}
                chiefComplaint={patient.complaint}
                status={patient.status}
                hasConcerns={patient.hasConcerns}
                concernCount={patient.concernCount}
                updatedTime={patient.updatedTime}
                isReturning={patient.isReturning}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tomorrow's patients */}
      {tomorrowPatients.length > 0 && (
        <div>
          {/* Schedule header for tomorrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              Schedule
            </span>
            <span className="text-gray-800 font-semibold">
              {tomorrowDayName}, {tomorrowMonthName} {tomorrowDayNumber}
            </span>
          </div>

          {/* Tomorrow's patient cards */}
          <div>
            {tomorrowPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patientName={patient.name}
                appointmentTime={patient.time}
                chiefComplaint={patient.complaint}
                status={patient.status}
                hasConcerns={patient.hasConcerns}
                concernCount={patient.concernCount}
                updatedTime={patient.updatedTime}
                isReturning={patient.isReturning}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show message if no patients */}
      {patients.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No patients scheduled for this view.
        </div>
      )}
    </div>
  );
}

export default PatientList;
