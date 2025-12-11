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
  const initialCenter = useRef(false);

  useEffect(() => {
    if (!user || !user.username) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
          p => console.log(p.coords.accuracy),
           e => console.error(e),

        // Send location to server
        socket.emit("send-location", {
          userId: user.username,
          lat: latitude,
          lng: longitude,
        });

        // Create marker if not exist
        if (!markerRef.current) {
          markerRef.current = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`🙋‍♂️ ${user.username}`);
        } else {
          markerRef.current.setLatLng([latitude, longitude]);
        }

        // Initial center only ONCE
        if (!initialCenter.current) {
          map.setView([latitude, longitude], 16);
          initialCenter.current = true;
        }
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
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
    socket.on('update-locations', (users) => {
      console.log('Received all users:', users);
      setUsers(users);
    });

    return () => {
      socket.off('update-locations');
    };
  }, []);

  if (!authUser?.user) return <div>Loading user...</div>;

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
