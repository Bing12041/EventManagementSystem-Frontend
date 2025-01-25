import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/User/register', user);
            setSuccess(true);
            console.log('User registered:', response.data);
            // Here you might want to redirect to login or home page after a successful registration
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('An error occurred while registering. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            {success && <p>Registration successful! You can now log in.</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" required />
                <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" required />
                <input type="text" name="name" value={user.name} onChange={handleChange} placeholder="Full Name" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;