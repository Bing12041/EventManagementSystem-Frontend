import React from 'react';
import '../App.css';

const Home = () => {
    return (
        <div className="home-container">
            <h2 className="home-title">Welcome to the Event Management System</h2>
            <p className="home-description">Here you can manage all your events!</p>
            <div className="home-cta">
                <a href="/events" className="button">View Events</a>
                <a href="/create-event" className="button">Create Event</a>
            </div>
        </div>
    );
};

export default Home;