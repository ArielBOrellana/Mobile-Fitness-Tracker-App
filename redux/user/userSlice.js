import { createSlice } from "@reduxjs/toolkit";

// Initial state of the user slice
const initialState = {
    currentUser: null,  // Stores the currently authenticated user
    error: null,        // Stores any error messages
    loading: false,     // Indicates whether an operation is in progress
};

// User slice containing state and reducers to manage user-related actions
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer to handle the start of a sign-in process
        signInStart: (state) => {
            state.loading = true;
        },
        // Reducer to handle a successful sign-in
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Reducer to handle a failed sign-in
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        // Reducer to handle the start of a user deletion process
        deleteUserStart: (state) => {
            state.loading = true;
        },
        // Reducer to handle a successful user deletion
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        // Reducer to handle a failed user deletion
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        // Reducer to handle the start of a sign-out process
        signOutUserStart: (state) => {
            state.loading = true;
        },
        // Reducer to handle a successful sign-out
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        // Reducer to handle a failed sign-out
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

// Exporting individual action creators for use in dispatching
export const { 
    signInStart, 
    signInSuccess, 
    signInFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure
    } = userSlice.actions;

// Exporting the reducer to be used in the store
export default userSlice.reducer;