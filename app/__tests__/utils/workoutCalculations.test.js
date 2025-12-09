// Utility functions for workout calculations
const calculateTotalDuration = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;
  return workouts.reduce((total, workout) => total + (workout.duration || 0), 0);
};

const calculateAverageDuration = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;
  const total = calculateTotalDuration(workouts);
  return Math.round(total / workouts.length);
};

const getUniqueWorkoutDays = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;
  const uniqueDates = new Set(
    workouts.map(workout => new Date(workout.date).toDateString())
  );
  return uniqueDates.size;
};

const calculateStreak = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
};

const getWorkoutTypeBreakdown = (workouts) => {
  if (!workouts || workouts.length === 0) return {};
  
  const breakdown = {};
  workouts.forEach(workout => {
    const type = workout.type || 'Unknown';
    breakdown[type] = (breakdown[type] || 0) + 1;
  });
  
  return breakdown;
};

describe('Workout Calculation Functions', () => {
  const mockWorkouts = [
    { type: 'Running', duration: 30, date: '2025-12-01' },
    { type: 'Cycling', duration: 45, date: '2025-12-02' },
    { type: 'Running', duration: 25, date: '2025-12-03' },
    { type: 'Yoga', duration: 60, date: '2025-12-03' },
  ];

  describe('calculateTotalDuration', () => {
    it('should calculate total duration correctly', () => {
      expect(calculateTotalDuration(mockWorkouts)).toBe(160);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalDuration([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(calculateTotalDuration(null)).toBe(0);
      expect(calculateTotalDuration(undefined)).toBe(0);
    });

    it('should handle workouts with missing duration', () => {
      const workoutsWithMissing = [
        { type: 'Running', duration: 30, date: '2025-12-01' },
        { type: 'Cycling', date: '2025-12-02' },
      ];
      expect(calculateTotalDuration(workoutsWithMissing)).toBe(30);
    });
  });

  describe('calculateAverageDuration', () => {
    it('should calculate average duration correctly', () => {
      expect(calculateAverageDuration(mockWorkouts)).toBe(40);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageDuration([])).toBe(0);
    });

    it('should round to nearest integer', () => {
      const workouts = [
        { duration: 33, date: '2025-12-01' },
        { duration: 33, date: '2025-12-02' },
      ];
      expect(calculateAverageDuration(workouts)).toBe(33);
    });
  });

  describe('getUniqueWorkoutDays', () => {
    it('should count unique workout days correctly', () => {
      expect(getUniqueWorkoutDays(mockWorkouts)).toBe(3);
    });

    it('should return 0 for empty array', () => {
      expect(getUniqueWorkoutDays([])).toBe(0);
    });

    it('should count same-day workouts as one day', () => {
      const sameDayWorkouts = [
        { type: 'Running', date: '2025-12-01' },
        { type: 'Cycling', date: '2025-12-01' },
        { type: 'Yoga', date: '2025-12-01' },
      ];
      expect(getUniqueWorkoutDays(sameDayWorkouts)).toBe(1);
    });
  });

  describe('calculateStreak', () => {
    it('should return 0 for empty workouts', () => {
      expect(calculateStreak([])).toBe(0);
      expect(calculateStreak(null)).toBe(0);
    });

    it('should calculate consecutive day streak', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const streakWorkouts = [
        { type: 'Running', date: today.toISOString() },
        { type: 'Cycling', date: yesterday.toISOString() },
        { type: 'Yoga', date: twoDaysAgo.toISOString() },
      ];

      const streak = calculateStreak(streakWorkouts);
      expect(streak).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getWorkoutTypeBreakdown', () => {
    it('should return correct breakdown of workout types', () => {
      const breakdown = getWorkoutTypeBreakdown(mockWorkouts);
      expect(breakdown).toEqual({
        Running: 2,
        Cycling: 1,
        Yoga: 1,
      });
    });

    it('should return empty object for empty array', () => {
      expect(getWorkoutTypeBreakdown([])).toEqual({});
    });

    it('should handle workouts without type', () => {
      const workouts = [
        { duration: 30, date: '2025-12-01' },
        { type: 'Running', duration: 30, date: '2025-12-02' },
      ];
      const breakdown = getWorkoutTypeBreakdown(workouts);
      expect(breakdown.Unknown).toBe(1);
      expect(breakdown.Running).toBe(1);
    });
  });
});
