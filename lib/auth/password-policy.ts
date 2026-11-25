// Shared password rules for sign-up and password reset (browser and server).
// Keep Supabase → Authentication → Providers → Email "Minimum password length"
// and "Password requirements" at least this strict, so the API enforces it too.

export const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_HINT = `At least ${PASSWORD_MIN_LENGTH} characters, with a letter and a number`;

/** Returns an error message, or null when the password is acceptable. */
export function passwordProblem(password: string, email?: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > 72) {
    // bcrypt only uses the first 72 bytes.
    return "Password must be 72 characters or fewer.";
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  const local = email?.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && password.toLowerCase().includes(local)) {
    return "Password must not contain your email name.";
  }
  if (/^(.)\1+$/.test(password) || /^(?:0123456789|1234567890|password\d*|qwerty\w*)$/i.test(password)) {
    return "That password is too easy to guess.";
  }
  return null;
}
