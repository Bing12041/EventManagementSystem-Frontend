import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RSVPButton from '../components/RSVPButton';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const fetchAllData = async () => {
        try {
            // Fetch events, locations, and categories
            const [eventsResponse, locationsResponse, categoriesResponse] = await Promise.all([
                axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            setEvents(eventsResponse.data);
            setLocations(locationsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data. Please try again later.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // After successful deletion, refresh all data
            fetchAllData();
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

    // Helper functions to get location and category names by ID
    const getLocationName = (locationId) => {
        const location = locations.find(loc => loc.locationID === locationId);
        return location ? location.address : 'Location not found';
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.categoryID === categoryId);
        return category ? category.name : 'Category not found';
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
                            <p>Location: {getLocationName(event.locationID)}</p>
                            <p>Category: {getCategoryName(event.categoryID)}</p>
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