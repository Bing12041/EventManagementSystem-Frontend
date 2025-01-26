import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        Name: ''
    });
    const [error, setError] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) {
                setError('You need to be logged in to manage categories');
                return;
            }
            try {
                const response = await axios.get('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCategories(response.data);
                setError(''); 
            } catch (error) {
                handleError(error, 'fetching');
            }
        };
        fetchCategories();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('You need to be logged in to add a category');
            return;
        }
        try {
            const response = await axios.post('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category', newCategory, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Category added successfully!');
            setCategories(prev => [...prev, response.data]);
            setNewCategory({ Name: '' });
            setError('');
        } catch (error) {
            handleError(error, 'adding');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCategories(categories.filter(category => category.categoryID !== id));
                alert('Category deleted successfully!');
            } catch (error) {
                handleError(error, 'deleting');
            }
        }
    };

    const handleEdit = (category) => {
        setEditCategory({ ...category });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/Category/${editCategory.categoryID}`, editCategory, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(categories.map(cat => cat.categoryID === editCategory.categoryID ? response.data : cat));
            setEditCategory(null);
            alert('Category updated successfully!');
        } catch (error) {
            handleError(error, 'updating');
        }
    };

    const handleError = (error, action) => {
        if (error.response) {
            if (error.response.status === 401) {
                setError('Unauthorized access. Please log in again.');
            } else {
                setError(`Error ${action} category: ${error.response.data || 'Unknown error'}`);
            }
        } else {
            setError(`Error ${action} category: No server response`);
        }
        console.error(`Error ${action} category:`, error);
    };

    return (
        <div className="container">
            <h2>Manage Categories</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <h3>Add New Category</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="Name" 
                    value={newCategory.Name} 
                    onChange={handleChange} 
                    placeholder="Category Name" 
                    required 
                />
                <button type="submit">Add Category</button>
            </form>

            <h3>Current Categories</h3>
            <ul>
                {categories.map(category => (
                    <li key={category.categoryID}>
                        {category.Name}
                        <button onClick={() => handleEdit(category)}>Edit</button>
                        <button onClick={() => handleDelete(category.categoryID)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editCategory && (
                <form onSubmit={handleUpdate}>
                    <input 
                        type="text" 
                        name="Name" 
                        value={editCategory.Name} 
                        onChange={(e) => setEditCategory({ ...editCategory, Name: e.target.value })} 
                        placeholder="Category Name" 
                        required 
                    />
                    <button type="submit">Update Category</button>
                    <button onClick={() => setEditCategory(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default ManageCategory;