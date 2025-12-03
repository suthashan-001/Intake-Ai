// Modal for inviting a new patient to fill out an intake form
// concept: doctor shares this public routed link to the patient for them to fill and submit.

// modal has two sides, the doctor side where they prefil the info of the patient they are adding, and a patient side where they fill in the rest of the information (intake form page)

import { useState } from "react";

// Props for the modal
interface InvitePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// API base URL
const API_URL = "http://localhost:3001/api";

function InvitePatientModal({
  isOpen,
  onClose,
  onSuccess,
}: InvitePatientModalProps) {
  // Current step (1 = enter info, 2 = share link)
  const [step, setStep] = useState(1);

  // Form data for step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // State for step 2
  const [intakeUrl, setIntakeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset the modal to initial state
  const resetModal = () => {
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setIntakeUrl("");
    setCopied(false);
    setError("");
    setIsLoading(false);
  };

  // Handle closing the modal
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Handle "Done" button - close and trigger success callback
  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  // Handle form submission (Step 1 → Step 2)
  const handleContinue = async () => {
    // Basic validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Step 1: Create the patient
      const patientRes = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      const patientData = await patientRes.json();

      if (!patientData.success) {
        setError(patientData.error || "Failed to create patient");
        setIsLoading(false);
        return;
      }

      // Step 2: Create the intake link
      // example: Gets a link like "http://localhost:5173/intake/abc123"
      const linkRes = await fetch(`${API_URL}/intake-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientData.data.id,
        }),
      });

      const linkData = await linkRes.json();

      if (!linkData.success) {
        setError(linkData.error || "Failed to create intake link");
        setIsLoading(false);
        return;
      }

      // Success! Move to step 2 with the URL
      setIntakeUrl(linkData.data.url);
      setStep(2);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Feature: Handle copying the link to clipboard { user experience focus}
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(intakeUrl);
      setCopied(true);
      // Reset "Copied!" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = intakeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Modal overlay - dark semi-transparent background
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        {/* Step 1: Enter Patient Info */}
        {step === 1 && (
          <div>
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Invite New Patient
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter patient details to send them an intake form.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-500 text-sm">
                {error}
              </div>
            )}

            {/* Form fields */}
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-danger-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                />
              </div>

              {/* Phone (optional) */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="px-4 py-2 bg-sage-700 hover:bg-sage-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Share Intake Link */}
        {step === 2 && (
          <div>
            {/* Success icon */}
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-sage-700"
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

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">
              Intake Link Created!
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Share this link with {firstName} to complete their intake form.
            </p>

            {/* Link display with copy button */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intake Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={intakeUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    copied
                      ? "bg-sage-100 text-sage-700"
                      : "bg-sage-700 hover:bg-sage-800 text-white"
                  }`}
                >
                  {copied ? (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Instructions:</span> Send this
                link to your patient via email or text. They have{" "}
                <span className="font-medium">7 days</span> to complete the
                intake form.
              </p>
            </div>

            {/* Done button */}
            <button
              onClick={handleDone}
              className="w-full px-4 py-2 bg-sage-700 hover:bg-sage-800 text-white rounded-lg font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitePatientModal;
