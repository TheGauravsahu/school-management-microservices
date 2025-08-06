export const generateProfilePicture = async (
  firstName: string,
  lastName: string,
  userId: string
) => {
  try {
    const seed = `${firstName}-${lastName}-${userId}`;
    const dicebearApiUrl = `https://api.dicebear.com/9.x/initials/svg?seed=
        ${encodeURIComponent(seed)}&backgroundColor=random&radius=50`;

    const res = await fetch(dicebearApiUrl);
    if (res.ok) {
      return dicebearApiUrl;
    }
    return "";
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate profile picture");
  }
};
