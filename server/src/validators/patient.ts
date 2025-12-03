// Patient Validators

// Type for the data we expect when creating a patient
export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Type for the data we expect when updating a patient
export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Validation result type
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validate data for creating a new patient
// Returns { isValid: true/false, errors: [...] }
export function validateCreatePatient(data: any): ValidationResult {
  const errors: string[] = [];

  // Check if firstName exists and is not empty
  if (!data.firstName || typeof data.firstName !== "string") {
    errors.push("First name is required");
  } else if (data.firstName.trim().length === 0) {
    errors.push("First name cannot be empty");
  }

  // Check if lastName exists and is not empty
  if (!data.lastName || typeof data.lastName !== "string") {
    errors.push("Last name is required");
  } else if (data.lastName.trim().length === 0) {
    errors.push("Last name cannot be empty");
  }

  // Email is optional, but if provided, should look like an email
  if (data.email && typeof data.email === "string") {
    // Simple email check - just looking for @ symbol
    if (!data.email.includes("@")) {
      errors.push("Email format is invalid");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate data for updating a patient
export function validateUpdatePatient(data: any): ValidationResult {
  const errors: string[] = [];

  if (data.firstName !== undefined) {
    if (
      typeof data.firstName !== "string" ||
      data.firstName.trim().length === 0
    ) {
      errors.push("First name cannot be empty");
    }
  }

  if (data.lastName !== undefined) {
    if (
      typeof data.lastName !== "string" ||
      data.lastName.trim().length === 0
    ) {
      errors.push("Last name cannot be empty");
    }
  }

  if (data.email !== undefined && data.email !== null && data.email !== "") {
    if (typeof data.email === "string" && !data.email.includes("@")) {
      errors.push("Email format is invalid");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
