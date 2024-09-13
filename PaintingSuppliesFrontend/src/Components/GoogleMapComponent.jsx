import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, MarkerF, InfoWindowF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const headquartersLocation = {
  lat: 46.065035629443905,
  lng: 23.57234215686658
};

function GoogleMapComponent() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userInfoWindowOpen, setUserInfoWindowOpen] = useState(false);
  const [hqInfoWindowOpen, setHqInfoWindowOpen] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
        console.log('User location:', { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (currentPosition) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentPosition,
          destination: headquartersLocation,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          console.log('Directions service status:', status);
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('Directions result:', result);
            setDirections(result);
            
            // Calculate distance and update state
            const route = result.routes[0];
            const distance = route.legs[0].distance.text;
            setDistance(distance);
          } else {
            console.error(`Error fetching directions: ${status}`, result);
          }
        }
      );
    }
  }, [currentPosition]);

  const toggleUserInfoWindow = () => {
    setUserInfoWindowOpen(!userInfoWindowOpen);
  };

  const toggleHqInfoWindow = () => {
    setHqInfoWindowOpen(!hqInfoWindowOpen);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD3JxK_FgS4h9CA1bbfE-i84CJKdV9srsQ">
      <GoogleMap mapContainerStyle={containerStyle} center={headquartersLocation} zoom={14}>
        {currentPosition && (
          <MarkerF
            position={currentPosition}
            onClick={toggleUserInfoWindow}
          />
        )}
        {userInfoWindowOpen && currentPosition && (
          <InfoWindowF
            position={currentPosition}
            onCloseClick={toggleUserInfoWindow}
          >
            <div>
              <h2>Your Location</h2>
              <p>Coordinates: {currentPosition.lat}, {currentPosition.lng}</p>
            </div>
          </InfoWindowF>
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: 'black',
                strokeOpacity: 1,
                strokeWeight: 5
              }
            }}
          />
        )}
        <MarkerF
          position={headquartersLocation}
          title={'My Headquarters'}
          onClick={toggleHqInfoWindow}
        />
        {hqInfoWindowOpen && (
          <InfoWindowF
            position={headquartersLocation}
            onCloseClick={toggleHqInfoWindow}
          >
            <div>
              <h2>My Headquarters</h2>
              <p>Coordinates: {headquartersLocation.lat}, {headquartersLocation.lng}</p>
              <p>Distance: {distance}</p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
