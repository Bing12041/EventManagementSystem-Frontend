import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        StartDate: '',
        EndDate: '',
        CreatedBy: '',
        CategoryID: '',
        LocationID: ''
    });
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchCategoriesAndLocations = async () => {
            try {
                // Fetch categories
                const categoryResponse = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCategories(categoryResponse.data);

                // Fetch locations
                const locationResponse = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLocations(locationResponse.data);
            } catch (error) {
                console.error('Error fetching categories or locations:', error);
                setError('Error fetching categories or locations');
            }
        };

        fetchCategoriesAndLocations();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.Title || !formData.Description || !formData.StartDate || !formData.EndDate || !formData.CategoryID || !formData.LocationID) {
            setError('Please fill all fields');
            return false;
        }

        const startDate = new Date(formData.StartDate);
        const endDate = new Date(formData.EndDate);

        if (startDate >= endDate) {
            setError('End date must be after start date');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            formData.CreatedBy = user.UserID; // Adjust based on your auth state structure

            try {
                const response = await axios.post('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                alert('Event created successfully!');
                navigate('/events'); // Redirect to the event list after creation
            } catch (error) {
                if (error.response) {
                    setError(error.response.data || 'Error creating event');
                } else if (error.request) {
                    setError('No response from server');
                } else {
                    setError('Error setting up the request');
                }
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="container">
            <h2>Create Event</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    required
                />
                <textarea
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    required
                />
                <input
                    type="datetime-local"
                    name="StartDate"
                    value={formData.StartDate}
                    onChange={handleChange}
                    placeholder="Start Date & Time"
                    required
                />
                <input
                    type="datetime-local"
                    name="EndDate"
                    value={formData.EndDate}
                    onChange={handleChange}
                    placeholder="End Date & Time"
                    required
                />
                <select
                    name="CategoryID"
                    value={formData.CategoryID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.CategoryID} value={category.CategoryID}>
                            {category.Name}
                        </option>
                    ))}
                </select>
                <select
                    name="LocationID"
                    value={formData.LocationID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location.LocationID} value={location.LocationID}>
                            {`${location.Address}, ${location.City}, ${location.State}`}
                        </option>
                    ))}
                </select>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;