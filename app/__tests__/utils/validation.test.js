// Validation utility functions
const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

const validateUsername = (username) => {
  if (!username) return false;
  return username.length >= 3 && username.length <= 20;
};

const validateWorkoutDuration = (duration) => {
  if (duration === null || duration === undefined) return false;
  return duration > 0 && duration <= 1440; // Max 24 hours
};

const validateMonthlyGoal = (goal) => {
  if (goal === null || goal === undefined) return false;
  return Number.isInteger(goal) && goal >= 1 && goal <= 31;
};

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with 6 or more characters', () => {
      expect(validatePassword('password')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('Pass@123')).toBe(true);
    });

    it('should reject passwords with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate usernames between 3 and 20 characters', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('username123')).toBe(true);
      expect(validateUsername('a'.repeat(20))).toBe(true);
    });

    it('should reject usernames outside valid range', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('a'.repeat(21))).toBe(false);
      expect(validateUsername('')).toBe(false);
      expect(validateUsername(null)).toBe(false);
    });
  });

  describe('validateWorkoutDuration', () => {
    it('should validate positive durations up to 1440 minutes', () => {
      expect(validateWorkoutDuration(1)).toBe(true);
      expect(validateWorkoutDuration(30)).toBe(true);
      expect(validateWorkoutDuration(1440)).toBe(true);
    });

    it('should reject invalid durations', () => {
      expect(validateWorkoutDuration(0)).toBe(false);
      expect(validateWorkoutDuration(-5)).toBe(false);
      expect(validateWorkoutDuration(1441)).toBe(false);
      expect(validateWorkoutDuration(null)).toBe(false);
      expect(validateWorkoutDuration(undefined)).toBe(false);
    });
  });

  describe('validateMonthlyGoal', () => {
    it('should validate goals between 1 and 31', () => {
      expect(validateMonthlyGoal(1)).toBe(true);
      expect(validateMonthlyGoal(15)).toBe(true);
      expect(validateMonthlyGoal(31)).toBe(true);
    });

    it('should reject invalid goals', () => {
      expect(validateMonthlyGoal(0)).toBe(false);
      expect(validateMonthlyGoal(32)).toBe(false);
      expect(validateMonthlyGoal(-1)).toBe(false);
      expect(validateMonthlyGoal(15.5)).toBe(false);
      expect(validateMonthlyGoal(null)).toBe(false);
      expect(validateMonthlyGoal(undefined)).toBe(false);
    });
  });
});
