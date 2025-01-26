// If adding map state to Redux:

// src/redux/slices/mapSlice.js
import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12
    },
    reducers: {
        setCenter: (state, action) => {
            state.center = action.payload;
        },
        setZoom: (state, action) => {
            state.zoom = action.payload;
        }
    }
});

export const { setCenter, setZoom } = mapSlice.actions;
export default mapSlice.reducer;

// Then in store.js, include mapSlice:

// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        map: mapReducer
    },
});