// OriginalIntake component for Patient Detail page

import { useState } from "react";

function OriginalIntake() {
  // State for expanded/collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expanded state
  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Collapsible header */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold text-sage-800">
          View Original Intake Responses
        </h2>
        <span className="text-gray-400 text-sm">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {/* Collapsible content - fake data for testing */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {/* Q&A items */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Q: What brings you in today?
            </p>
            <p className="text-sm text-gray-500">
              I've been feeling extremely tired for the past 3 months. No matter
              how much I sleep, I wake up exhausted.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Q: How would you rate your energy levels on a scale of 1-10?
            </p>
            <p className="text-sm text-gray-500">3 out of 10</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Q: Are you currently taking any medications or supplements?
            </p>
            <p className="text-sm text-gray-500">Vitamin D daily (Alesse)</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Q: Do you have any known allergies?
            </p>
            <p className="text-sm text-gray-500">Penicillin - causes rash</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Q: Describe your typical diet
            </p>
            <p className="text-sm text-gray-500">
              I skip breakfast most days, have a salad or sandwich for lunch,
              and cook dinner at home about 4 times a week. I drink 2-3 coffees
              per day.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OriginalIntake;
