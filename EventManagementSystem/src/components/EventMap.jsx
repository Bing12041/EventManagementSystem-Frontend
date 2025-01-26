import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

const EventMap = () => {
    const mapState = useSelector((state) => state.map);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback((map) => {
        setMap(null);
    }, []);

    // Destructure with default values to avoid undefined errors
    const { center = defaultCenter, zoom = 12 } = mapState || {};

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {/* Add markers based on events */}
        </GoogleMap>
    ) : <div>Loading...</div>;
};

export default React.memo(EventMap);