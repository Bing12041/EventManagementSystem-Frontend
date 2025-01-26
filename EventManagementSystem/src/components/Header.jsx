import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import global styles
import '../App.css'; // Import app-specific styles
import LogoutButton from './LogoutButton';
import { useSelector } from 'react-redux';

const Header = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <header>
            <div className="container">
                <h1>Event Management System</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        {user && <li><Link to="/create-event">Create Event</Link></li>}
                        {user && <li><Link to="/manage-location">Manage Locations</Link></li>}
                        {user && <li><Link to="/manage-category">Manage Categories</Link></li>}  {/* New link */}
                        <li><Link to="/register">Register</Link></li>
                        {user ? (
                            <>
                                <li>Logged in as: {user.username || user.email}</li>
                                <li><LogoutButton /></li>
                            </>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;