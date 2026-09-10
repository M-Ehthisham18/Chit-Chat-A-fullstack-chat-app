/**
 * Returns a safe version of the user object to be sent to the client.
 * Registered users get their email.
 * Guest users have their synthetic email hidden.
 * Sensitive fields like password and guestPinHash are always excluded.
 */
export const serializeUser = (user) => {
  if (!user) return null;

  const safeUser = {
    _id: user._id,
    fullname: user.fullname,
    profilePic: user.profilePic,
    isGuest: user.isGuest || false,
  };

  if (safeUser.isGuest) {
    safeUser.guestId = user.guestId;
  } else {
    safeUser.email = user.email;
  }

  return safeUser;
};
