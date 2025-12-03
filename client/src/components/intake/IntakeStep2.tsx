// IntakeStep2.tsx
// Step 2: Health Details
// Collects: Symptoms, duration, medical history, family history, and lifestyle

import type { IntakeFormData } from "../../types/intake";

interface IntakeStep2Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

function IntakeStep2({ formData, updateFormData }: IntakeStep2Props) {
  return (
    <div>
      {/* Step heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Health Details
        </h2>
        <p className="text-gray-600">
          Tell us more about your symptoms and health background. The more detail
          you provide, the better your provider can help you.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Symptoms Description */}
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your symptoms <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => updateFormData({ symptoms: e.target.value })}
            placeholder="Example: Sharp pain in my lower back that radiates down my left leg..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
          />
        </div>

        {/* Symptom Duration */}
        <div>
          <label htmlFor="symptomDuration" className="block text-sm font-medium text-gray-700 mb-2">
            How long have you had these symptoms? <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            id="symptomDuration"
            value={formData.symptomDuration}
            onChange={(e) => updateFormData({ symptomDuration: e.target.value })}
            placeholder="Example: About 3 months"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
          />
        </div>

        {/* Divider - Medical History */}
        <div className="border-t border-gray-200 pt-6 mt-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Medical Background
          </h3>
        </div>

        {/* Medical History */}
        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
            Your medical history
          </label>
          <textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => updateFormData({ medicalHistory: e.target.value })}
            placeholder="Example: Diagnosed with hypothyroidism in 2018, had appendectomy in 2015..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
          />
        </div>

        {/* Family History */}
        <div>
          <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700 mb-2">
            Family medical history
          </label>
          <textarea
            id="familyHistory"
            value={formData.familyHistory}
            onChange={(e) => updateFormData({ familyHistory: e.target.value })}
            placeholder="Example: Mother has diabetes, father had heart disease..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
          />
        </div>

        {/* Lifestyle */}
        <div>
          <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-2">
            Lifestyle (diet, exercise, sleep, stress)
          </label>
          <textarea
            id="lifestyle"
            value={formData.lifestyle}
            onChange={(e) => updateFormData({ lifestyle: e.target.value })}
            placeholder="Example: I eat mostly healthy but skip meals often. Exercise 2x/week. Sleep 6 hours. High work stress..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export default IntakeStep2;
