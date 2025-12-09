// Utility functions for date operations
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || '';
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

describe('Date Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-12-03');
      expect(formatDate(date)).toBe('2025-12-03');
    });

    it('should handle string dates', () => {
      expect(formatDate('2025-01-15')).toBe('2025-01-15');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('getMonthName', () => {
    it('should return correct month names', () => {
      expect(getMonthName(0)).toBe('January');
      expect(getMonthName(5)).toBe('June');
      expect(getMonthName(11)).toBe('December');
    });

    it('should handle invalid indices', () => {
      expect(getMonthName(-1)).toBe('');
      expect(getMonthName(12)).toBe('');
      expect(getMonthName(100)).toBe('');
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct number of days', () => {
      expect(getDaysInMonth(2025, 0)).toBe(31); // January
      expect(getDaysInMonth(2025, 1)).toBe(28); // February (non-leap year)
      expect(getDaysInMonth(2024, 1)).toBe(29); // February (leap year)
      expect(getDaysInMonth(2025, 3)).toBe(30); // April
    });

    it('should handle different years', () => {
      expect(getDaysInMonth(2020, 1)).toBe(29); // Leap year
      expect(getDaysInMonth(2021, 1)).toBe(28); // Non-leap year
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });
});
