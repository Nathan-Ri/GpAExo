export function formatDateIntl(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

export function convertToISOString(dateStr: string): string {
  const [day, month, year] = dateStr.split('/').map(Number);
  let date = new Date(Date.UTC(year, month - 1, day)); // Crée une date en UTC
  return date.toISOString();
}
