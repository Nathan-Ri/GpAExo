import { createEventId, getColor } from './event.utils';

describe('Utils', () => {
  describe('createEventId', () => {
    it('should increment and return a unique event ID as a string', () => {
      // Reset eventGuid (si nécessaire, assurez-vous que le comportement initial est cohérent dans vos tests)
      let firstId = createEventId();
      let secondId = createEventId();

      expect(firstId).toBe('0');
      expect(secondId).toBe('1');
    });
  })

  it('should return the correct color for "Super Secret Project1"', () => {
    expect(getColor('Super Secret Project1')).toBe('#f00000');
  });

  it('should return the correct color for "Super Secret Project2"', () => {
    expect(getColor('Super Secret Project2')).toBe('#f000f0');
  });

  it('should return the correct color for "Super Secret Project3"', () => {
    expect(getColor('Super Secret Project3')).toBe('#00f000');
  });

  it('should return the correct color for "vacances"', () => {
    expect(getColor('vacances')).toBe('#55555555');
  });

  it('should return the default color for an unknown project', () => {
    expect(getColor('Unknown Project')).toBe('#55555555');
  });
});
