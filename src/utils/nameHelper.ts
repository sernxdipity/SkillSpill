/**
 * Helper to get clean display name from user email or input
 */
export const formatNameFromEmail = (email: string): string => {
  if (!email) return 'Miaojuan Lee';
  const clean = email.toLowerCase().trim();

  if (clean.includes('leemiaojuan') || clean.includes('miaojuan')) {
    return 'Miaojuan Lee';
  }

  const prefix = clean.split('@')[0];
  const parts = prefix.split(/[._\-\d]+/).filter(Boolean);
  if (parts.length === 0) return 'Miaojuan Lee';

  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
};
