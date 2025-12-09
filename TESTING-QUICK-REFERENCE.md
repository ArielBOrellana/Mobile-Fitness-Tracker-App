# Quick Testing Reference

## 🚀 Running Tests

### Frontend Tests
```bash
# From project root
npm test                    # Run all tests once
npm run test:watch          # Run in watch mode (re-runs on file changes)
npm run test:coverage       # Run with coverage report
```

### Backend Tests
```bash
cd backend
npm test                    # Run all tests once
npm run test:watch          # Run in watch mode
npm run test:coverage       # Run with coverage report
```

## 📊 Current Test Coverage

### ✅ Frontend (50 tests)
| File | Coverage |
|------|----------|
| redux/user/userSlice.js | 100% |
| Utility functions | 100% |
| Components | Basic coverage |

### ✅ Backend (12 tests)
| File | Coverage |
|------|----------|
| utils/error.js | 100% |
| Validation logic | 100% |

## 📁 Test File Locations

### Frontend
```
app/
  __tests__/
    components/
      WorkoutCard.test.js
    utils/
      dateHelpers.test.js
      workoutCalculations.test.js
      validation.test.js
redux/
  user/
    __tests__/
      userSlice.test.js
```

### Backend
```
backend/
  __tests__/
    controllers/
      auth.validation.test.js
    utils/
      error.test.js
```

## 🎯 What Each Test File Covers

### Frontend Tests

**userSlice.test.js**
- Redux state management
- Sign in/out actions
- User deletion actions
- Loading states

**dateHelpers.test.js**
- Date formatting
- Month name retrieval
- Days in month calculation
- Today date checking

**workoutCalculations.test.js**
- Total duration calculation
- Average duration
- Unique workout days
- Streak calculation
- Workout type breakdown

**validation.test.js**
- Email validation
- Password validation (min 6 chars)
- Username validation (3-20 chars)
- Workout duration validation
- Monthly goal validation

**WorkoutCard.test.js**
- Component rendering
- Data display
- Edge case handling

### Backend Tests

**error.test.js**
- Error object creation
- Status code handling
- Error message handling

**auth.validation.test.js**
- Password validation logic
- Email format validation
- Token payload generation

## 🔧 Configuration Files

### Frontend
- `jest.config.js` - Jest configuration for Expo
- `jest.setup.js` - Test environment setup and mocks
- `package.json` - Test scripts

### Backend
- `jest.config.js` - Jest configuration for Node.js ESM
- `package.json` - Test scripts

## 📝 Writing New Tests

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### React Component Test
```javascript
import { render } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

it('should render correctly', () => {
  const { getByTestId } = render(<MyComponent />);
  expect(getByTestId('element-id')).toBeTruthy();
});
```

### Redux Test
```javascript
import reducer, { myAction } from '../mySlice';

it('should handle action', () => {
  const state = reducer(initialState, myAction(payload));
  expect(state.property).toBe(expectedValue);
});
```

## ⚠️ Common Issues & Solutions

### Issue: Tests not found
**Solution**: Check test file naming - must end with `.test.js` or `.spec.js`

### Issue: Module not found
**Solution**: Check import paths are correct and dependencies are installed

### Issue: ESM import errors (Backend)
**Solution**: Ensure using `import` syntax and `"type": "module"` in package.json

### Issue: React Native component errors
**Solution**: Check mocks in `jest.setup.js` for required native modules

## 📸 For University Submission

### Screenshots to Include:
1. Terminal output of `npm test` showing all passing tests
2. Coverage report from `npm run test:coverage`
3. Backend test results from `cd backend && npm test`

### Files to Submit:
- All `__tests__` directories
- `jest.config.js` files
- `TESTING.md`
- `TEST-SUMMARY.md`
- This quick reference

## ✨ Test Quality Checklist

- [x] All tests pass
- [x] Tests have descriptive names
- [x] Edge cases are covered
- [x] Tests are isolated (no dependencies on each other)
- [x] Code coverage on critical paths
- [x] Tests run quickly (< 5 seconds total)
- [x] Documentation explains testing approach

## 📚 Resources

- Jest Documentation: https://jestjs.io/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/
- Testing Best Practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

**Last Updated**: December 3, 2025  
**Total Tests**: 62 (50 frontend + 12 backend)  
**Status**: ✅ All Passing
