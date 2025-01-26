import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ManageLocation = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({
        address: '',
        city: '',
        state: '',
        country: ''
    });
    const [error, setError] = useState('');
    const [editLocation, setEditLocation] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!token) {
                setError('You need to be logged in to manage locations');
                return;
            }
            try {
                const response = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLocations(response.data);
                setError(''); 
            } catch (error) {
                handleError(error, 'fetching');
            }
        };
        fetchLocations();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLocation(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('You need to be logged in to add a location');
            return;
        }
        try {
            const response = await axios.post('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location', newLocation, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Location added successfully!');
            setLocations(prev => [...prev, response.data]);
            setNewLocation({ address: '', city: '', state: '', country: '' });
            setError('');
        } catch (error) {
            handleError(error, 'adding');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                await axios.delete(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLocations(locations.filter(location => location.locationID !== id));
                alert('Location deleted successfully!');
            } catch (error) {
                handleError(error, 'deleting');
            }
        }
    };

    const handleEdit = (location) => {
        setEditLocation({ ...location });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Location/${editLocation.locationID}`, editLocation, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLocations(locations.map(loc => loc.locationID === editLocation.locationID ? response.data : loc));
            setEditLocation(null);
            alert('Location updated successfully!');
        } catch (error) {
            handleError(error, 'updating');
        }
    };

    const handleError = (error, action) => {
        if (error.response) {
            if (error.response.status === 401) {
                setError('Unauthorized access. Please log in again.');
            } else {
                setError(`Error ${action} location: ${error.response.data || 'Unknown error'}`);
            }
        } else {
            setError(`Error ${action} location: No server response`);
        }
        console.error(`Error ${action} location:`, error);
    };

    return (
        <div className="container">
            <h2>Manage Locations</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <h3>Add New Location</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="address" 
                    value={newLocation.address} 
                    onChange={handleChange} 
                    placeholder="Address" 
                    required 
                />
                <input 
                    type="text" 
                    name="city" 
                    value={newLocation.city} 
                    onChange={handleChange} 
                    placeholder="City" 
                    required 
                />
                <input 
                    type="text" 
                    name="state" 
                    value={newLocation.state} 
                    onChange={handleChange} 
                    placeholder="State" 
                    required 
                />
                <input 
                    type="text" 
                    name="country" 
                    value={newLocation.country} 
                    onChange={handleChange} 
                    placeholder="Country" 
                    required 
                />
                <button type="submit">Add Location</button>
            </form>

            <h3>Current Locations</h3>
            <ul>
                {locations.map(location => (
                    <li key={location.locationID}>
                        {`${location.address}, ${location.city}, ${location.state}, ${location.country}`}
                        <button onClick={() => handleEdit(location)}>Edit</button>
                        <button onClick={() => handleDelete(location.locationID)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editLocation && (
                <form onSubmit={handleUpdate}>
                    <input 
                        type="text" 
                        name="address" 
                        value={editLocation.address} 
                        onChange={(e) => setEditLocation({ ...editLocation, address: e.target.value })} 
                        placeholder="Address" 
                        required 
                    />
                    <input 
                        type="text" 
                        name="city" 
                        value={editLocation.city} 
                        onChange={(e) => setEditLocation({ ...editLocation, city: e.target.value })} 
                        placeholder="City" 
                        required 
                    />
                    <input 
                        type="text" 
                        name="state" 
                        value={editLocation.state} 
                        onChange={(e) => setEditLocation({ ...editLocation, state: e.target.value })} 
                        placeholder="State" 
                        required 
                    />
                    <input 
                        type="text" 
                        name="country" 
                        value={editLocation.country} 
                        onChange={(e) => setEditLocation({ ...editLocation, country: e.target.value })} 
                        placeholder="Country" 
                        required 
                    />
                    <button type="submit">Update Location</button>
                    <button onClick={() => setEditLocation(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default ManageLocation;