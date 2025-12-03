// PatientsList component for My Patients page
// Renders a list of PatientRow components

import PatientRow from "./PatientRow";

// Type for a single patient
export interface Patient {
  id: number;
  name: string;
  focusArea: string;
  nextVisit: string;
  lastSeen: string | null;
  hasAlerts: boolean;
}

interface PatientsListProps {
  patients: Patient[];
}

function PatientsList({ patients }: PatientsListProps) {
  return (
    <div className="px-6 space-y-3">
      {patients.map((patient) => (
        <PatientRow
          key={patient.id}
          id={patient.id}
          name={patient.name}
          focusArea={patient.focusArea}
          nextVisit={patient.nextVisit}
          lastSeen={patient.lastSeen}
          hasAlerts={patient.hasAlerts}
        />
      ))}
    </div>
  );
}

export default PatientsList;
