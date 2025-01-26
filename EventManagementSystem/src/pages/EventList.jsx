import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the headers if authentication is required
                    }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                // Handle errors, perhaps show a message to the user
            }
        };

        fetchEvents();
    }, [token]);

    return (
        <div className="container">
            <h2>Event List</h2>
            {events.length > 0 ? (
                <ul>
                    {events.map(event => (
                        <li key={event.EventID}>
                            <h3>{event.Title}</h3>
                            <p>Date: {new Date(event.StartDate).toLocaleDateString()} - {new Date(event.EndDate).toLocaleDateString()}</p>
                            <p>Location: {event.Location?.Name || 'Location not specified'}</p>
                            <p>Category: {event.Category?.Name || 'Category not specified'}</p>
                            <p>Description: {event.Description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events to display.</p>
            )}
        </div>
    );
};

export default EventList;