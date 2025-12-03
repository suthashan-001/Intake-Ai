// Badge component for IntakeAI --- shows status of patients
// labels "ready to visit " / and intake form "just arrived"

interface BadgeProps {
  children: React.ReactNode;
  color: "green" | "blue" | "red" | "gray";
}

function Badge({ children, color }: BadgeProps) {
  // Pick the right colors based on what color was passed in
  let colorStyles = "";

  if (color === "green") {
    colorStyles = "bg-green-100 text-green-700";
  } else if (color === "blue") {
    colorStyles = "bg-blue-100 text-blue-700";
  } else if (color === "red") {
    colorStyles = "bg-danger-100 text-danger-500";
  } else {
    // gray is the default
    colorStyles = "bg-gray-100 text-gray-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colorStyles}`}
    >
      {children}
    </span>
  );
}

export default Badge;
