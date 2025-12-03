// IntakeProgress.tsx
// Progress bar component for the intake form
// Shows all 3 steps with current step highlighted

interface IntakeProgressProps {
  currentStep: number; // 1-3
  stepNames: string[];
  onStepClick: (step: number) => void; // Called when user clicks a completed step
}

function IntakeProgress({
  currentStep,
  stepNames,
  onStepClick,
}: IntakeProgressProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress bar container */}
        <div className="flex items-center">
          {stepNames.map((name, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex-1 flex items-center">
                {/* Step indicator */}
                <div className="flex flex-col items-center flex-1">
                  {/* Clickable step circle */}
                  <button
                    onClick={() => onStepClick(stepNumber)}
                    disabled={isUpcoming}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      transition-colors duration-200
                      ${
                        isCompleted
                          ? "bg-sage-700 text-white cursor-pointer hover:bg-sage-800"
                          : isCurrent
                          ? "bg-sage-700 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {isCompleted ? (
                      // Checkmark for completed steps
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
                    ) : (
                      stepNumber
                    )}
                  </button>

                  {/* Step name - only show on larger screens */}
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center hidden sm:block
                      ${
                        isCurrent
                          ? "text-sage-700"
                          : isCompleted
                          ? "text-sage-600"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {name}
                  </span>
                </div>

                {/* Connector line between steps (except after last step) */}
                {stepNumber < stepNames.length && (
                  <div
                    className={`
                      h-0.5 w-full mx-2
                      ${
                        stepNumber < currentStep ? "bg-sage-700" : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile view: Show current step name */}
        <p className="text-center text-sm font-medium text-sage-700 mt-3 sm:hidden">
          {stepNames[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}

export default IntakeProgress;
