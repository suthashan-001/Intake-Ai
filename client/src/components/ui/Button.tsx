// Button component for IntakeAI

interface ButtonProps {
  children: React.ReactNode;
  type: "primary" | "secondary";
  onClick?: () => void;
}

function Button({ children, type, onClick }: ButtonProps) {
  let buttonStyles = "";

  if (type === "primary") {
    // Primary button - sage green background with white text
    buttonStyles = "bg-sage-700 text-white hover:bg-sage-800";
  } else {
    // Secondary button - white background with gray border
    buttonStyles =
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium ${buttonStyles}`}
    >
      {children}
    </button>
  );
}

export default Button;
