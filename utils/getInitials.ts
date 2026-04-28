export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(/\s+/);

  if (names.length === 1) return names[0][0].toUpperCase();

  return (names[0][0] + names[1][0]).toUpperCase();
};