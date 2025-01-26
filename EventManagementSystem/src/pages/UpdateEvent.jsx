import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        categoryID: '',
        locationID: '',
        createdBy: '' // added here to match the DTO requirement
    });
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventAndLists = async () => {
            try {
                // Fetch event details
                const eventResponse = await axios.get(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event/${eventId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFormData({
                    title: eventResponse.data.title,
                    description: eventResponse.data.description,
                    startDate: new Date(eventResponse.data.startDate).toISOString().slice(0, 16),
                    endDate: new Date(eventResponse.data.endDate).toISOString().slice(0, 16),
                    categoryID: eventResponse.data.categoryID.toString(),
                    locationID: eventResponse.data.locationID.toString(),
                    createdBy: eventResponse.data.createdBy.toString() // set here from the API response
                });

                // Fetch categories and locations
                const [categoriesResponse, locationsResponse] = await Promise.all([
                    axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                setCategories(categoriesResponse.data);
                setLocations(locationsResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch event details. Please try again.');
            }
        };

        fetchEventAndLists();
    }, [eventId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event/${eventId}`, {
                ...formData,
                // Convert back to number for the API (assuming the API expects numbers)
                createdBy: parseInt(formData.createdBy, 10)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Event updated successfully!');
            navigate('/events');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(JSON.stringify(error.response.data));
            } else {
                setError('Error updating event');
            }
            console.error('Error updating event:', error);
        }
    };

    return (
        <div className="container">
            <h2>Update Event</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Event Title" 
                    required 
                />
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Event Description" 
                    required 
                />
                <input 
                    type="datetime-local" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="datetime-local" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    required 
                />
                <select 
                    name="categoryID" 
                    value={formData.categoryID} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.categoryID} value={category.categoryID}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select 
                    name="locationID" 
                    value={formData.locationID} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location.locationID} value={location.locationID}>
                            {location.address}
                        </option>
                    ))}
                </select>
                {/* createdBy is not rendered here because it shouldn't be user-editable */}
                <button type="submit">Update Event</button>
            </form>
        </div>
    );
};

export default UpdateEvent;