import { formatDateIntl, convertToISOString } from './date.utils';

describe('Date Utils', () => {
  describe('formatDateIntl', () => {
    it('should format a valid date string to "fr-FR" locale', () => {
      const result = formatDateIntl('2024-12-22');
      expect(result).toBe('22/12/2024'); // Format attendu pour 'fr-FR'
    });

    it('should handle invalid date strings gracefully', () => {
      const result = formatDateIntl('invalid-date');
      expect(result).toBe('Invalid Date'); // Ce que Intl.DateTimeFormat retourne pour une date invalide
    });
  });

  describe('convertToISOString', () => {
    it('should convert a "dd/MM/yyyy" string to ISO string in UTC', () => {
      const result = convertToISOString('22/12/2024');
      expect(result).toBe('2024-12-22T00:00:00.000Z'); // Date UTC attendue
    });

    it('should handle invalid date strings by throwing an error', () => {
      expect(() => convertToISOString('invalid-date')).toThrowError(); // Vérifie qu'une erreur est levée
    });
  });
});
