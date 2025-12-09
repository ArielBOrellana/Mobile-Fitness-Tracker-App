import userReducer, {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../userSlice';

describe('userSlice', () => {
  // Initial state for testing
  const initialState = {
    currentUser: null,
    error: null,
    loading: false,
  };

  const mockUser = {
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    monthlyGoal: 10,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('signIn actions', () => {
    it('should handle signInStart', () => {
      const state = userReducer(initialState, signInStart());
      expect(state.loading).toBe(true);
    });

    it('should handle signInSuccess', () => {
      const state = userReducer(initialState, signInSuccess(mockUser));
      expect(state.currentUser).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle signInFailure', () => {
      const error = 'Invalid credentials';
      const state = userReducer(initialState, signInFailure(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
      expect(state.currentUser).toBe(null);
    });
  });

  describe('deleteUser actions', () => {
    const stateWithUser = {
      ...initialState,
      currentUser: mockUser,
    };

    it('should handle deleteUserStart', () => {
      const state = userReducer(stateWithUser, deleteUserStart());
      expect(state.loading).toBe(true);
    });

    it('should handle deleteUserSuccess', () => {
      const state = userReducer(stateWithUser, deleteUserSuccess());
      expect(state.currentUser).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle deleteUserFailure', () => {
      const error = 'Delete failed';
      const state = userReducer(stateWithUser, deleteUserFailure(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
      expect(state.currentUser).toEqual(mockUser);
    });
  });

  describe('signOutUserSuccess action', () => {
    const stateWithUser = {
      ...initialState,
      currentUser: mockUser,
      loading: false,
      error: null,
    };

    it('should clear user data and reset to initial state', () => {
      const state = userReducer(stateWithUser, signOutUserSuccess());
      expect(state).toEqual(initialState);
    });

    it('should clear errors on sign out', () => {
      const stateWithError = {
        ...stateWithUser,
        error: 'Some error',
      };
      const state = userReducer(stateWithError, signOutUserSuccess());
      expect(state.error).toBe(null);
    });
  });

  describe('loading state transitions', () => {
    it('should set loading to true on start actions', () => {
      expect(userReducer(initialState, signInStart()).loading).toBe(true);
      expect(userReducer(initialState, deleteUserStart()).loading).toBe(true);
      expect(userReducer(initialState, signOutUserStart()).loading).toBe(true);
    });

    it('should set loading to false on success actions', () => {
      const loadingState = { ...initialState, loading: true };
      expect(userReducer(loadingState, signInSuccess(mockUser)).loading).toBe(false);
      expect(userReducer(loadingState, deleteUserSuccess()).loading).toBe(false);
      expect(userReducer(loadingState, signOutUserSuccess()).loading).toBe(false);
    });

    it('should set loading to false on failure actions', () => {
      const loadingState = { ...initialState, loading: true };
      expect(userReducer(loadingState, signInFailure('error')).loading).toBe(false);
      expect(userReducer(loadingState, deleteUserFailure('error')).loading).toBe(false);
      expect(userReducer(loadingState, signOutUserFailure('error')).loading).toBe(false);
    });
  });
});
