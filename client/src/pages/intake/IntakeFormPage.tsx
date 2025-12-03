// Main page for the patient intake form
// concept: this is a public routed link that the doctor sends for the patients to fill in and submit to the app

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IntakeProgress from "../../components/intake/IntakeProgress";
import IntakeStep1 from "../../components/intake/IntakeStep1";
import IntakeStep2 from "../../components/intake/IntakeStep2";
import IntakeStep3 from "../../components/intake/IntakeStep3";
import type { IntakeFormData } from "../../types/intake";

// progress indicator for the progress bar (simplified to 3 steps)
const PROGRESS_INDICATOR = ["Personal Info", "Health Details", "Review"];

// Total number of steps
const TOTAL_STEPS = 3;

// API base URL
const API_URL = "http://localhost:3001/api";

function IntakeFormPage() {
  // Get the token from the URL (eg. /intake/abc123...)
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Current progress step (1-3)
  const [currentStep, setCurrentStep] = useState(1);

  // Form data state - stores all answers
  const [formData, setFormData] = useState<IntakeFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    genderIdentity: "",
    chiefComplaint: "",
    symptoms: "",
    symptomDuration: "",
    medicalHistory: "",
    familyHistory: "",
    lifestyle: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate token and load form on page load
  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call API to validate token
        const response = await fetch(`${API_URL}/public/intake/${token}`);
        const data = await response.json();

        if (!data.success) {
          // Token is invalid or expired
          setError(data.error || "Invalid intake link");
          return;
        }

        // Token is valid - pre-fill the first name
        setFormData((prev) => ({
          ...prev,
          firstName: data.data.patientFirstName || "",
        }));
        // error handling on api fail
      } catch (err) {
        setError("Unable to load intake form. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setError("No intake token provided");
      setIsLoading(false);
    }
  }, [token]);

  // Update form data from any step
  const updateFormData = (updates: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Go to next step
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to a specific step (when clicking on progress bar or edit button)
  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Build the responses object for the API
      const responses = {
        chiefComplaint: formData.chiefComplaint,
        symptoms: formData.symptoms,
        symptomDuration: formData.symptomDuration,
        medicalHistory: formData.medicalHistory,
        familyHistory: formData.familyHistory,
        lifestyle: formData.lifestyle,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        genderIdentity: formData.genderIdentity,
      };

      // Submit to API
      const response = await fetch(`${API_URL}/public/intake/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to submit form");
        return;
      }

      // Success!
      setIsSubmitted(true);
    } catch (err) {
      setError("Unable to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel - just show a confirmation and navigate away
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Your progress will be lost."
      )
    ) {
      navigate("/");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading intake form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-danger-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Form
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Success state - form submitted
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-sage-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Thank You!
          </h2>
          <p className="text-gray-600">
            Your intake form has been submitted successfully. Your healthcare
            provider will review it before your appointment.
          </p>
        </div>
      </div>
    );
  }

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IntakeStep1 formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <IntakeStep2 formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return <IntakeStep3 formData={formData} onEdit={handleStepClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>

          <h1 className="text-gray-900 font-medium">
            Intake Form Step {currentStep} of {TOTAL_STEPS}
          </h1>

          <div className="w-16"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <IntakeProgress
        currentStep={currentStep}
        stepNames={PROGRESS_INDICATOR}
        onStepClick={handleStepClick}
      />

      {/* Form Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {renderStep()}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Cancel
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="bg-sage-700 hover:bg-sage-800 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-1"
            >
              Continue
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-sage-700 hover:bg-sage-800 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default IntakeFormPage;
