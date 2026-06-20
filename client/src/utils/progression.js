export function skillLevel(xp = 0) {
  return Math.floor(xp / 100) + 1;
}

export function skillProgress(xp = 0) {
  return Math.min(100, xp % 100);
}

export function skillRank(xp = 0) {
  if (xp >= 500) return 'Master';
  if (xp >= 300) return 'Expert';
  if (xp >= 200) return 'Skilled';
  if (xp >= 100) return 'Apprentice';
  return 'Novice';
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}

export function yearOf(date) {
  return new Date(date).getFullYear().toString();
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
