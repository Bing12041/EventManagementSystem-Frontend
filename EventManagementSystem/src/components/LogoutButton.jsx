// src/components/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearToken } from '../redux/slices/authSlice';

const LogoutButton = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearToken());
        alert('Logout successful!');
        // Optionally redirect to login page
        // window.location.href = '/login';
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;