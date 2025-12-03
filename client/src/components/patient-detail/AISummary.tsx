// AISummary component for Patient Detail page
// Shows the AI-generated summary from patient intake - data comes from an llm ( to be implemented)

interface AISummaryProps {
  intakeDate: string;
  chiefComplaint: string;
  medications: string[];
  keyHistory: string;
  lifestyleFactors: string;
}

function AISummary({
  intakeDate,
  chiefComplaint,
  medications,
  keyHistory,
  lifestyleFactors,
}: AISummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      {/* Section header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-sage-800">
          AI-Generated Summary
        </h2>
        <p className="text-gray-400 text-sm">
          From intake completed {intakeDate}
        </p>
      </div>

      {/* Summary sections */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Chief Complaint
          </h3>
          <p className="text-gray-600 text-sm">{chiefComplaint}</p>
        </div>

        {/* Current Medications */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Current Medications
          </h3>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {medications.map((med, index) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
        </div>

        {/* Key History */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Key History
          </h3>
          <p className="text-gray-600 text-sm">{keyHistory}</p>
        </div>

        {/* Lifestyle Factors */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Lifestyle Factors
          </h3>
          <p className="text-gray-600 text-sm">{lifestyleFactors}</p>
        </div>
      </div>
    </div>
  );
}

export default AISummary;
