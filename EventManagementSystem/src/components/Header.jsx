import React from 'react';
import '../index.css'; // Import global styles
import '../App.css'; // Import app-specific styles

const Header = () => {
    return (
        <header>
            <div className="container">
                <h1>Event Management System</h1>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#events">Events</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;