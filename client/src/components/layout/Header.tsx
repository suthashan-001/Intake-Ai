// Header component for IntakeAI
// Display's greeting and clinic overview message

import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";

interface SearchPatient {
  id: number;
  name: string;
  complaint?: string;
}

interface HeaderProps {
  doctorName: string;
  patients: SearchPatient[];
  onInviteClick?: () => void;
}

function Header({ doctorName, patients, onInviteClick }: HeaderProps) {
  // Figure out what greeting to show based on time of day
  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  // Handle invite button click
  function handleInviteClick() {
    if (onInviteClick) {
      onInviteClick();
    }
  }

  return (
    <div className="flex items-center justify-between p-6 bg-gray-50">
      {/* Left side - greeting */}
      <div>
        <h1 className="text-3xl font-bold text-sage-800">
          {getGreeting()}, {doctorName}.
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your clinic overview for today.
        </p>
      </div>

      {/* Right side - search and invite button */}
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Find a patient..." patients={patients} />
        <Button type="primary" onClick={handleInviteClick}>
          + Invite Patient
        </Button>
      </div>
    </div>
  );
}

export default Header;
