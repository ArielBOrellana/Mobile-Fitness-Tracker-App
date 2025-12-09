# Testing Documentation

## Overview
This project includes comprehensive unit tests for both the frontend (React Native) and backend (Node.js/Express) components.

## Frontend Testing

### Setup
The frontend uses Jest with React Native Testing Library for component and utility testing.

**Dependencies:**
- `jest`: Test runner
- `jest-expo`: Expo preset for Jest
- `@testing-library/react-native`: React Native testing utilities
- `react-test-renderer`: React component renderer for testing

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

#### Redux Tests (`redux/user/__tests__/userSlice.test.js`)
Tests Redux state management including:
- Initial state validation
- Sign in/sign up actions
- User update operations
- Sign out functionality
- Loading state transitions

#### Component Tests (`app/__tests__/components/`)
Tests React Native components for proper rendering and behavior.

#### Utility Tests (`app/__tests__/utils/`)
- **dateHelpers.test.js**: Date formatting and manipulation
- **workoutCalculations.test.js**: Workout statistics calculations
- **validation.test.js**: Input validation functions

### Coverage Goals
Aim for **60-70% code coverage** on:
- Redux reducers and actions
- Utility functions
- Core components

## Backend Testing

### Setup
The backend uses Jest for testing API controllers and utility functions.

**Dependencies:**
- `jest`: Test runner (ESM support)

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

#### Controller Tests (`backend/__tests__/controllers/`)
- **auth.controller.test.js**: Authentication endpoints
  - User signup with password hashing
  - User signin with JWT token generation
  - User signout

#### Utility Tests (`backend/__tests__/utils/`)
- **error.test.js**: Error handler utility function

### Mocking Strategy
Backend tests use Jest mocks for:
- Database models (MongoDB/Mongoose)
- External libraries (bcryptjs, jsonwebtoken)
- Environment variables

## Test Coverage

### How to Generate Coverage Reports

**Frontend:**
```bash
npm run test:coverage
```

**Backend:**
```bash
cd backend
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory and displayed in the terminal.

### Coverage Metrics
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

### Target Coverage
- **Redux Reducers**: 90%+ (easy to test, pure functions)
- **Utility Functions**: 80%+ (isolated, predictable)
- **Controllers**: 70%+ (includes async/database operations)
- **Components**: 60%+ (UI testing can be complex)

## Writing New Tests

### Frontend Test Example
```javascript
import { render } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<MyComponent />);
    expect(getByTestId('my-element')).toBeTruthy();
  });
});
```

### Backend Test Example
```javascript
import { myFunction } from '../myFunction.js';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Mocking**: Mock external dependencies to test units in isolation
5. **Edge Cases**: Test both happy paths and error conditions
6. **Coverage**: Focus on critical paths and business logic

## Continuous Integration

For CI/CD pipelines, run tests with:
```bash
npm test -- --ci --coverage --maxWorkers=2
```

This ensures tests run in CI mode with coverage reporting and limited workers for stability.

## Troubleshooting

### Common Issues

**"Cannot find module" errors:**
- Ensure all dependencies are installed
- Check import paths are correct
- Verify Jest configuration matches your project structure

**React Native component errors:**
- Check that `jest-expo` preset is configured
- Verify mocks are set up in `jest.setup.js`

**ESM import errors (Backend):**
- Ensure using `node --experimental-vm-modules` in test scripts
- Check that `"type": "module"` is in `package.json`

### Getting Help
- Review Jest documentation: https://jestjs.io/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/

## For Academic Submission

Include in your project documentation:
1. This README file
2. Coverage screenshots (`npm run test:coverage`)
3. Example of running tests successfully
4. Description of what each test suite validates
5. Explanation of testing strategy and rationale

### Screenshot Coverage Report
After running `npm run test:coverage`, take screenshots of:
- Terminal output showing test results
- Coverage summary table
- Any HTML coverage report (open `coverage/lcov-report/index.html`)
