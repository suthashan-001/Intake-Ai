// PatientsHeader component for --- My Patients page

import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";

// Patient type for search
interface SearchPatient {
  id: number;
  name: string;
  complaint?: string;
}

interface PatientsHeaderProps {
  patients: SearchPatient[];
  onInviteClick?: () => void;
}

function PatientsHeader({ patients, onInviteClick }: PatientsHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 p-6">
      {/* Left side - title and subtitle */}
      <div>
        <h1 className="text-3xl font-light text-sage-800 mb-1">My Patients</h1>
        <p className="text-gray-500">
          Your patient panel. IntakeAI keeps track of ongoing care and
          follow-ups.
        </p>
      </div>

      {/* Right side - search and invite button */}
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search patients..."
          patients={patients}
        />
        <Button type="primary" onClick={onInviteClick}>+ Invite Patient</Button>
      </div>
    </div>
  );
}

export default PatientsHeader;
