import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RSVPButton = ({ eventId }) => {
    const [rsvpStatus, setRSVPStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const checkRSVPStatus = async () => {
            if (user && user.userID && token) {
                try {
                    const response = await axios.get(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/RSVP/user/${user.userID}/event/${eventId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setRSVPStatus(response.data.status || 'Not RSVPed');
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        setRSVPStatus('Not RSVPed');
                    } else {
                        console.error('Error checking RSVP status:', error);
                    }
                }
            }
        };
        checkRSVPStatus();
    }, [eventId, token, user]);

    const handleRSVP = async (newStatus) => {
        setLoading(true);
        try {
            if (rsvpStatus === 'Not RSVPed') {
                await axios.post('https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/RSVP', {
                    userID: user.userID,
                    eventID: eventId,
                    status: newStatus
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.put(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/RSVP/${user.userID}/${eventId}`, {
                    newStatus: newStatus
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            setRSVPStatus(newStatus);
        } catch (error) {
            console.error('Error handling RSVP:', error);
            alert('Failed to update RSVP status');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRSVP = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://eventmanagementsystem-dra9a9cffed8bwcw.eastus2-01.azurewebsites.net/api/RSVP/${user.userID}/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRSVPStatus('Not RSVPed');
        } catch (error) {
            console.error('Error canceling RSVP:', error);
            alert('Failed to cancel RSVP');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>Please log in to RSVP</p>;

    return (
        <div>
            {loading ? (
                <p>Updating...</p>
            ) : (
                <>
                    {rsvpStatus !== 'Not RSVPed' ? (
                        <button onClick={handleCancelRSVP}>Cancel RSVP</button>
                    ) : (
                        <button onClick={() => handleRSVP('Attending')}>RSVP</button>
                    )}
                    <p>RSVP Status: {rsvpStatus}</p>
                </>
            )}
        </div>
    );
};

export default RSVPButton;