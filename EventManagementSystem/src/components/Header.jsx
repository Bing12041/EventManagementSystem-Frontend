import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import global styles
import '../app.css'; // Import app-specific styles

const Header = () => {
    return (
        <header>
            <div className="container">
                <h1>Event Management System</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;