// A term without an end date, or one ending today or later, is active. Dates are ISO (YYYY-MM-DD...).
// The directory may keep returning ended roles, so lists of people never rely on the upstream to filter them.
export function isActiveTerm(term, now = new Date()) {
  const end = term?.end;
  if (!end) return true;
  return String(end).slice(0, 10) >= now.toISOString().slice(0, 10);
}
