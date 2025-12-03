// Sidebar component for IntakeAI - navigation menu

import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  doctorName: string;
  doctorTitle: string;
}

// Leaf logo icon
function LeafIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* figma-svg path */}
      <path
        d="M12 3C12 3 5 7 5 14C5 17.5 7.5 21 12 21C16.5 21 19 17.5 19 14C19 7 12 3 12 3Z"
        stroke="#c7d0c7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 21V9"
        stroke="#c7d0c7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sidebar({ doctorName, doctorTitle }: SidebarProps) {
  // Get the current route to highlight active nav item
  const location = useLocation();
  const currentPath = location.pathname;

  // Get initials from doctor name for avatar profile pic
  // Example: "Dr. Rey" becomes "DR"
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Check if a nav link is active
  function isActive(path: string) {
    return currentPath === path;
  }

  const activeStyles =
    "block bg-sage-700 rounded-lg px-4 py-3 mb-1 flex items-center justify-between text-white font-medium";
  const inactiveStyles =
    "block px-4 py-3 mb-1 rounded-lg text-sage-300 hover:bg-sage-700 hover:text-white transition-colors";

  return (
    <div className="w-64 bg-sage-800 min-h-screen flex flex-col">
      {/* Logo at the top */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <LeafIcon />
          <span className="text-white text-xl font-bold">IntakeAI</span>
        </div>
      </div>

      {/* Navigation Links  in sidebar */}
      <nav className="flex-1 px-3 mt-4">
        {/* Home Dashboard link */}
        <Link to="/" className={isActive("/") ? activeStyles : inactiveStyles}>
          <span>Dashboard</span>
          {/* Badge showing number of items to review ( updates ) */}
          {isActive("/") && (
            <span className="bg-sage-600 text-white text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          )}
        </Link>

        {/* My Patients link */}
        <Link
          to="/patients"
          className={isActive("/patients") ? activeStyles : inactiveStyles}
        >
          My Patients
        </Link>

        {/* Intake Links link */}
        <Link
          to="/intake-links"
          className={isActive("/intake-links") ? activeStyles : inactiveStyles}
        >
          Intake Links
        </Link>

        {/* Practice Settings link */}
        <Link
          to="/settings"
          className={isActive("/settings") ? activeStyles : inactiveStyles}
        >
          Practice Settings
        </Link>
      </nav>

      {/* Doctor info at the bottom */}
      <div className="p-4 border-t border-sage-700">
        <div className="flex items-center gap-3">
          {/* Doctor avatar circle with initials */}
          <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(doctorName)}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{doctorName}</p>
            <p className="text-sage-400 text-xs">{doctorTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
