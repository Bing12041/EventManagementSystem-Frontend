// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        clearToken: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setCredentials, clearToken } = authSlice.actions;
export default authSlice.reducer;