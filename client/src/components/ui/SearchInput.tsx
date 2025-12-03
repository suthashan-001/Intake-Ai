// SearchInput component for IntakeAI
// Search bar with dropdown results

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Patient type for search results
interface SearchPatient {
  id: number;
  name: string;
  complaint?: string;
}

interface SearchInputProps {
  placeholder: string;
  patients: SearchPatient[];
}

function SearchInput({ placeholder, patients }: SearchInputProps) {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter patients based on search text
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle typing in search box
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
    setIsOpen(event.target.value.length > 0);
  }

  // Handle clicking on a patient result
  function handlePatientClick(patientId: number) {
    setSearchText("");
    setIsOpen(false);
    navigate(`/patients/${patientId}`);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleChange}
        onFocus={() => searchText.length > 0 && setIsOpen(true)}
        className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:border-sage-500"
      />

      {/* Dropdown with results */}
      {isOpen && filteredPatients.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientClick(patient.id)}
              className="px-4 py-3 hover:bg-sage-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-800">{patient.name}</div>
              {patient.complaint && (
                <div className="text-sm text-gray-500 truncate">
                  {patient.complaint}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && searchText.length > 0 && filteredPatients.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-gray-500 text-center">
          No patients found
        </div>
      )}
    </div>
  );
}

export default SearchInput;
