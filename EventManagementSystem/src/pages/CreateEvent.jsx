import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice';

const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const storedToken = useSelector((state) => state.auth.token) || localStorage.getItem('token');
    const storedUser = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        categoryID: '',
        locationID: '',
    });

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!storedUser || !storedToken) {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken) {
                dispatch(setCredentials({ token: savedToken, user: savedUser }));
            } else {
                setError('User authentication required to create an event');
                navigate('/login');
            }
        }
    }, [dispatch, storedUser, storedToken, navigate]);

    useEffect(() => {
        const fetchCategoriesAndLocations = async () => {
            const authToken = storedToken || localStorage.getItem('token');
            if (!authToken) {
                setError('User authentication required to create an event');
                return;
            }

            try {
                const categoryResponse = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setCategories(categoryResponse.data);

                const locationResponse = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setLocations(locationResponse.data);
            } catch (error) {
                setError('Error fetching categories or locations');
            }
        };

        fetchCategoriesAndLocations();
    }, [storedToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission triggered');

        const currentToken = storedToken || localStorage.getItem('token');
        const currentUser = storedUser || JSON.parse(localStorage.getItem('user'));

        console.log('User:', currentUser);
        console.log('Token:', currentToken);

        if (!currentUser || !currentUser.userID || !currentToken) {
            setError('User authentication required to create an event');
            return;
        }

        const submissionData = {
            Title: formData.title,
            Description: formData.description,
            StartDate: new Date(formData.startTime),
            EndDate: new Date(formData.endTime),
            CreatedBy: parseInt(currentUser.userID, 10),
            CategoryID: parseInt(formData.categoryID, 10),
            LocationID: parseInt(formData.locationID, 10)
        };

        try {
            const response = await axios.post(
                'https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Event',
                submissionData,
                {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert('Event created successfully!');
            navigate('/events');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(JSON.stringify(error.response.data));
            } else {
                setError('Error creating event');
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
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
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
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;