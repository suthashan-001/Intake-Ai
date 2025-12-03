// intake.ts - Types for the patient intake form

// Type for all form data collected across steps
export interface IntakeFormData {
  // Step 1: Personal Info + Chief Concern
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderIdentity: string;
  chiefComplaint: string;

  // Step 2: Health Details
  symptoms: string;
  symptomDuration: string;
  medicalHistory: string;
  familyHistory: string;
  lifestyle: string;
}
