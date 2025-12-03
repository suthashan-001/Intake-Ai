// IntakeStep3.tsx
// Step 3: Review & Submit
// Shows summary of all answers before final submission

import type { IntakeFormData } from "../../types/intake";

interface IntakeStep3Props {
  formData: IntakeFormData;
  onEdit: (step: number) => void;
}

// Helper to display a field value or "Not provided"
function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className={value ? "text-gray-900" : "text-gray-400 italic"}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

function IntakeStep3({ formData, onEdit }: IntakeStep3Props) {
  return (
    <div>
      {/* Step heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600">
          Please review your answers before submitting.
        </p>
      </div>

      {/* Review sections */}
      <div className="space-y-6">
        {/* Section 1: Personal Info + Chief Concern */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Personal Info & Chief Concern
            </h3>
            <button
              onClick={() => onEdit(1)}
              className="text-sage-700 hover:text-sage-800 text-sm font-medium"
            >
              Edit
            </button>
          </div>
          <div className="text-sm divide-y divide-gray-100">
            <FieldValue
              label="Name"
              value={`${formData.firstName} ${formData.lastName}`.trim()}
            />
            <FieldValue label="Date of Birth" value={formData.dateOfBirth} />
            <FieldValue label="Gender" value={formData.genderIdentity} />
            <div className="py-2">
              <span className="font-medium text-gray-700">Chief Concern:</span>
              <p
                className={`mt-1 ${
                  formData.chiefComplaint
                    ? "text-gray-900"
                    : "text-gray-400 italic"
                }`}
              >
                {formData.chiefComplaint || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Health Details */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Health Details</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-sage-700 hover:text-sage-800 text-sm font-medium"
            >
              Edit
            </button>
          </div>
          <div className="text-sm divide-y divide-gray-100">
            <div className="py-2">
              <span className="font-medium text-gray-700">Symptoms:</span>
              <p
                className={`mt-1 ${
                  formData.symptoms ? "text-gray-900" : "text-gray-400 italic"
                }`}
              >
                {formData.symptoms || "Not provided"}
              </p>
            </div>
            <FieldValue label="Duration" value={formData.symptomDuration} />
            <div className="py-2">
              <span className="font-medium text-gray-700">
                Medical History:
              </span>
              <p
                className={`mt-1 ${
                  formData.medicalHistory
                    ? "text-gray-900"
                    : "text-gray-400 italic"
                }`}
              >
                {formData.medicalHistory || "Not provided"}
              </p>
            </div>
            <div className="py-2">
              <span className="font-medium text-gray-700">Family History:</span>
              <p
                className={`mt-1 ${
                  formData.familyHistory
                    ? "text-gray-900"
                    : "text-gray-400 italic"
                }`}
              >
                {formData.familyHistory || "Not provided"}
              </p>
            </div>
            <div className="py-2">
              <span className="font-medium text-gray-700">Lifestyle:</span>
              <p
                className={`mt-1 ${
                  formData.lifestyle ? "text-gray-900" : "text-gray-400 italic"
                }`}
              >
                {formData.lifestyle || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit notice */}
      <div className="mt-8 p-4 bg-sage-50 rounded-lg border border-sage-200">
        <p className="text-sage-800 text-sm">
          <span className="font-medium">Ready to submit?</span> Click the
          "Submit" button below to send your intake form to your healthcare
          provider.
        </p>
      </div>
    </div>
  );
}

export default IntakeStep3;
