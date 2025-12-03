// Avatar component { displayed on sidebar beside doctors name}
// Shows a circle with the patient's initials

interface AvatarProps {
  name: string;
}

function Avatar({ name }: AvatarProps) {
  // Get the initials from the name
  const words = name.split(" ");
  let initials = "";

  // Loop through the words and get the first letter of each
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials = initials + words[i][0];
    }
  }

  // Only show first 2 letters max
  initials = initials.substring(0, 2).toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center">
      <span className="text-sage-700 font-medium text-sm">{initials}</span>
    </div>
  );
}

export default Avatar;
