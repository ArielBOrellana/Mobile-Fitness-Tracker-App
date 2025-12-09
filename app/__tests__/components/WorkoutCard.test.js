import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock component for testing basic rendering
const WorkoutCard = ({ workout }) => {
  return (
    <View testID="workout-card">
      <Text testID="workout-type">{workout.type}</Text>
      <Text testID="workout-duration">{workout.duration} min</Text>
      <Text testID="workout-date">{workout.date}</Text>
    </View>
  );
};

describe('WorkoutCard Component', () => {
  const mockWorkout = {
    type: 'Running',
    duration: 30,
    date: '2025-12-03',
  };

  it('should render workout card with correct data', () => {
    const { getByTestId } = render(<WorkoutCard workout={mockWorkout} />);

    expect(getByTestId('workout-card')).toBeTruthy();
    expect(getByTestId('workout-type')).toHaveTextContent('Running');
    expect(getByTestId('workout-duration')).toHaveTextContent('30 min');
    expect(getByTestId('workout-date')).toHaveTextContent('2025-12-03');
  });

  it('should render different workout types', () => {
    const workouts = [
      { type: 'Cycling', duration: 45, date: '2025-12-01' },
      { type: 'Swimming', duration: 60, date: '2025-12-02' },
      { type: 'Yoga', duration: 20, date: '2025-12-03' },
    ];

    workouts.forEach((workout) => {
      const { getByTestId } = render(<WorkoutCard workout={workout} />);
      expect(getByTestId('workout-type')).toHaveTextContent(workout.type);
      expect(getByTestId('workout-duration')).toHaveTextContent(`${workout.duration} min`);
    });
  });

  it('should handle missing data gracefully', () => {
    const incompleteWorkout = {
      type: 'Running',
      duration: 0,
      date: '',
    };

    const { getByTestId } = render(<WorkoutCard workout={incompleteWorkout} />);
    expect(getByTestId('workout-card')).toBeTruthy();
  });
});
