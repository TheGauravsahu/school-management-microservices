export const generateProfilePicture = async (
  firstName: string,
  lastName: string,
  userId: string
) => {
  try {
    const seed = `${firstName}-${lastName}-${userId}`;
    const colors = [
      "ffadad",
      "ffd6a5",
      "fdffb6",
      "caffbf",
      "9bf6ff",
      "a0c4ff",
      "bdb2ff",
      "ffc6ff",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}&backgroundColor=${randomColor}&radius=50`;
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate profile picture");
  }
};
