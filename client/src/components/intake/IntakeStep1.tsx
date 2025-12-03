// IntakeStep1.tsx
// Step 1: Personal Info + Chief Concern
// Collects: Name, DOB, Gender, and main reason for visit

import type { IntakeFormData } from "../../types/intake";

interface IntakeStep1Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

function IntakeStep1({ formData, updateFormData }: IntakeStep1Props) {
  return (
    <div>
      {/* Step heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to Your Intake Form
        </h2>
        <p className="text-gray-600">
          Please confirm your details and tell us why you're seeking care today.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* First Name - pre-filled and read-only */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            This field is pre-filled from your invitation
          </p>
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="Enter your last name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
          />
        </div>

        {/* Gender Identity */}
        <div>
          <label htmlFor="genderIdentity" className="block text-sm font-medium text-gray-700 mb-2">
            Gender Identity
          </label>
          <select
            id="genderIdentity"
            value={formData.genderIdentity}
            onChange={(e) => updateFormData({ genderIdentity: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none bg-white"
          >
            <option value="">Select your gender identity</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Chief Concern
          </h3>
        </div>

        {/* Chief Complaint */}
        <div>
          <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700 mb-2">
            What is the main reason for your visit today? <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={(e) => updateFormData({ chiefComplaint: e.target.value })}
            placeholder="Example: I've been experiencing chronic headaches for the past few months..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            Please be as specific as possible about what brought you in today.
          </p>
        </div>
      </div>
    </div>
  );
}

export default IntakeStep1;
