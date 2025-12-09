import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useAuthStore } from '../lib/authStore';
import 'leaflet/dist/leaflet.css';
import '../styleCss/MapView.css';
import { useEffect, useState, useRef} from 'react';
import L from 'leaflet';
import { socket } from '../lib/socket';
import { Marker, Popup } from 'react-leaflet';

function LocationMarker({ user }) {
  const map = useMap();
    const markerRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Watch user location continuously
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Send location to server
        socket.emit('send-location', {
          userId: user.username, // use username as id
          lat: latitude,
          lng: longitude,
        });

        // Add/update marker for current user
       if (!markerRef.current) {
          markerRef.current = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`🙋‍♂️ ${user.username}`)
            .openPopup();
        } else {
          markerRef.current.setLatLng([latitude, longitude]);
        }

        map.setView([latitude, longitude], 16);
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 3000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map, user]);

  return null;
}

export default function MapView() {
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [users, setUsers] = useState({});

  // Fetch authenticated user on mount
  useEffect(() => {
    if (!authUser && isCheckingAuth) {
      checkAuth();
    }
  }, [authUser, isCheckingAuth, checkAuth]);

  // Listen for updates from server
  useEffect(() => {
    socket.on('update-locations', (allUsers) => {
      setUsers(allUsers);
    });

    return () => {
      socket.off('update-locations');
    };
  }, []);

  if (!authUser) return <div>Loading user...</div>;

  const currentUser = { username: authUser.user.username };

  return (
    <div className='container'>
      <h1>Tracker</h1>
      <div className='map-container'>
        <MapContainer center={[14.2105, 121.0404]} zoom={13} className='map'>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarker user={currentUser} />

          {/* Render other users */}
          {Object.entries(users).map(([id, coords]) => (
            <Marker key={id} position={[coords.lat, coords.lng]}>
              <Popup>{id}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
