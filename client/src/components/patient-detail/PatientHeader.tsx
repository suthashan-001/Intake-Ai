// PatientHeader component for Patient Detail page

import { Link } from "react-router-dom";
import Button from "../ui/Button";

interface PatientHeaderProps {
  name: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
}

function PatientHeader({
  name,
  gender,
  age,
  email,
  phone,
}: PatientHeaderProps) {
  return (
    <div className="p-6">
      <Link
        to="/patients"
        className="text-sage-600 hover:text-sage-800 text-sm mb-4 inline-block"
      >
        ← Back to My Patients
      </Link>

      {/* Patient name and actions row */}
      <div className="flex items-start justify-between">
        {/* Left side - name and info */}
        <div>
          <h1 className="text-3xl font-light text-sage-800 mb-2">{name}</h1>
          <p className="text-gray-500 text-sm">
            {gender} · {age} years old · {email} · {phone}
          </p>
        </div>

        {/* Right side - action buttons */}
        <div className="flex items-center gap-2">
          <Button type="primary">+ Invite Patient</Button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            •••
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientHeader;
