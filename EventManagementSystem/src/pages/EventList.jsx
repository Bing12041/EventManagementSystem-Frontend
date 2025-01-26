import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RSVPButton from '../components/RSVPButton';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [token]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            alert('Failed to load events. Please try again later.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // After successful deletion, refresh the event list
            fetchEvents();
            alert('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('An error occurred while deleting the event');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="container">
            <h2>Event List</h2>
            {events.length > 0 ? (
                <ul>
                    {events.map(event => (
                        <li key={`${event.eventID}-${event.startDate}`}>
                            <h3>{event.title}</h3>
                            <p>Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                            <p>Location: {event.locationID}</p>
                            <p>Category: {event.categoryID}</p>
                            <p>Description: {event.description || 'No description available'}</p>
                            {user ? (
                                <RSVPButton eventId={event.eventID} />
                            ) : (
                                <p>Please log in to RSVP</p>
                            )}
                            <button onClick={() => navigate(`/events/${event.eventID}/edit`)}>Update</button>
                            <button onClick={() => handleDeleteEvent(event.eventID)}>Delete</button>
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