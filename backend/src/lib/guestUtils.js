// helper to generate unique Guest ID
export const generateGuestId = () => {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Avoid ambiguous characters (I, O)
  const digits = "23456789"; // Avoid ambiguous characters (0, 1)

  let result = [];
  for (let i = 0; i < 5; i++) {
    result.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
  for (let i = 0; i < 2; i++) {
    result.push(digits.charAt(Math.floor(Math.random() * digits.length)));
  }

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
};

// helper to generate secure PIN
export const generateGuestPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
};
